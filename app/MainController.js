travel_app.controller('MainController', function ($scope, $location, $anchorScroll, AuthService) {
    $anchorScroll();

    $scope.isAuthenticated = AuthService.getToken() !== null;
    $scope.user = AuthService.getUser();

    if (AuthService.getUser() !== null) {
        $scope.role = AuthService.getUser().roles[0].nameRole
    }

    $scope.goHome = function () {
        window.location.href = '/home';
    }

    $scope.isAuthPage = function () {
        const path = $location.path();
        return path === '/sign-in' ||
            path === '/sign-up' ||
            path === '/forgot-password' ||
            path === '/admin';
    };

    $scope.isManagerPage = function () {
        const path = $location.path();
        return path === '/admin/dashboard';
    };

    $scope.logoutAuth = function () {
        AuthService.clearAuthData();
        $scope.isAuthenticated = false;
        window.location.href = '/home';
    };
});
