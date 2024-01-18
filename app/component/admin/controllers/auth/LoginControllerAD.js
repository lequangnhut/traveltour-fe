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
                            } else if (role[i] === 'ROLE_AGENT_TRANSPORT' || role[i] === 'ROLE_AGENT_HOTEL' || role[i] === 'ROLE_AGENT_PLACE') {
                                AuthService.findByEmail(email).then(function successCallback(response) {
                                    let token = data.token;
                                    let user = response.data;

                                    AgenciesServiceAG.findByUserId(user.id).then(function successCallback(response) {
                                        let agencies = response.data;

                                        if (agencies.isActive && agencies.isAccepted === 0) {
                                            AuthService.setAuthData(token, user);

                                            window.location.href = '/business/register-transports';
                                            NotificationService.setNotification('success', 'Đăng nhập thành công !');
                                        } else if (agencies.isActive && agencies.isAccepted === 1) {
                                            AuthService.setAuthData(token, user);

                                            window.location.href = '/business';
                                            NotificationService.setNotification('success', 'Đăng nhập thành công !');
                                        } else {
                                            centerAlert('Thông báo !', 'Doanh nghiệp đã ngừng hoạt động !', 'warning');
                                        }
                                    }, errorCallback);
                                }, errorCallback);
                            } else {
                                AuthService.findByEmail(email).then(function successCallback(response) {
                                    let token = data.token;
                                    let user = response.data;

                                    AuthService.setAuthData(token, user);

                                    window.location.href = '/admin/dashboard';
                                    NotificationService.setNotification('success', 'Đăng nhập thành công !');
                                }, errorCallback);
                            }
                        }
                    }, errorCallback);
                } else {
                    toastAlert('warning', "Sai thông tin đăng nhập !");
                }
            }
        }, errorCallback);
    };
});
