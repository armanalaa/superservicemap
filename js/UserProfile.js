var UserProfile = {

    open: false,
    varName: "UserProfile",
    idMenu: "userProfileMenu",

    show: function () {
        if ($("#" + UserProfile.idMenu).length == 0) {
            $("#indexPage").append("<div id=\"" + UserProfile.idMenu + "\" class=\"commonMenu\"></div>")
        }
        ViewManager.render({
            "username": EngagerManager.username,
            "userProfile": EngagerManager.userProfile,
            "enableAssistant": EngagerManager.enableAssistant,
            "enableTrackerLocation": EngagerManager.enableTrackerLocation
        }, "#" + UserProfile.idMenu, UserProfile.varName);
        $("#" + UserProfile.idMenu).show();
        UserProfile.open = true;

        EngagerManager.getUserSubscription();
        application.setBackButtonListener();
        $('.btn-toggle').click(function () {
            $(this).find('.btn').toggleClass('active');
            $(this).find('.offButton').toggleClass('btn-danger').toggleClass(
                'btn-default');
            $(this).find('.onButton').toggleClass('btn-success').toggleClass(
                'btn-default');
        });
        application.addingMenuToCheck(UserProfile.varName);
    },

    hide: function () {
        $("#" + UserProfile.idMenu).remove();
        application.removingMenuToCheck(UserProfile.varName);
        UserProfile.open = false;
        if (PrincipalMenu.fromPrincipalMenu) {
            PrincipalMenu.show();
        }
    },

    checkForBackButton: function () {
        if (UserProfile.open) {
            UserProfile.hide();
            if (PrincipalMenu.fromPrincipalMenu) {
                PrincipalMenu.show();
            }
        }
    },

    logoutFromProfile: function () {
        Authentication.logout();
        UserProfile.hide();
    }
};