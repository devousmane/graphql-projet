export async function fetchBasicData(jwt) {
    const graphqlQuery = `
     {
         user {
             firstName
             lastName
             campus
             auditRatio
             email
         }
     }
 `;

    const graphqlResponse = await fetch('https://learn.zone01dakar.sn/api/graphql-engine/v1/graphql', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${jwt}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: graphqlQuery })
    });

    if (!graphqlResponse.ok) {
        throw new Error('GraphQL response was not ok');
    }

    const graphqlData = await graphqlResponse.json();
    return graphqlData.data.user[0]
}

export async function fetchTotalXP(jwt) {
    const graphqlQuery = `
    {
        transaction_aggregate(
           where: {transaction_type: {type: {_eq: "xp"}}, event: {path: {_eq: "/dakar/div-01"}}}
         ) {
           aggregate {
             sum {
               amount
             }
           }
         }
    }
`;

    const graphqlResponse = await fetch('https://learn.zone01dakar.sn/api/graphql-engine/v1/graphql', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${jwt}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: graphqlQuery })
    });

    if (!graphqlResponse.ok) {
        throw new Error('GraphQL response was not ok');
    }

    const graphqlData = await graphqlResponse.json();
    console.log("view", graphqlData);
    return graphqlData.data.transaction_aggregate.aggregate.sum.amount
}

export async function fetchXpByProject(jwt) {
    const graphqlQuery = `
    {
        user {
          id
          transactions(
            where: {_and: [{path: {_like: "%div-01%"}}, {path: {_nlike: "%checkpoint%"}}, {path: {_nlike: "%piscine%"}}, {type: {_eq: "xp"}}]}
          ) {
            amount
            path
          }
        }
      }
    `;

    const graphqlResponse = await fetch('https://learn.zone01dakar.sn/api/graphql-engine/v1/graphql', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${jwt}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: graphqlQuery })
    });

    if (!graphqlResponse.ok) {
        throw new Error('GraphQL response was not ok');
    }

    const graphqlData = await graphqlResponse.json();
    return graphqlData.data.user[0].transactions;;
}


export async function fetchUserGroups(jwt) {
    if (!jwt) {
        console.error('No JWT found, user might not be logged in.');
        return;
    }

    // Définir la requête GraphQL
    const graphqlQuery = `
    {
        user {
            login
            groups {
                group {
                    members {
                        userLogin
                    }
                }
            }
        }
    }`;

    try {
        const graphqlResponse = await fetch('https://learn.zone01dakar.sn/api/graphql-engine/v1/graphql', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${jwt}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: graphqlQuery })
        });

        if (!graphqlResponse.ok) {
            throw new Error('GraphQL response was not ok');
        }

        const graphqlData = await graphqlResponse.json();

        // Vérifier la structure des données
        const user = graphqlData.data.user;
        if (!user) {
            throw new Error('User data not found in GraphQL response');
        }

        const userLogin = user[0].login;
        const userGroups = user[0].groups;

        // Extraire les membres de chaque groupe
        const members = userGroups.flatMap(group => group.group.members);

        // Filtrer les membres où userLogin n'est pas égal à user.login
        const filteredMembers = members.filter(member => member.userLogin !== userLogin);


        // Créer une Map pour compter les occurrences de userLogin
        const userLoginCountMap = filteredMembers.reduce((map, member) => {
            const { userLogin } = member;
            if (map.has(userLogin)) {
                map.set(userLogin, map.get(userLogin) + 1);
            } else {
                map.set(userLogin, 1);
            }
            return map;
        }, new Map());

        console.log('User Login Count Map:', userLoginCountMap);

        return userLoginCountMap;

    } catch (error) {
        console.error('Error:', error);
        // Gérer l'erreur de manière appropriée pour votre application
    }
}
