travel_app.controller('ChangePassAdminController', function ($scope, $window, $routeParams, $location, ForgotPwService) {
    const token = $routeParams.verifyCode;

    $scope.init = function () {
        // Kiểm tra xem có token hay không
        if (token) {
            ForgotPwService.checkOldCodeAdmin(token)
                .then(function successCallback(response) {
                    if (response.data.status === "200") {

                    } else {
                        $location.path('/admin-account/forgot-pass');
                    }
                })
                .catch(function errorCallback(response) {
                    //console.log('Lỗi khi đổi mật khẩu người dùng' + response);
                });
        } else {
            $location.path('/admin-account/forgot-pass');
        }
    };

    $scope.init();

    $scope.toggleNewPass = function () {
        var passwordInput = document.getElementById('newPassword');
        var eyeIcon = document.getElementById('toggleNewPassword');

        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            eyeIcon.innerHTML = '<i class="fa-solid fa-eye"></i>';
        } else {
            passwordInput.type = 'password';
            eyeIcon.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
        }
    };

    $scope.toggleConfirmNewPass = function () {
        var passwordInput = document.getElementById('confirmNewPass');
        var eyeIcon = document.getElementById('toggleConfirmNewPassword');

        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            eyeIcon.innerHTML = '<i class="fa-solid fa-eye"></i>';
        } else {
            passwordInput.type = 'password';
            eyeIcon.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
        }
    };

    function confirmUpdateType() {
        $scope.isLoading = true;
        if ($routeParams.verifyCode) {
            ForgotPwService.checkOldCodeAdmin($routeParams.verifyCode)
                .then(function successCallback(response) {
                    if (response.data.status === "200") {
                        ForgotPwService.updatePassAdmin($routeParams.verifyCode, $scope.users)
                            .then(function successCallback() {
                                toastAlert('success', 'Cập nhật thành công, mời đăng nhập lại !');
                                $window.location.href = '/login-admin';
                            })
                            .catch(function errorCallback(response) {
                                //console.log('Lỗi khi cập nhật mật khẩu người dùng', response);
                            })
                            .finally(function () {
                                $scope.isLoading = false;
                            });
                    } else {
                        $location.path('/admin-account/forgot-pass');
                    }
                })
                .catch(function errorCallback(response) {
                    //console.log('Lỗi khi kiểm tra mật khẩu cũ', response);
                });
        } else {
            $location.path('/admin-account/forgot-pass');
        }
    }

    $scope.updateCustomPassWord = function () {
        confirmAlert('Bạn có chắc chắn muốn cập nhật không ?', confirmUpdateType);
    }
});