var $ = require('jquery')

function UserProfile(raw) {
    UserProfile.prototype.init.call(this, raw)
}

$.extend(UserProfile.prototype, {
    usercode: null,
    displayname: null,
    fullname: null,
    gender: null,
    department: null,
    avatar: null,
    membersince: null,
    workingsite: null,
    currentcustomer: null,
    id: null,
    init: function (raw) {
        var self = this

        self.usercode = raw && raw.usercode ? raw.usercode : null
        self.displayname = raw && raw.displayname ? raw.displayname : null
        self.fullname = raw && raw.fullname ? raw.fullname : null
        self.gender = raw && raw.gender ? raw.gender : null
        self.department = raw && raw.department ? raw.department : null
        self.avatar = raw && raw.avatar ? raw.avatar : null
        self.membersince = raw && raw.usermembersincecode ? raw.membersince : null
        self.workingsite = raw && raw.workingsite ? raw.workingsite : null
        self.currentcustomer = raw && raw.currentcustomer ? raw.currentcustomer : null
        self.membersiidnce = raw && raw.id ? raw.id : null
    }

})

module.exports = UserProfile

function UserProfileList(raw) {
    UserProfileList.prototype.init.call(this, raw)
}

$.extend(UserProfileList.prototype, {
    items: null,

    init: function (raw) {
        var self = this

        var items = []

        if (raw) {
            for (var i = 0; i < Object.keys(raw).length; i++) {
                items.push(raw[Object.keys(raw)[i]])
            }
        }

        self.items = items
    },

    update: function (raw) {
        var self = this

        var items = []

        for (var i = 0; i < Object.keys(raw).length; i++) {
            items.push(raw[Object.keys(raw)[i]])
        }

        self.items = items
    }
})

module.exports = UserProfileList
