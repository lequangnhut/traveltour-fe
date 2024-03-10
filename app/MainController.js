travel_app.controller('MainController',
    function ($scope, $rootScope, $location, $window, $timeout, AuthService, AgenciesServiceAG, HotelServiceAG, TransportBrandServiceAG, VisitLocationServiceAG, LocalStorageService, NotificationService, UpdateStatusService) {
        $scope.selectedRole = LocalStorageService.get('selectedRole') || null;
        $scope.activeNavItem = LocalStorageService.get('activeNavItem') || null;

        $scope.isAuthenticated = AuthService.getToken() !== null;
        let user = $scope.user = AuthService.getUser();

        $scope.successSound = new Audio('assets/admin/assets/sound/success.mp3');
        $scope.errorSound = new Audio('assets/admin/assets/sound/error.mp3');

        function errorCallback() {
            $location.path('/admin/internal-server-error')
        }

        $scope.init = function () {
            /**
             * Định dạng giá tiền fill lên trong db
             */
            $scope.formatPrice = function (price) {
                return new Intl.NumberFormat('vi-VN', {currency: 'VND'}).format(price);
            };

            $scope.replacePrice = function (price) {
                if (price === undefined || price === null) {
                    return '';
                }
                return price.replace(/[^0-9]/g, '');
            };

            /**
             * Set active cho navbar trên header
             */
            $scope.isActive = function (viewLocation) {
                return viewLocation === $location.path();
            };

            /**
             * Mở image bự hơn trong modal
             */
            $scope.openImageModal = function (imageUrl) {
                document.getElementById('modalImage').src = imageUrl;
                $('#imageModal').modal('show');
            };

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
            const locationPath = $location.path();
            const authPaths = [
                '/sign-in',
                '/sign-up',
                '/forgot-password',
                '/login-admin'
            ];
            // Kiểm tra đường dẫn chứa id phía sau
            if (
                locationPath.includes('/account/forgot-pass/')
            ) {
                return true;
            }
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
            const locationPath = $location.path();
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
                '/business/hotel/home/hotel/create',
                '/business/transport/home/create-transport',
                '/business/visit/home/create-visit-location'
            ];

            // Kiểm tra đường dẫn chứa id phía sau
            if (
                locationPath.includes('/business/hotel/home/hotel/update/') ||
                locationPath.includes('/business/transport/home/update-transport/') ||
                locationPath.includes('/business/visit/home/update-visit-location/') ||
                locationPath.includes('/admin/information-update/')
            ) {
                return true;
            }

            return $scope.isActive(hiddenPaths);
        };

        /**
         * Bỏ margin khi vào đường dẫn đó
         * @returns {{display: string}|{}}
         */
        $scope.sidebarStyle = function () {
            const locationPath = $location.path();
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
                '/business/hotel/home/hotel/create',
                '/business/transport/home/create-transport',
                '/business/visit/home/create-visit-location'
            ];

            // Kiểm tra đường dẫn chứa id phía sau
            if (
                locationPath.includes('/business/hotel/home/hotel/update/') ||
                locationPath.includes('/business/transport/home/update-transport/') ||
                locationPath.includes('/business/visit/home/update-visit-location/',) ||
                locationPath.includes('/admin/information-update/')
            ) {
                return {'margin': '0'};
            }

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

        $scope.playSuccessSound = function () {
            $scope.successSound.play();
        };

        $scope.playErrorSound = function () {
            $scope.errorSound.play();
        };


        /** Hàm cập nhật để vô hiệu hóa mã OTP đổi mật khẩu */
        $scope.updatePassEvent = function () {
            UpdateStatusService.updateOtpStatus().then(function () {
            }).catch(function (error) {
                console.error(error);
            });
        };
        /** Hàm cập nhật để thay đổi trạng thái tour details */
        $scope.updateTourEvent = function () {
            UpdateStatusService.updateTourDetailsStatus().then(function () {
            }).catch(function (error) {
                console.error(error);
            });
        };
        /** Hàm cập nhật để thay đổi trạng thái transportation schedules */
        $scope.updateScheduleEvent = function () {
            UpdateStatusService.updateSchedulesStatus().then(function () {
            }).catch(function (error) {
                console.error(error);
            });
        };

        setInterval(function () {
            $scope.updatePassEvent();
            $scope.updateTourEvent();
            $scope.updateScheduleEvent();
        }, 1000);
    });