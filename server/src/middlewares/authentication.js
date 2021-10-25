const provideAuthenticationInfos = require("../utils/provideAuthenticationInfos");

module.exports = async(req, _, next) => {
    await provideAuthenticationInfos(req);
    next();
};