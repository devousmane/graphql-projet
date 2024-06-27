export const logInTemplate = `
<div id="bienvenue">Bienvenue dans GraphQL</div>
<div id="logincontainer">
<form id="loginForm">
        <div id="container">
        <label for="username">Username/Email:</label>
        <input type="text" id="username" name="username" required placeholder="email or username">
        </div>
        <div id="container">
        <label for="password">Password:</label>
        <input type="password" id="password" name="password" required placeholder="password.....">
        </div>
        <button type="submit">Login</button>
    </form>
</div>
    <div id="error"></div>`

export const homeTemplate = `
<button type="button" id="logOut">logOut</button>
<h1>👋 Welcome, </h1>
    
    <div id="charts" style="display: flex;justify-content: space-evenly">
    <div id="info">
    <div id="infocontainer">
        <div id="campus">Campus: </div>
        <div id="totalXP">Total XP: </div>
        <div id="auditratio">Audit Ratio: </div>
    </div>
    </div>
    <div id="chart1" style="display: flex;justify-content: center;width:fit-content"></div>
    <div id="polarAreaChart" style="display: flex;justify-content: center;width:fit-content"></div>
    </div>
    `
    
