travel_app.controller('LoginController', function ($scope, $location, $timeout, AuthService, NotificationService) {

    $scope.rememberMe = false;

    $scope.user = {
        email: null,
        password: null,
    }

    function errorCallback() {
        toastAlert('error', "Máy chủ không tồn tại !");
    }

    /**
     * @message Login with jwt
     */
    $scope.loginAccount = function () {
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
                            if (role[i] !== 'ROLE_CUSTOMER') {
                                toastAlert('warning', 'Không đủ quyền truy cập !');
                                $scope.isLoading = false;
                            } else {
                                AuthService.findByEmail(email).then(function successCallback(response) {
                                    let token = data.token;
                                    let user = response.data;

                                    AuthService.setAuthData(token, user);

                                    window.location.href = '/home';
                                    NotificationService.setNotification('success', 'Đăng nhập thành công !');
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

    $scope.loginGoogle = function () {
        AuthService.loginWithGoogle().then(function successCallback() {
            console.log('cc')
        });
    }
});
