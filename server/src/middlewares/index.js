const { DEBUG } = require("../settings");
const authMiddelware = require("./authentication");

const middlewares = [
    { path: "*", mid: authMiddelware },
];
if (DEBUG) {
    // to make req slower for testing
    middlewares.push({ path: "*", mid: (_, __, next) => setTimeout(() => next(), 300) })
}

module.exports = middlewares;