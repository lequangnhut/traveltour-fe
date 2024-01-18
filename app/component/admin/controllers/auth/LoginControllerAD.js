travel_app.controller('LoginControllerAD', function ($scope, $location, AuthService, NotificationService) {

    $scope.user = {
        email: null,
        password: null,
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

                                    AuthService.setAuthData(token, user);
                                    localStorage.setItem('activeNavItem', 'dashboard');

                                    window.location.href = '/business';
                                    NotificationService.setNotification('success', 'Đăng nhập thành công !');
                                });
                            } else {
                                AuthService.findByEmail(email).then(function successCallback(response) {
                                    let token = data.token;
                                    let user = response.data;

                                    AuthService.setAuthData(token, user);
                                    localStorage.setItem('activeNavItem', 'dashboard');

                                    window.location.href = '/admin/dashboard';
                                    NotificationService.setNotification('success', 'Đăng nhập thành công !');
                                });
                            }
                        }
                    });
                } else {
                    toastAlert('warning', "Sai thông tin đăng nhập !");
                }
            }
        });
    };
});
