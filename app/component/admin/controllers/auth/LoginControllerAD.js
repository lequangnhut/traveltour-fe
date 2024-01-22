travel_app.controller('LoginControllerAD', function ($scope, $location, AuthService, AgenciesServiceAG, NotificationService) {
    $scope.user = {
        email: null,
        password: null,
    }

    function errorCallback(error) {
        console.log(error)
        toastAlert('error', "Máy chủ không tồn tại !");
    }

    /**
     * @message Login with jwt
     */
    $scope.loginAccountAdmin = function () {
        $scope.isLoading = true;

        let loginData = {
            email: $scope.user.email,
            password: $scope.user.password
        }

        AuthService.loginAuth(loginData).then(function successCallback(response) {
            let data = response.data;

            if (data) {
                if (data.token !== "false") {
                    AuthService.checkToken(data).then(function successCallback(response) {
                        let email = response.data.username;
                        let role = response.data.roles;

                        for (let i = 0; i < role.length; i++) {
                            if (role[i] === 'ROLE_CUSTOMER') {
                                toastAlert('warning', 'Không đủ quyền truy cập !');
                                $scope.isLoading = false;
                            } else if (['ROLE_AGENT_TRANSPORT', 'ROLE_AGENT_HOTEL', 'ROLE_AGENT_PLACE'].includes(role[i])) {
                                AuthService.findByEmail(email).then(function successCallback(response) {
                                    let token = data.token;
                                    let user = response.data;

                                    AgenciesServiceAG.findByUserId(user.id).then(function successCallback(response) {
                                        let agencies = response.data;

                                        const redirectMap = {
                                            0: '/business/register-business',
                                            1: '/business/register-business-success',
                                            2: '/business/select-type',
                                            3: '/business/register-business'
                                        };

                                        if (agencies.isActive) {
                                            AuthService.setAuthData(token, user);

                                            if (redirectMap.hasOwnProperty(agencies.isAccepted)) {
                                                window.location.href = redirectMap[agencies.isAccepted];
                                                NotificationService.setNotification('success', 'Đăng nhập thành công !');
                                            } else {
                                                centerAlert('Thông báo !', 'Trạng thái chưa xác định !', 'warning');
                                            }
                                        } else {
                                            centerAlert('Thông báo !', 'Doanh nghiệp đã ngừng hoạt động !', 'warning');
                                        }
                                    }, errorCallback).finally(function () {
                                        $scope.isLoading = false;
                                    });
                                }, errorCallback);
                            } else {
                                AuthService.findByEmail(email).then(function successCallback(response) {
                                    let token = data.token;
                                    let user = response.data;

                                    AuthService.setAuthData(token, user);
                                    window.location.href = '/admin/dashboard';
                                    NotificationService.setNotification('success', 'Đăng nhập thành công !');
                                    $scope.setActiveNavItem('dashboard');
                                }, errorCallback).finally(function () {
                                    $scope.isLoading = false;
                                });
                            }
                        }
                    }, errorCallback);
                } else {
                    toastAlert('warning', "Sai thông tin đăng nhập !");
                    $scope.isLoading = false;
                }
            }
        }, errorCallback);
    };
});
