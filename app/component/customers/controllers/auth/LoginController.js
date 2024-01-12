travel_app.controller('LoginController', function ($scope, $location, $timeout, AuthService) {

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
                            } else {
                                AuthService.findByEmail(email).then(function successCallback(response) {
                                    let token = data.token;
                                    let user = response.data;

                                    AuthService.setAuthData(token, user);
                                    window.location.href = '/home';
                                    toastAlert('success', 'Đăng nhập thành công !');
                                }, errorCallback);
                            }
                        }
                    }, errorCallback);
                } else {
                    toastAlert('error', "Máy chủ không tồn tại !");
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
