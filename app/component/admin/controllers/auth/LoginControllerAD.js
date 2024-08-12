travel_app.controller('LoginControllerAD', function ($scope, $location, AuthService, AgenciesServiceAG, NotificationService) {
    $scope.user = {
        email: null,
        password: null,
    };

    function errorCallback() {
        $location.path('/admin/internal-server-error');
    }

    /**
     * @message Login with jwt
     */
    $scope.loginAccountAdmin = function () {
        let loginData = {
            email: $scope.user.email,
            password: $scope.user.password
        };

        AuthService.loginAuth(loginData).then(function successCallback(response) {
            let data = response.data;

            if (data && data.token !== "false") {
                AuthService.checkToken(data).then(function successCallback(response) {
                    let email = response.data.username;
                    let role = response.data.roles;

                    if (role.includes('ROLE_CUSTOMER')) {
                        toastAlert('warning', 'Không đủ quyền truy cập !');
                    } else {
                        $scope.isLoading = true;

                        AuthService.findByEmail(email).then(function successCallback(response) {
                            let token = data.token;
                            let user = response.data;

                            AuthService.setAuthData(token, user);

                            if (role.some(r => ['ROLE_AGENT_TRANSPORT', 'ROLE_AGENT_HOTEL', 'ROLE_AGENT_PLACE'].includes(r))) {
                                AgenciesServiceAG.findByUserId(user.id).then(function successCallback(response) {
                                    let agencies = response.data;
                                    const redirectMap = {
                                        0: '/business/register-business',
                                        1: '/business/register-business-success',
                                        2: '/business/select-type',
                                        3: '/business/register-business'
                                    };

                                    if (agencies.isActive) {
                                        if (redirectMap.hasOwnProperty(agencies.isAccepted)) {
                                            window.location.href = redirectMap[agencies.isAccepted];
                                            NotificationService.setNotification('success', 'Đăng nhập thành công !');
                                        } else {
                                            centerAlert('Thông báo !', 'Trạng thái chưa xác định !', 'warning');
                                        }
                                    } else {
                                        centerAlert('Thông báo !', 'Doanh nghiệp đã ngừng hoạt động! Bạn vui lòng liên hệ CSKH.', 'warning');
                                    }
                                }, errorCallback);
                            } else {
                                window.location.href = '/admin/dashboard';
                                NotificationService.setNotification('success', 'Đăng nhập thành công !');
                                $scope.setActiveNavItem('dashboard');
                            }
                        }, errorCallback).finally(function () {
                            $scope.isLoading = false;
                        });
                    }
                }, errorCallback);
            } else {
                toastAlert('warning', "Sai thông tin đăng nhập !");
            }
        });
    };
});
