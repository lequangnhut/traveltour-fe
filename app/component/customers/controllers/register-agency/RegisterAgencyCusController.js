travel_app.controller('RegisterAgencyCusController', function ($scope, $location, OTPService, AuthService, LocalStorageService, RegisterAgenciesCusService) {

    $scope.emailError = false;
    $scope.phoneError = false;

    $scope.showOTPField = false;
    $scope.emailDisabled = false;
    $scope.isCountingDown = false;

    $scope.agencies = {
        email: null,
        otp: null
    }

    $scope.init = function () {
        /**
         * Hàm submit email qua backend để gửi otp
         */
        $scope.submitEmail = function () {
            $scope.isLoading = true;
            let emailLocal = LocalStorageService.get('emailLocal');
            let agenciesData = {
                email: $scope.agencies.email,
                verifyCode: ''
            };

            agenciesData.verifyCode = OTPService.generateOTP();

            if (emailLocal !== null && emailLocal === agenciesData.email) {
                $scope.isLoading = false;
                $scope.showOTPField = true;
                $scope.emailDisabled = true;
                $scope.isCountingDown = true;
                LocalStorageService.remove('emailLocal');
                return;
            }

            RegisterAgenciesCusService.submitEmailAgencies(agenciesData).then(function (response) {
                if (response.status === 200) {
                    $scope.showOTPField = true;
                    $scope.emailDisabled = true;
                    $scope.isCountingDown = true;
                    LocalStorageService.set('emailLocal', agenciesData.email);

                    centerAlert('Thành công !', 'Chúng tôi vừa gửi cho bạn một email chứa OTP để xác thực! vui lòng vào mail để kiểm tra', 'success');
                } else {
                    $location.path('/admin/page-not-found');
                }
            }).finally(function () {
                $scope.isLoading = false;
            });
        };

        $scope.submitOTP = function () {
            let email = $scope.agencies.email;
            let codeOTP = $scope.agencies.otp;

            RegisterAgenciesCusService.findByCodeOTPAndEmail(codeOTP, email).then(function (response) {
                if (response.status === 200) {
                    let otpOnDB = response.data.data;

                    if (otpOnDB !== null) {
                        LocalStorageService.set('emailContinue', email);
                        $location.path('/register-agency/register/information');
                        toastAlert('success', 'Xác thực OTP thành công !');
                    } else {
                        centerAlert('Thất Bại', 'Mã OTP không hợp lệ, vui lòng kiểm tra lại', 'warning');
                    }
                } else {
                    $location.path('/admin/page-not-found');
                }
            })
        }

        $scope.changeEmail = function () {
            $scope.showOTPField = false;
            $scope.emailDisabled = false;
        }
    }

    $scope.init();

    /**
     * @message Check duplicate email
     */
    $scope.checkDuplicateEmail = function () {
        AuthService.checkExistEmail($scope.agencies.email).then(function successCallback(response) {
            $scope.emailError = response.data.exists;
        });
    };

    /**
     * @message Check duplicate phone
     */
    $scope.checkDuplicatePhone = function () {
        AuthService.checkExistPhone($scope.agencies.phone).then(function successCallback(response) {
            $scope.phoneError = response.data.exists;
        });
    };
})