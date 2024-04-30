travel_app.controller('ForgotPwController', function ($scope, $location, ForgotPwService) {
    $scope.email = null;
    $scope.captchaImage = '';
    $scope.emailError = false;
    $scope.capCodeError = false;

    function errorCallback() {
        $location.path('/admin/internal-server-error')
    }

    // Hàm để lấy và hiển thị hình ảnh Captcha
    $scope.refreshCaptcha = function () {
        ForgotPwService.getCaptchaImage()
            .then(function (captchaImage) {
                $scope.captchaImage = captchaImage;
            })
            .catch(function (error) {
                //console.error('Error getting captcha image:', error);
            });
    };

    // Gọi hàm để hiển thị Captcha khi trang được load
    $scope.refreshCaptcha();

    $scope.checkInputCaptcha = function () {
        ForgotPwService.checkCaptcha($scope.users.captcha).then(function successCallback(response) {
            $scope.capCodeError = response.data.exists;
        });
    };

    $scope.checkInputEmail = function () {
        ForgotPwService.checkEMail($scope.users.email).then(function successCallback(response) {
            $scope.emailError = response.data.exists;
        });
    };

    $scope.submitFormForgot = function () {
        $scope.isLoading = true;
        ForgotPwService.emailForgot($scope.users.email, $scope.users)
            .then(function successCallback(response) {
                $location.path("/home");
                centerAlert('Thành công !', 'Mời người dùng kiểm tra email để đổi mật khẩu !', 'success');
            }, errorCallback).finally(function () {
            $scope.isLoading = false;
        });
    }

    //ADMIN
    $scope.checkInputEmailAdmin = function () {
        ForgotPwService.checkEMailAdmin($scope.users.email).then(function successCallback(response) {
            $scope.emailError = response.data.exists;
        });
    };

    $scope.submitFormForgotAdmin = function () {
        $scope.isLoading = true;
        ForgotPwService.emailForgotAdmin($scope.users.email, $scope.users)
            .then(function successCallback(response) {
                $location.path("/login-admin");
                centerAlert('Thành công !', 'Mời người dùng kiểm tra email để đổi mật khẩu !', 'success');
            }, errorCallback).finally(function () {
            $scope.isLoading = false;
        });
    }
});