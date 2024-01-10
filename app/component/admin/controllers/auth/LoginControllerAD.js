travel_app.controller('LoginControllerAD', function ($scope, $location, AuthService) {

    $scope.user = {
        email: null,
        password: null,
    }

    /**
     * @message Login with spring security
     */
    $scope.loginAccountAdmin = function () {
        let loginDataAdmin = {
            username: $scope.user.email,
            password: $scope.user.password
        }

        AuthService.loginAuthAdmin(loginDataAdmin).then(function successCallback(response) {
            if (response.data) {
                $location.path('/admin/dashboard');
                toastAlert('success', 'Đăng nhập thành công !');
            } else {
                console.log('sai')
            }
        });
    };
});
