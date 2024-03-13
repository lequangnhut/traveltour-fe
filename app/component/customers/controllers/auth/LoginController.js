travel_app.controller('LoginController', function ($scope, $location, $window, $timeout, AuthService, NotificationService, LocalStorageService) {

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

                                    let redirectPath = LocalStorageService.get('redirectAfterLogin');

                                    if (redirectPath) {
                                        $window.location.href = redirectPath;
                                    } else {
                                        $window.location.href = '/home';
                                    }

                                    NotificationService.setNotification('success', 'Đăng nhập thành công !');
                                    LocalStorageService.remove('redirectAfterLogin');
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
        $window.location.href = BASE_API + 'auth/login/google';
    }
});
