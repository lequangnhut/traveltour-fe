travel_app.controller("InformationController", function ($scope, $location, $window, $routeParams, $timeout, Base64ObjectService, $rootScope, $http, CustomerServiceAD, LocalStorageService, AuthService, HistoryOrderServiceCUS) {
    $scope.isLoading = true;

    const fileName = "default.jpg";
    const mimeType = "image/jpeg";

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
        newPass: null,
        confirmPass: null
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
    $scope.showGender = function () {

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
        if ($scope.customer.phone == $rootScope.phonenow) {
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
        if ($scope.customer.citizenCard == $rootScope.cardnow) {
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
    /** Các function xử lý hình ảnh */
    $scope.uploadCustomerAvatar = function (file) {
        if (file && !file.$error) {
            let reader = new FileReader();

            reader.onload = function (e) {
                $scope.customer.avatar = e.target.result;
                $scope.customerAvatarNoCloud = file;
                $scope.hasImage = true; // Đánh dấu là đã có ảnh
                $scope.$apply();
            };

            reader.readAsDataURL(file);
        }
    };

    $scope.getCurrentAvatarSource = function () {
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

    function urlToFile(url, fileName, mimeType) {
        return fetch(url)
            .then(response => response.blob())
            .then(blob => new File([blob], fileName, {type: mimeType}));
    }

    //Modal update

    function confirmUpdate() {
        const dataCustomer = new FormData();
        $scope.isLoading = true;
        if ($scope.hasImage) {
            dataCustomer.append("customerDto", new Blob([JSON.stringify($scope.customer)], {type: "application/json"}));
            dataCustomer.append("customerAvatar", $scope.customerAvatarNoCloud);
            updateInfo(userId, dataCustomer);
        } else {
            if ($scope.customer.avatar === null) {
                $scope.customer.avatar = 'https://t3.ftcdn.net/jpg/05/60/26/08/360_F_560260880_O1V3Qm2cNO5HWjN66mBh2NrlPHNHOUxW.jpg'
            }
            urlToFile($scope.customer.avatar, fileName, mimeType).then(file => {
                dataCustomer.append("customerDto", new Blob([JSON.stringify($scope.customer)], {type: "application/json"}));
                dataCustomer.append("customerAvatar", file);
                updateInfo(userId, dataCustomer);
            }, errorCallback);
        }
    }

    const updateInfo = (userId, dataCustomer) => {
        $scope.isLoading = true;
        CustomerServiceAD.updateCustomer(userId, dataCustomer).then(function successCallback(response) {
            if (response.status === 200) {
                let user = response.data.data;
                $window.location.href = '/information/' + Base64ObjectService.encodeObject(userId);

                LocalStorageService.encryptLocalData(JSON.stringify(user), 'user', 'encryptUser');
                toastAlert('success', 'Cập nhật thành công !');
            } else {
                $location.path('/admin/page-not-found');
            }
        }, errorCallback).finally(function () {
            $scope.isLoading = false;
        });
    }
    $scope.updateInfoSubmit = function () {
        confirmAlert('Bạn có chắc chắn muốn cập nhật không ?', confirmUpdate);
    }

    const confirmUpdatePhone = () => {
        $scope.isLoading = true;

        CustomerServiceAD.updatePhone($scope.customer.id, $scope.customer.phone).then(function successCallback(response) {
            if (response.status === 200) {
                let user = response.data.data;
                $window.location.href = '/information/' + Base64ObjectService.encodeObject($scope.customer.id);

                LocalStorageService.encryptLocalData(JSON.stringify(user), 'user', 'encryptUser');
                toastAlert('success', 'Cập nhật thành công !');
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

    //===============================================================================================================
    //phân trang
    $scope.setPage = function (page) {
        if (page >= 0 && page < $scope.totalPages) {
            $scope.currentPage = page;
            $scope.getTourBookingList();
        }
    };

    $scope.getPaginationRange = function () {
        let range = [];
        let start, end;

        if ($scope.totalPages <= 3) {
            start = 0;
            end = $scope.totalPages;
        } else {
            // Hiển thị 2 trang trước và 2 trang sau trang hiện tại
            start = Math.max(0, $scope.currentPage - 1);
            end = Math.min(start + 3, $scope.totalPages);

            // Điều chỉnh để luôn hiển thị 5 trang
            if (end === $scope.totalPages) {
                start = $scope.totalPages - 3;
            }
        }

        for (let i = start; i < end; i++) {
            range.push(i);
        }

        return range;
    };

    $scope.pageSizeChanged = function () {
        $scope.currentPage = 0;
        $scope.getTourBookingList();
    };

    $scope.getDisplayRange = function () {
        return Math.min(($scope.currentPage + 1) * $scope.pageSize, $scope.totalElements);
    };

    $scope.getTourBookingList = function () {
        HistoryOrderServiceCUS.getAllById($scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortDir, $scope.orderStatus, userId)
            .then(function (response) {
                if (response.data.data === null || response.data.data.content.length === 0) {
                    $scope.bookingTourList.length = 0;
                    $scope.showNull = $scope.orderStatus;
                    return;
                }

                $scope.bookingTourList = response.data.data.content;
                $scope.totalPages = Math.ceil(response.data.data.totalElements / $scope.pageSize);
                $scope.totalElements = response.data.data.totalElements;

                for (let i = 0; i < $scope.bookingTourList.length; i++) {
                    HistoryOrderServiceCUS.getTourDetails($scope.bookingTourList[i].tourDetailId).then(function (tourDetail) {
                        if (tourDetail) {
                            $scope.bookingTourList[i].startDate = tourDetail.data.data.departureDate;
                            $scope.bookingTourList[i].endDate = tourDetail.data.data.arrivalDate;
                        } else {
                            console.error("tourDetail is undefined or null");
                        }
                    });
                }
            }, errorCallback).finally(function () {
            $scope.isLoading = false;
        });
    };

    $scope.getTourBookingList();

    $scope.getChangeStatus = function () {
        $scope.getTourBookingList();
    }

    $scope.openTourModal = function (data) {
        $('#tourModal').modal('show');

        $scope.bookingTour = data;
        // var currentDate = new Date();  // Ngày hiện tại
        // var departureDate = new Date(data.startDate);  // Ngày xuất phát

        if (data.orderStatus === 0 && data.paymentMethod === 0) {
            $scope.mess = "Bạn có muốn hủy tour không ?";
            return
        }

        var currentDate = new Date();
        var departureDate = new Date(data.startDate);

        var currentDateTime = currentDate.getTime();
        var departureDateTime = departureDate.getTime();

        var diffInDays = Math.ceil((departureDateTime - currentDateTime) / (1000 * 60 * 60 * 24)) - 1;

        if (diffInDays >= 30) {
            $scope.mess = "Chi phí hủy tour là 1% trên tổng giá trị đơn. Bạn có muốn hủy tour không ?";
        } else if (diffInDays >= 26 && diffInDays <= 29) {
            $scope.mess = "Chi phí hủy tour là 5% trên tổng giá trị đơn. Bạn có muốn hủy tour không ?";
        } else if (diffInDays >= 15 && diffInDays <= 25) {
            $scope.mess = "Chi phí hủy tour là 30% trên tổng giá trị đơn. Bạn có muốn hủy tour không ?";
        } else if (diffInDays >= 8 && diffInDays <= 14) {
            $scope.mess = "Chi phí hủy tour là 50% trên tổng giá trị đơn. Bạn có muốn hủy tour không ?";
        } else if (diffInDays >= 2 && diffInDays <= 7) {
            $scope.mess = "Chi phí hủy tour là 80% trên tổng giá trị đơn. Bạn có muốn hủy tour không ?";
        } else if (diffInDays <= 1) {
            $scope.mess = "Chi phí hủy tour là 100% trên tổng giá trị đơn. Bạn có muốn hủy tour không ?";
        } else {
            $scope.mess = "Bạn có muốn hủy tour không ?";
        }

        //console.log(diffInDays);
    }

    $scope.closeTourModal = function () {
        $('#tourModal').modal('hide');
    };

    $scope.isDepartureDatePassed = function (departureDate) {
        var currentDate = new Date();  // Ngày hiện tại
        var departure = new Date(departureDate);  // Ngày xuất phát
        // Tính số ngày còn lại giữa ngày hiện tại và ngày xuất phát
        var checkDown = Math.ceil((departure - currentDate) / (1000 * 60 * 60 * 24));
        return checkDown <= 0 || checkDown === -0;
    };

    $scope.cancelBooking = function (data) {
        function confirmDeleteType() {
            $scope.isLoading = true;
            HistoryOrderServiceCUS.cancelBookingTour(data.id).then(function successCallback() {
                centerAlert('Thành công !', 'Đã hủy booking, mời người dùng check mail !', 'success');
                $('#tourModal').modal('hide'); // Đóng modal khi thành công
                $scope.getTourBookingList();
            }, errorCallback).finally(function () {
                $scope.isLoading = false;
            });
        }

        confirmAlert($scope.mess, confirmDeleteType);
    };
})