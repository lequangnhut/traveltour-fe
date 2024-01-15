travel_app.controller('MainController', function ($scope, $location, $window, $anchorScroll, AuthService) {
    $anchorScroll();
    $scope.activeNavItem = localStorage.getItem('activeNavItem') || null;

    $scope.isAuthenticated = AuthService.getToken() !== null;
    $scope.user = AuthService.getUser();

    if (AuthService.getUser() !== null) {
        $scope.role = AuthService.getUser().roles[0].nameRole
    }

    $scope.setActiveNavItem = function (navItem) {
        $scope.activeNavItem = navItem;
        localStorage.setItem('activeNavItem', navItem);
    };

    $window.addEventListener('beforeunload', function () {
        localStorage.setItem('activeNavItem', $scope.activeNavItem);
    });

    $scope.goHome = function () {
        window.location.href = '/home';
    }

    /**
     * Kiểm tra nếu là Auth page thì xử lý giao diện
     * @returns {boolean}
     */
    $scope.isAuthPage = function () {
        const authPaths = [
            '/sign-in',
            '/sign-up',
            '/forgot-password',
            '/login-admin'
        ];
        return authPaths.includes($location.path());
    };

    /**
     * Kiểm tra nếu là isManagerPage thì xử lý giao diện
     * @returns {boolean}
     */
    $scope.isBusinessPage = function () {
        const path = $location.path();
        return path.startsWith('/business');
    };

    $scope.isAdminPage = function () {
        const path = $location.path();
        return path.startsWith('/admin');
    };

    $scope.isManagerPage = function () {
        return $scope.isAdminPage() || $scope.isBusinessPage();
    };

    $scope.logoutAuth = function () {
        AuthService.clearAuthData();
        $scope.isAuthenticated = false;
        window.location.href = '/home';
    };

    $scope.logoutAuthAdmin = function () {
        AuthService.clearAuthData();
        $scope.isAuthenticated = false;
        localStorage.removeItem('activeNavItem');
        $location.path('/login-admin');
    };

    /**
     * Kiểm tra đường dẫn hiện tại
     * @param viewLocations
     * @returns {boolean}
     */
    $scope.isActive = function (viewLocations) {
        return viewLocations.includes($location.path());
    };

    /**
     * Ẩn sidebar
     * @returns {boolean}
     */
    $scope.hideSidebar = function () {
        const hiddenPaths = [
            '/business/register-hotel',
            '/business/register-hotel-success',
            '/business/register-transports',
            '/business/register-transport-success',
            '/business/register-visit',
            '/business/register-visits-success'
        ];
        return $scope.isActive(hiddenPaths);
    };

    /**
     * Bỏ margin khi vào đường dẫn đó
     * @returns {{display: string}|{}}
     */
    $scope.sidebarStyle = function () {
        const marginPaths = [
            '/business/register-hotel',
            '/business/register-hotel-success',
            '/business/register-transports',
            '/business/register-transport-success',
            '/business/register-visit',
            '/business/register-visits-success'
        ];
        return $scope.isActive(marginPaths) ? {'margin': '0'} : {};
    };
});