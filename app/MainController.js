travel_app.controller('MainController', function ($scope, $rootScope, $location, $window, $timeout, $anchorScroll, AuthService, AgenciesServiceAG, HotelServiceAG, TransportServiceAG, VisitLocationServiceAG, NotificationService) {
    $anchorScroll();
    $scope.selectedRole = localStorage.getItem('selectedRole') || null;
    $scope.activeNavItem = localStorage.getItem('activeNavItem') || null;

    $scope.isAuthenticated = AuthService.getToken() !== null;
    let user = $scope.user = AuthService.getUser();

    function errorCallback() {
        $location.path('/admin/internal-server-error')
    }

    $scope.init = function () {
        /**
         * Lấy năm hiện tại và fill ở footer
         */
        $scope.year = new Date().getFullYear();

        /**
         * Hiển thị thông báo
         */
        const notification = NotificationService.getNotification();
        if (notification) {
            toastAlert(notification.type, notification.message);
            NotificationService.clearNotification();
        }

        /**
         * Set role gọi ra slide bar
         */
        if (AuthService.getUser() !== null) {
            $scope.roles = AuthService.getUser().roles.map(role => role.nameRole);
        }
        $scope.hasRole = function (roleToCheck) {
            return $scope.roles.includes(roleToCheck);
        };

        /**
         * Hiển thị nội dung dựa trên vai trò được chọn
         */
        $scope.showContentForRole = function (role) {
            $timeout(function () {
                $scope.selectedRole = role;
                localStorage.setItem('selectedRole', role);
                $scope.setActiveNavItem('welcome');
            });
        };

        /**
         * Kiểm tra xem một vai trò có đang được chọn không
         */
        $scope.isSelectedRole = function (roleToCheck) {
            return $scope.selectedRole === roleToCheck;
        };

        /**
         * Lấy api và set điều kiện ở slide bar
         */
        if (user !== undefined && user !== null && user !== "") {
            AgenciesServiceAG.findByUserId(user.id).then(function successCallback(response) {
                let agencies = response.data;

                if (agencies !== undefined && agencies !== null && agencies !== "") {
                    HotelServiceAG.findByAgencyId(agencies.id).then(function successCallback(response) {
                        $scope.hotels = response.data;
                    }, errorCallback);

                    TransportServiceAG.findByAgencyId(agencies.id).then(function successCallback(response) {
                        $scope.transport = response.data;
                    }, errorCallback);

                    VisitLocationServiceAG.findByAgencyId(agencies.id).then(function successCallback(response) {
                        $scope.visits = response.data;
                    }, errorCallback);
                }
            }, errorCallback);
        }
    };

    $scope.init();

    /**
     * Set active thẻ nav link bên admin
     * @param navItem
     */
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
        window.location.href = '/login-admin';
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
            '/business/register-transports',
            '/business/register-visit',
            '/business/register-business',
            '/business/register-business-success',
            '/business/select-type',
            '/business/hotel/home',
            '/admin/page-not-found',
            '/admin/internal-server-error',
            '/admin/page-forbidden',
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
            '/business/register-transports',
            '/business/register-visit',
            '/business/register-business',
            '/business/register-business-success',
            '/business/select-type',
            '/business/hotel/home',
            '/admin/page-not-found',
            '/admin/internal-server-error',
            '/admin/page-forbidden',
        ];
        return $scope.isActive(marginPaths) ? {'margin': '0'} : {};
    };

    /**
     * Ẩn header
     * @returns {boolean}
     */
    $scope.hideHeader = function () {
        const hidePaths = [
            '/admin/page-not-found',
            '/admin/internal-server-error',
            '/admin/page-forbidden'
        ];
        return $scope.isActive(hidePaths);
    }

    $rootScope.$on('$routeChangeSuccess', function () {
        setTimeout(function () {
            $('.preloader').fadeOut(500);
        }, 500);
    });
});