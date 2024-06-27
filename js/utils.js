import { fetchBasicData, fetchTotalXP, fetchXpByProject, fetchUserGroups } from "./fetchUser.js";
import { logInTemplate, homeTemplate } from "./template.js";
import { generateBarChartSVG, createRadarChart, createPolarAreaChart } from "./chart.js";


export function HandleLogin() {
    document.querySelector("body").innerHTML = logInTemplate;
    document.getElementById('loginForm').addEventListener('submit', function (event) {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Encode credentials in Base64 for Basic Auth
        const credentials = btoa(unescape(encodeURIComponent(username + ':' + password)));

        // API endpoint from your setup instructions
        const apiUrl = 'https://learn.zone01dakar.sn/api/auth/signin';

        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${credentials}`,
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        }).then(data => {
            // Assurez-vous que data.token est le token JWT
            const jwt = data;
            sessionStorage.setItem('jwt', jwt);

            dataSetup(jwt);



            // Redirect to profile page or wherever needed
            // window.location.href = '/profile.html';
        }).catch(error => {
            console.error('Error:', error);
            document.getElementById('error').textContent = 'Failed to login. Check your credentials.';
        });
    });
}


export function dataSetup(jwt) {

    // Utilisez le template homeTemplate ici
    const body = document.querySelector('body');
    body.innerHTML = homeTemplate;

    fetchBasicData(jwt)
        .then(userData => {
            const { firstName, lastName, campus, auditRatio, email } = userData;

            // Vous pouvez maintenant afficher les données utilisateur dans homeTemplate
            // Par exemple, si homeTemplate a des éléments avec les IDs correspondants:
            document.querySelector("h1").textContent += firstName + " " + lastName + " " + "😁";
            document.getElementById('campus').textContent += "🎓 " + campus[0].toUpperCase() + campus.slice(1).toLowerCase();
            document.getElementById('auditratio').textContent += "🖊️ " + Math.round(auditRatio * 10) / 10;

            logOut();
        })
        .catch(error => {
            document.querySelector("body").innerHTML = logInTemplate
            sessionStorage.removeItem('jwt')
            window.location.reload()
        });
    fetchTotalXP(jwt)
        .then(data => {

            function convertSize(size) {
                const units = ['B', 'Kb', 'Mb', 'Gb', 'Tb'];
                let unitIndex = 0;

                while (size >= 1000 && unitIndex < units.length - 1) {
                    size /= 1000;
                    unitIndex++;
                }

                return `${size.toFixed(2)} ${units[unitIndex]}`;
            }


            // document.getElementById("totalXP").textContent+=data/1000 + " kB"
            document.getElementById("totalXP").textContent += "⭐ " + convertSize(data)
        })
        .catch(error => {
            console.error('Error fetching user data:', error);
            document.getElementById('error').textContent = 'Failed to fetch user data.';
            body.innerHTML = logInTemplate;
            console.log("hello");
        });
    generateBarChartSVG(jwt)
        .then(svgString => {
            // Sélection de la div avec l'ID "chart"
            const chartDiv = document.getElementById('chart1');

            // Insérer le SVG dans la div
            chartDiv.innerHTML = svgString;
        })
        .catch(error => {
            console.error('Erreur lors de l\'utilisation de generateBarChartSVG :', error);
        });

    createPolarAreaChart(jwt)

}

export function logOut() {
    document.getElementById("logOut").addEventListener("click", function () {
        document.querySelector("body").innerHTML = logInTemplate
        sessionStorage.removeItem('jwt')
        window.location.reload()
    })
}