var $ = require('jquery')
var UserProfileList = require('../models/userprofilemodel')

var HOST = 'http://localhost:3000/api/UserProfiles'

module.exports = {
    getListOf: function (callback) {
        $.ajax({
            url: HOST
        }).done(function (response) {
            var userProfile = new UserProfileList(response)

            callback(userProfile)
        })
    },
    get: function () {

    }
}
