import { HandleLogin, dataSetup } from "./utils.js";

function init() {
    const token = sessionStorage.getItem('jwt');
    if (token !== null) {
        dataSetup(token)
    } else {
        HandleLogin()
    }
}

init()

