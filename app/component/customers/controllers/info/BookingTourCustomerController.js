travel_app.controller("BookingTourCustomerController", function ($scope, $sce, $location, $window, $routeParams, $timeout, Base64ObjectService, $rootScope, $http, CustomerServiceAD, LocalStorageService, AuthService, HistoryOrderServiceCUS) {
    $scope.isLoading = true;


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

    $scope.sortData = function (column) {
        $scope.sortBy = column;
        $scope.sortDir = ($scope.sortDir === 'asc') ? 'desc' : 'asc';
        $scope.getTourBookingList();
    };


    $scope.getSortIcon = function (column) {
        if ($scope.sortBy === column) {
            if ($scope.sortDir === 'asc') {
                return $sce.trustAsHtml('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M182.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-9.2 9.2-11.9 22.9-6.9 34.9s16.6 19.8 29.6 19.8H288c12.9 0 24.6-7.8 29.6-19.8s2.2-25.7-6.9-34.9l-128-128z"/></svg>');
            } else {
                return $sce.trustAsHtml('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M182.6 470.6c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8H288c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-128 128z"/></svg>');
            }
        }
        return $sce.trustAsHtml('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M137.4 41.4c12.5-12.5 32.8-12.5 45.3 0l128 128c9.2 9.2 11.9 22.9 6.9 34.9s-16.6 19.8-29.6 19.8H32c-12.9 0-24.6-7.8-29.6-19.8s-2.2-25.7 6.9-34.9l128-128zm0 429.3l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8H288c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-128 128c-12.5 12.5-32.8 12.5-45.3 0z"/></svg>');
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