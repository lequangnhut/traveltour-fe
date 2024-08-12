travel_app.controller('RegisterAgencyFormCusController',
    function ($scope, $location, OTPService, AuthService, LocalStorageService, RegisterAgenciesCusService) {

        if (LocalStorageService.get('emailContinue') === null) {
            centerAlert('Cảnh báo', 'Chúng tôi nhận thấy bạn đang truy cập không hợp lệ. Rời khỏi trang này ngay !', 'warning');
            $location.path('/register-agency');
            return;
        }

        $scope.phoneError = false;

        // Lưu trữ trạng thái ban đầu của các quyền
        $scope.originalRoles = {};
        $scope.selectedRoles = [];

        $scope.agencies = {
            email: LocalStorageService.get('emailContinue'),
            password: null,
            cpassword: null,
            fullName: null,
            phone: null
        }

        $scope.init = function () {
            /**
             * @message Chọn role lưu vào mảng selectedRoles
             */
            $scope.toggleRole = function (role) {
                let index = $scope.selectedRoles.indexOf(role);

                if (index === -1) {
                    $scope.selectedRoles.push(role);
                } else {
                    $scope.selectedRoles.splice(index, 1);
                }

                switch (role) {
                    case 'ROLE_AGENT_HOTEL':
                        $scope.isHotelChecked = $scope.selectedRoles.includes(role);
                        break;
                    case 'ROLE_AGENT_TRANSPORT':
                        $scope.isTransportationChecked = $scope.selectedRoles.includes(role);
                        break;
                    case 'ROLE_AGENT_PLACE':
                        $scope.isVisitLocationChecked = $scope.selectedRoles.includes(role);
                        break;
                }
            };
        }

        $scope.registerAgencies = function () {
            $scope.isLoading = true;

            function confirmRegisterAgencies() {
                let dataAccount = {
                    accountDto: $scope.agencies,
                    roles: $scope.selectedRoles
                }

                RegisterAgenciesCusService.submitRegisterAgencies(dataAccount).then(function (response) {
                    if (response.status === 200) {
                        alertRedirectAgencies('Thành công', 'Doanh của bạn đã được đăng ký thành công, vui lòng đăng nhập để hoàn tất thông tin !', 'success');
                        LocalStorageService.remove('emailContinue');
                    } else {
                        $location.path('/admin/page-not-found');
                    }
                }).finally(function () {
                    $scope.isLoading = false;
                });
            }

            confirmAlert('Bạn có chắc chắn email ' + $scope.agencies.email + ' là chính xác không ?', confirmRegisterAgencies);
        }

        $scope.init();

        /**
         * @message Check duplicate phone
         */
        $scope.checkDuplicatePhone = function () {
            AuthService.checkExistPhone($scope.agencies.phone).then(function successCallback(response) {
                $scope.phoneError = response.data.exists;
            });
        };

        function alertRedirectAgencies(text, message, type) {
            Swal.fire({
                title: text,
                text: message,
                icon: type,
                showCancelButton: false,
                confirmButtonText: 'OK',
                allowOutsideClick: false
            }).then((result) => {
                if (result.isConfirmed) {
                    $scope.$apply(function () {
                        $location.path('/login-admin');
                    });
                }
            });
        }
    })