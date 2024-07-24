function getNewUserToken() {
    return "user_" + Math.random();
}

module.exports.getNewUserToken = getNewUserToken;