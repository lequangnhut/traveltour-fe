travel_app.controller("BookingHotelCustomerController", function ($scope, $location, $window, $routeParams, HistoryOrderServiceCUS, Base64ObjectService) {
    $scope.isLoading = true;

    let userId = Base64ObjectService.decodeObject($routeParams.id);

    $scope.mess = ''
    $scope.cancelWithFee = false;

    $scope.bookingTourHotelList = [];
    $scope.roomTypeListCustomer = [];
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
            $scope.getBookingTourHotelList();
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
        $scope.getBookingTourHotelList();
    };

    $scope.getDisplayRange = function () {
        return Math.min(($scope.currentPage + 1) * $scope.pageSize, $scope.totalElements);
    };

    $scope.getBookingTourHotelList = function () {
        $scope.isLoading = true;
        HistoryOrderServiceCUS.getAllOrderHotelByInfo($scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortDir, $scope.orderStatus, userId)
            .then(function (response) {
                if (response.data.data === null || response.data.data.content.length === 0) {
                    $scope.bookingTourHotelList.length = 0;
                    $scope.showNull = $scope.orderStatus;
                    return;
                }
                $scope.bookingTourHotelList = response.data.data.content;
                //console.log(response.data.data.content)
                $scope.totalPages = Math.ceil(response.data.data.totalElements / $scope.pageSize);
                $scope.totalElements = response.data.data.totalElements;
                for (let i = 0; i < $scope.bookingTourHotelList.length; i++) {
                    HistoryOrderServiceCUS.getHotels($scope.bookingTourHotelList[i].orderHotelDetailsById[0].roomTypeId)
                        .then(function (hotels) {
                            //console.log(hotels)
                            if (hotels) {
                                $scope.bookingTourHotelList[i].hotel = hotels.data.data;
                            } else {
                                console.error("tourDetail is undefined or null");
                            }
                        });

                }

            }, errorCallback).finally(function () {
            $scope.isLoading = false;
        });
    };

    $scope.getBookingTourHotelList();

    $scope.getChangeHotelStatus = function () {
        $scope.getBookingTourHotelList();
    }

    $scope.isCheckInPassed = function (checkInDate) {
        var currentDate = new Date();
        var departure = new Date(checkInDate);

        var checkDown = Math.ceil((departure - currentDate) / (1000 * 60 * 60 * 24));

        return checkDown <= 0 || checkDown === -0;
    };

    $scope.openHotelModal = function (data) {
        $('#hotelModal').modal('show');
        $scope.bookingHotel = data;

        var promises = [];

        for (let i = 0; i < $scope.bookingTourHotelList.length; i++) {
            var promise = HistoryOrderServiceCUS.getOrderDetails($scope.bookingHotel.id)
                .then(function (rooms) {
                    $scope.roomTypeListCustomer = rooms.data.data;
                    //console.log(rooms.data)
                    for (let j = 0; j < $scope.roomTypeListCustomer.length; j++) {
                        if ($scope.roomTypeListCustomer[j].roomTypes.freeCancellation === false) {
                            $scope.cancelWithFee = true;
                            return; // Dừng vòng lặp khi tìm thấy phòng không được miễn hủy
                        }
                    }
                });
            promises.push(promise);
        }

        Promise.all(promises).then(function () {
            if ((data.orderStatus === 0 && data.paymentMethod === 'TTTT') || $scope.cancelWithFee === false) {
                $scope.mess = "Bạn có muốn hủy phòng không ?";
                return;
            }
        });

        var currentDate = new Date();
        var departureDate = new Date(data.checkIn);
        var currentDateTime = currentDate.getTime();
        var departureDateTime = departureDate.getTime();
        var diffInDays = Math.ceil((departureDateTime - currentDateTime) / (1000 * 60 * 60 * 24)) - 1;

        if (diffInDays >= 2 && diffInDays <= 4) {
            $scope.mess = "Chi phí hủy là 50% trên tổng giá trị đơn. Bạn có muốn hủy phòng không ?";
        } else if (diffInDays <= 1) {
            $scope.mess = "Chi phí hủy là 100% trên tổng giá trị đơn. Bạn có muốn hủy phòng không ?";
        } else {
            $scope.mess = "Bạn có muốn hủy phòng không ?";
        }
        //console.log(diffInDays);
    }


    $scope.closeHotelModal = function () {
        $('#hotelModal').modal('hide');
    };

    $scope.cancelBookingHotelOrder = function (data) {
        function confirmDeleteType() {
            $scope.isLoading = true;
            HistoryOrderServiceCUS.cancelHotel(data.id).then(function successCallback(response) {
                centerAlert('Thành công !', 'Đã hủy booking, mời người dùng check mail !', 'success');
                $('#hotelModal').modal('hide'); // Đóng modal khi thành công
                $scope.getBookingTourHotelList();
            }, errorCallback).finally(function () {
                $scope.isLoading = false;
            });
        }

        confirmAlert($scope.mess, confirmDeleteType);
    };


})