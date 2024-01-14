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

    /**
     * Kiểm tra nếu là Auth page thì xử lý giao diện
     * @returns {boolean}
     */
    $scope.isAuthPage = function () {
        const path = $location.path();
        return path === '/sign-in' ||
            path === '/sign-up' ||
            path === '/forgot-password' ||
            path === '/admin';
    };

    /**
     * Kiểm tra nếu là isManagerPage thì xử lý giao diện
     * @returns {boolean}
     */
    $scope.isManagerPage = function () {
        const path = $location.path();
        return path === '/admin/dashboard' ||
            path === '/admin/decentralization-account' ||
            path === '/admin/decentralization-list' ||
            // agent hotel
            path === '/admin/register-hotel' ||
            path === '/admin/register-hotel' ||
            path === '/admin/amenities/hotel-amenities-list' ||
            path === '/admin/amenities/hotel-amenities-list/new' ||
            path === '/admin/amenities/hotel-amenities-list/edit' ||
            // agent trans
            path === '/admin/register-transport' ||
            path === '/admin/transport-list' ||
            // admin template
            path === '/admin/hotel-type' ||
            path === '/admin/location-type' ||
            path === '/admin/tour-type' ||
            path === '/admin/transportation-type' ||
            path === '/admin/hotel-utility' ||
            path === '/admin/room-utility' ||
            path === '/admin/staff-add' ||
            path === '/admin/staff-edit' ||
            path === '/admin/staff-list' ||
            path === '/admin/agency-add' ||
            path === '/admin/agency-edit' ||
            path === '/admin/agency-list' ||
            path === '/admin/revenue' ||
            path === '/admin/statistical' ||
            path === '/admin/transport-list' ||
            // register success
            path === '/admin/register-hotel-success';
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
        const path = $location.path();
        return path === '/admin/register-hotel' ||
            path === '/admin/register-transport' ||
            path === '/admin/register-hotel-success';
    };

    /**
     * Bỏ margin khi vào đường dẫn đó
     * @returns {{display: string}|{}}
     */
    $scope.sidebarStyle = function () {
        const path = $location.path();
        const isActivePath = $scope.isActive(
            '/admin/register-hotel' ||
            '/admin/register-transport' ||
            '/admin/register-hotel-success'
        );
        return (path === '/admin/register-hotel' ||
            path === '/admin/register-transport' ||
            path === '/admin/register-hotel-success') ||
        isActivePath ? {'margin': '0'} : {};
    };
});
