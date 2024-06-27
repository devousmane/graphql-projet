# GraphQL Profile Page Project

## Objectives

The objective of this project is to learn and implement the GraphQL query language by creating a personal profile page. The profile page will display data queried from a GraphQL endpoint provided by the platform.

## Key Requirements

### 1. Login Page
- Implement a login page that allows users to log in using either `username:password` or `email:password`.
- Utilize the signin endpoint to obtain a JWT for authentication.
- Display appropriate error messages for invalid credentials.
- Provide a logout function.
- Use Bearer authentication with the JWT to access the GraphQL API.

### 2. Profile Page
- Design a profile UI to display personal school information.
- Display at least three pieces of user information (e.g., basic user identification, XP amount, grades, audits, skills).
- Include a mandatory statistics section with at least two different graphs, created using SVG.
- Possible graph ideas include XP earned over time, XP earned by project, audit ratio, projects PASS and FAIL ratio, and more.

### 3. GraphQL Queries
- Use a variety of GraphQL query types: normal, nested, and those using arguments.
- Query data from tables such as `user`, `transaction`, `progress`, and `result`.
- Example queries:
  - Fetch user ID and login:
    ```graphql
    {
      user {
        id
        login
      }
    }
    ```
  - Fetch object details by ID:
    ```graphql
    {
      object(where: { id: { _eq: 3323 }}) {
        name
        type
      }
    }
    ```
  - Nested query to fetch result ID and associated user details:
    ```graphql
    {
      result {
        id
        user {
          id
          login
        }
      }
    }
    ```

### 4. Hosting
- Host the completed profile page on a platform of your choice (e.g., GitHub Pages, Netlify).

## Implementation Steps

### 1. Set Up Authentication
- Create a login page with fields for username/email and password.
- Implement authentication logic to send a POST request to the signin endpoint.
- Handle JWT retrieval and storage.

### 2. Build the Profile Page
- Design the UI for displaying user information.
- Implement GraphQL queries to fetch user data.
- Use the fetched data to populate the profile page.

### 3. Statistics Section
- Create SVG graphs to visualize user statistics.
- Ensure at least two different types of graphs are implemented.
- Possible data visualizations include progress over time, pass/fail ratios, etc.

### 4. GraphQL Query Implementation
- Write and test various GraphQL queries to fetch necessary data.
- Ensure queries cover normal, nested, and argument-based types.

### 5. Host the Application
- Choose a hosting platform.
- Deploy the application and ensure it is accessible.

## Additional Information

### Tables and Columns
- **user** table: Contains user information like `id` and `login`.
- **transaction** table: Contains transaction data including XP and audits.
- **progress** table: Tracks user progress with grades and timestamps.
- **result** table: Stores results of user activities.
- **object** table: Contains information about exercises and projects.

### GraphiQL
- Use the GraphiQL interface to explore the GraphQL schema and test queries.

## Learning Outcomes

By completing this project, you will gain hands-on experience with:
- GraphQL and GraphiQL
- JWT-based authentication and authorization
- Web hosting
- UI/UX principles and SVG-based data visualization

Good luck with your project! If you need further assistance, feel free to ask.
