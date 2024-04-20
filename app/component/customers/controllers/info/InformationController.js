travel_app.controller("InformationController",
    function ($scope, $sce, $location, $window, $routeParams, $timeout, Base64ObjectService, $rootScope,
              CustomerServiceAD, LocalStorageService, AuthService, HistoryOrderServiceCUS, NotificationService) {
        let checkOldPass = '';
        let checkNewPass = '';

        $scope.hasImage = false;

        $scope.genderOptions = [{label: 'Nữ', value: 1}, {label: 'Nam', value: 2}, {label: 'Khác', value: 3}];

        $scope.customer = {
            avatar: null,
            email: null,
            password: null,
            gender: null,
            fullName: null,
            birth: null,
            address: null,
            citizenCard: null,
            phone: null,
            isActive: null
        }

        $scope.passUpdate = {
            newPass: null, confirmPass: null
        }

        $scope.userIdEncrypt = $routeParams.id;
        let userId = Base64ObjectService.decodeObject($routeParams.id);

        $scope.emailError = false;
        $scope.phoneError = false;
        $scope.cardError = false;
        $scope.invalidBirth = false;
        $scope.mess = ''

        $scope.bookingTourList = [];
        $scope.currentPage = 0;
        $scope.pageSize = 5;
        $scope.currentTab = 'pending';
        $scope.orderStatus = 0;

        $scope.passDate = false;


        /** Hàm trả trang lỗi*/
        function errorCallback() {
            $location.path('/admin/internal-server-error')
        }

        /**
         * Phương thức hiển thị modal
         */
        $scope.showModalChangeProfile = function (id) {
            if (!$scope.customer) {
                console.error("Error: $scope.agent is not defined or null");
                return;
            }
            fillModalWithData(id);
            $('#change-profile').modal('show');
        };

        $scope.showModalChangePhoneNumber = function (id) {
            if (!$scope.customer) {
                console.error("Error: $scope.agent is not defined or null");
                return;
            }
            fillModalPhoneWithData(id);
            $('#change-phoneNumber').modal('show');
        }

        //============================================================================================================

        /** Lấy ra thông tin Customer theo đường dẫn */
        $scope.getCustomer = function () {
            if (userId !== undefined && userId !== null && userId !== "") {
                CustomerServiceAD.findCustomerById(userId).then(function successCallback(response) {
                    if (response.status === 200) {
                        $timeout(function () {
                            $scope.customer = response.data.data;
                            $rootScope.phonenow = response.data.data.phone;
                            $rootScope.cardnow = response.data.data.citizenCard;
                            $scope.customer.birth = new Date(response.data.data.birth);
                        }, 0);
                    }
                }, errorCallback).finally(function () {
                    $scope.isLoading = false;
                });
            }
        };
        $scope.getCustomer();

        /**
         * Kiểm tra thông tin đầu vào
         */
        $scope.checkPhoneCustomer = function () {
            if ($scope.customer.phone === $rootScope.phonenow) {
                $scope.phoneError = false;
                return;
            }
            AuthService.checkExistPhone($scope.customer.phone)
                .then(function successCallback(response) {
                    if (response.status === 200) {
                        $scope.phoneError = response.data.exists;
                    } else {
                        $scope.phoneError = response.data.exists;
                    }
                });
        };

        $scope.checkCardCustomer = function () {
            if ($scope.customer.citizenCard === $rootScope.cardnow) {
                $scope.cardError = false;
                return;
            }
            AuthService.checkExistCard($scope.customer.citizenCard).then(function successCallback(response) {
                $scope.cardError = response.data.exists;
            });
        };

        $scope.checkBirth = function () {
            let birthDate = new Date($scope.customer.birth);
            let today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            let monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            $scope.invalidBirth = age < 16;
        };

        $scope.isBirthInvalid = function () {
            return $scope.invalidBirth; // Sử dụng biến mới để kiểm tra tuổi
        };

        $scope.isBirthValid = function () {
            return !$scope.invalidBirth && $scope.customer.birth;
        };

        //============================================================================================================
        /** Fill thông tin lên form modal thông tin cơ bản */
        function fillModalWithData(id) {
            if (id !== undefined && id !== null && id !== "") {
                CustomerServiceAD.findCustomerById(id).then(function successCallback(response) {
                    if (response.status === 200) {
                        $timeout(function () {
                            $scope.customer = response.data.data;
                            $scope.customer.birth = new Date(response.data.data.birth);
                        }, 0);
                    }
                });
            }
        }

        /** Fill thông tin lên form modal số điện thoại */
        function fillModalPhoneWithData(id) {
            if (id !== undefined && id !== null && id !== "") {
                CustomerServiceAD.findCustomerById(id).then(function successCallback(response) {
                    if (response.status === 200) {
                        $timeout(function () {
                            $scope.customer.phone = response.data.data.phone;
                        }, 0);
                    }
                });
            }
        }

        //==================================================================================================
        /**
         * Các function xử lý hình ảnh
         * @param file
         */
        $scope.uploadCustomerAvatar = (file) => {
            if (file && !file.$error) {
                let reader = new FileReader();

                reader.onload = (e) => {
                    $scope.customer.avatar = e.target.result;
                    $scope.customerAvatarNoCloud = file;
                    $scope.hasImage = true; // Đánh dấu là đã có ảnh
                    $scope.$apply();
                };

                reader.readAsDataURL(file);
            }
        };


        $scope.getCurrentAvatarSource = () => {
            if ($scope.customer.avatar && typeof $scope.customer.avatar === 'string') {
                if ($scope.customer.avatar.startsWith('http')) {
                    $scope.customerAvatarNoCloud = $scope.customer.avatar;
                    return $scope.customer.avatar;
                } else {
                    return $scope.customer.avatar;
                }
            } else {
                return 'https://i.imgur.com/xm5Ufr5.jpg';
            }
        };

        /**
         * Phương thức update thông tin người dùng
         */
        $scope.updateCustomerSubmit = () => {
            function confirmUpdate() {
                $scope.isLoading = true;

                const dataCustomer = new FormData();
                if ($scope.hasImage) {
                    dataCustomer.append("customerDto", new Blob([JSON.stringify($scope.customer)], {type: "application/json"}));
                    dataCustomer.append("customerAvatar", $scope.customerAvatarNoCloud);
                    updateCustomer(userId, dataCustomer);
                } else {
                    dataCustomer.append("customerDto", new Blob([JSON.stringify($scope.customer)], {type: "application/json"}));
                    dataCustomer.append("customerAvatar", null);
                    updateCustomer(userId, dataCustomer);
                }
            }

            confirmAlert('Bạn có chắc chắn muốn cập nhật thông không ?', confirmUpdate);
        };

        /**
         * Update information
         * @param customerId
         * @param dataCustomer
         */
        const updateCustomer = (customerId, dataCustomer) => {
            $scope.isLoading = true;
            CustomerServiceAD.updateCustomer(customerId, dataCustomer).then(function successCallback(response) {
                if (response.status === 200) {
                    let user = response.data.data;
                    $window.location.href = '/information/' + Base64ObjectService.encodeObject(userId);
                    LocalStorageService.encryptLocalData(JSON.stringify(user), 'user', 'encryptUser');
                    NotificationService.setNotification('success', 'Cập nhật thành công!');
                } else {
                    $location.path('/admin/page-not-found');
                }
            }, errorCallback).finally(() => {
                $scope.isLoading = false;
            });
        }

        /**
         * Update phone
         */
        const confirmUpdatePhone = () => {
            $scope.isLoading = true;

            CustomerServiceAD.updatePhone($scope.customer.id, $scope.customer.phone).then(function successCallback(response) {
                if (response.status === 200) {
                    let user = response.data.data;
                    $window.location.href = '/information/' + Base64ObjectService.encodeObject($scope.customer.id);

                    LocalStorageService.encryptLocalData(JSON.stringify(user), 'user', 'encryptUser');
                    NotificationService.setNotification('success', 'Cập nhật thành công!');
                } else {
                    $location.path('/admin/page-not-found');
                }
            }, errorCallback).finally(function () {
                $scope.isLoading = false;
            });
        }

        $scope.updatePhone = function () {
            confirmAlert('Bạn có chắc chắn muốn cập nhật không ?', confirmUpdatePhone);
        }

        $scope.checkPasswordMatch = function () {
            checkOldPass = $scope.currentPass;
            checkNewPass = $scope.passUpdate.newPass;

            // Kiểm tra mật khẩu mới có trùng với mật khẩu hiện tại hay không
            $scope.passwordMatchError = (checkNewPass === checkOldPass);

            // Kiểm tra mật khẩu hiện tại có chính xác hay không
            CustomerServiceAD.checkCorrectCurrentPass($scope.customer.id, checkOldPass).then(function successCallback(response) {
                $scope.currentPassError = response.data.exists;
            });
        };

        const confirmUpdatePass = () => {
            $scope.isLoading = true;
            CustomerServiceAD.updatePass($scope.customer.id, $scope.passUpdate).then(function successCallback(response) {
                if (response.status === 200) {
                    toastAlert('success', 'Cập nhật thành công !');
                    $location.path("/sign-in");
                } else {
                    $location.path('/admin/page-not-found');
                }
            }, errorCallback).finally(function () {
                $scope.isLoading = false;
            });
        }

        $scope.submit_changePass = function () {
            confirmAlert('Bạn có chắc chắn muốn đổi mật khẩu ?', confirmUpdatePass);
        }

        const confirmUpdatePassAdmin = () => {
            $scope.isLoading = true;
            CustomerServiceAD.updatePass($scope.customer.id, $scope.passUpdate).then(function successCallback(response) {
                if (response.status === 200) {
                    toastAlert('success', 'Cập nhật thành công !');
                    $location.path("/login-admin");
                } else {
                    $location.path('/admin/page-not-found');
                }
            }, errorCallback).finally(function () {
                $scope.isLoading = false;
            });
        }

        $scope.submit_changePassAdmin = function () {
            confirmAlert('Bạn có chắc chắn muốn đổi mật khẩu ?', confirmUpdatePassAdmin);
        }

    })