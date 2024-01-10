travel_app.controller('MainController', function ($scope, $location, $anchorScroll, AuthService) {
    $anchorScroll();

    $scope.isAuthenticated = AuthService.getToken() !== null;
    $scope.user = AuthService.getUser();

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

    $scope.logoutAdmin = function () {
        AuthService.logoutAuthAdmin().then(function successCallback() {
            window.location.href = '/admin';
        });
    };
});
