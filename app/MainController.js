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
        return path === '/admin/dashboard' ||
            path === '/admin/decentralization-account' ||
            path === '/admin/decentralization-list' ||
            path === '/admin/register-business/business-information';
    };

    $scope.logoutAuth = function () {
        AuthService.clearAuthData();
        $scope.isAuthenticated = false;
        window.location.href = '/home';
    };

    $scope.logoutAuthAdmin = function () {
        AuthService.clearAuthData();
        $scope.isAuthenticated = false;
        window.location.href = '/admin';
    };

    /**
     * Kiểm tra đường dẫn hiện tại
     * @param viewLocation
     * @returns {boolean}
     */
    $scope.isActive = function (viewLocation) {
        return viewLocation === $location.path();
    };

    /**
     * Ẩn sidebar
     * @returns {boolean}
     */
    $scope.hideSidebar = function () {
        return $scope.isActive('/admin/register-business/business-information');
    };

    /**
     * Bỏ margin khi vào đường dẫn đó
     * @returns {{display: string}|{}}
     */
    $scope.sidebarStyle = function () {
        return $scope.isActive('/admin/register-business/business-information') ? {'margin': '0'} : {};
    };
});
