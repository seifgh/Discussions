const authMiddelware = require("./authentication");

module.exports = [
    { path: "*", mid: authMiddelware },
    { path: "*", mid: (_, __, next) => setTimeout(() => next(), 300) }, // to make req slower for testing
]