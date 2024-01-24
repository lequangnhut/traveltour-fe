travel_app.controller('MainController', function ($scope, $rootScope, $location, $window, $timeout, $anchorScroll, AuthService, AgenciesServiceAG, HotelServiceAG, TransportBrandServiceAG, VisitLocationServiceAG, LocalStorageService, NotificationService) {
    $anchorScroll();
    $scope.selectedRole = LocalStorageService.get('selectedRole') || null;
    $scope.activeNavItem = LocalStorageService.get('activeNavItem') || null;

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
         * Hiển thị nội dung dựa trên vai trò được chọn và lưu id khách sạn vào local
         */
        $scope.showContentForRole = function (role, brandId) {
            $timeout(function () {
                $scope.selectedRole = role;
                LocalStorageService.set('selectedRole', role);
                $scope.setActiveNavItem('welcome');
            });

            LocalStorageService.remove('brandId');
            if (brandId !== undefined) {
                LocalStorageService.set('brandId', brandId);
            }
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
                let agencies = $scope.agencies = response.data;

                if (agencies !== undefined && agencies !== null && agencies !== "") {
                    HotelServiceAG.findAllByAgencyId(agencies.id).then(function successCallback(response) {
                        $scope.hotels = response.data[0];
                    }, errorCallback);

                    TransportBrandServiceAG.findAllByAgencyId(agencies.id).then(function successCallback(response) {
                        $scope.transport = response.data[0];
                    }, errorCallback);

                    VisitLocationServiceAG.findAllByAgencyId(agencies.id).then(function successCallback(response) {
                        $scope.visits = response.data[0];
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
        LocalStorageService.set('activeNavItem', navItem);
    };

    $window.addEventListener('beforeunload', function () {
        LocalStorageService.set('activeNavItem', $scope.activeNavItem);
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
        LocalStorageService.remove('activeNavItem');
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
            '/business/transport/home',
            '/business/visit/home',
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
            '/business/transport/home',
            '/business/visit/home',
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