travel_app.controller('SignupController', function ($scope, $location, AuthService) {

    $scope.emailError = false;
    $scope.phoneError = false;

    $scope.checkboxClicked = false;

    $scope.user = {
        email: null,
        fullName: null,
        phone: null,
        password: null,
        cpsw: null,
        agreeTerms: false
    }

    function errorCallback() {
        toastAlert('error', "Máy chủ không tồn tại !");
    }

    /**
     * @message Register user
     */
    $scope.registerAccount = function () {
        $scope.isLoading = true;
        let users = $scope.user;

        AuthService.registerAuth(users).then(function successCallback() {
            $location.path("/login");
            centerAlert('Thành công !', 'Đăng ký tài khoản thành công. Vui lòng xác thực email để đăng nhập !', 'success');
        }, errorCallback).finally(function () {
            $scope.isLoading = false;
        });
    };

    /**
     * @message Check duplicate email
     */
    $scope.checkDuplicateEmail = function () {
        AuthService.checkExistEmail($scope.user.email).then(function successCallback(response) {
            $scope.emailError = response.data.exists;
        });
    };

    /**
     * @message Check duplicate phone
     */
    $scope.checkDuplicatePhone = function () {
        AuthService.checkExistPhone($scope.user.phone).then(function successCallback(response) {
            $scope.phoneError = response.data.exists;
        });
    };
});
