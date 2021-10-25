const authentication = require("./authentication");
const ensureAuthentication = require("./ensureAuthentication");


module.exports = [
    authentication,
    ensureAuthentication
]