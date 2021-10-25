const authMiddelware = require("./authentication");

module.exports = [
    { path: "*", mid: authMiddelware },
    { path: "*", mid: (_, __, next) => setTimeout(() => next(), 200) }, // to make req slower for testing
]