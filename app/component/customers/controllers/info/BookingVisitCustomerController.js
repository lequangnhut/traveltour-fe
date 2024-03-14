travel_app.controller("BookingVisitCustomerController", function ($scope, $location, $window, $routeParams, HistoryOrderServiceCUS) {
    $scope.isLoading = true;

    let userId = $routeParams.id;

    $scope.mess = ''

    $scope.bookingTourVisitList = [];
    $scope.ticketListCustomer = [];
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
            $scope.getBookingTourVisitList();
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
        $scope.getBookingTourVisitList();
    };

    $scope.getDisplayRange = function () {
        return Math.min(($scope.currentPage + 1) * $scope.pageSize, $scope.totalElements);
    };

    $scope.getBookingTourVisitList = function () {
        $scope.isLoading = true;
        HistoryOrderServiceCUS.getAllOrderVisitByInfo($scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortDir, $scope.orderStatus, userId)
            .then(function (response) {
                if (response.data.data === null || response.data.data.content.length === 0) {
                    $scope.bookingTourVisitList.length = 0;
                    $scope.showNull = $scope.orderStatus;
                    return;
                }
                $scope.bookingTourVisitList = response.data.data.content;
                $scope.totalPages = Math.ceil(response.data.data.totalElements / $scope.pageSize);
                $scope.totalElements = response.data.data.totalElements;

            }, errorCallback).finally(function () {
            $scope.isLoading = false;
        });
    };

    $scope.getBookingTourVisitList();

    $scope.getChangeVisitStatus = function(){
        $scope.getBookingTourVisitList();
    }

    $scope.isCheckInVisitPassed = function (checkInDate) {
        var currentDate = new Date();
        var departure = new Date(checkInDate);

        var checkDown = Math.ceil((departure - currentDate) / (1000 * 60 * 60 * 24));

        return checkDown < 0;
    };

    $scope.openVisitModal = function (data) {
        $('#visitModal').modal('show');
        $scope.bookingVisit = data;
        for (let i = 0; i < $scope.bookingTourVisitList.length; i++) {
            HistoryOrderServiceCUS.getOrderVisitDetails($scope.bookingVisit.id)
                .then(function (ticket) {
                    $scope.ticketListCustomer = ticket.data.data
                });

        }
        var currentDate = new Date();  // Ngày hiện tại
        var departureDate = new Date(data.startDate);  // Ngày xuất phát

        // if(data.orderStatus === 0 && data.paymentMethod === 0){
        //     $scope.mess = "Bạn có muốn hủy tour không ?";
        //     return
        // }
        //
        // // Tính số ngày còn lại giữa ngày hiện tại và ngày xuất phát
        // var daysRemaining = Math.ceil((departureDate - currentDate) / (1000 * 60 * 60 * 24));
        // //console.log(daysRemaining)
        // if (daysRemaining >= 30) {
        //     $scope.mess = "Chi phí hủy tour là 1% trên tổng giá trị đơn. Bạn có muốn hủy tour không ?";
        // } else if (daysRemaining >= 26 && daysRemaining <= 29) {
        //     $scope.mess = "Chi phí hủy tour là 5% trên tổng giá trị đơn. Bạn có muốn hủy tour không ?";
        // } else if (daysRemaining >= 15 && daysRemaining <= 25) {
        //     $scope.mess = "Chi phí hủy tour là 30% trên tổng giá trị đơn. Bạn có muốn hủy tour không ?";
        // } else if (daysRemaining >= 8 && daysRemaining <= 14) {
        //     $scope.mess = "Chi phí hủy tour là 50% trên tổng giá trị đơn. Bạn có muốn hủy tour không ?";
        // }else if (daysRemaining >= 2 && daysRemaining <= 7) {
        //     $scope.mess = "Chi phí hủy tour là 80% trên tổng giá trị đơn. Bạn có muốn hủy tour không ?";
        // }else if (daysRemaining >= 0 && daysRemaining <= 1) {
        //     $scope.mess = "Chi phí hủy tour là 100% trên tổng giá trị đơn. Bạn có muốn hủy tour không ?";
        // } else {
        //     $scope.mess = "Bạn có muốn hủy tour không ?";
        // }
    }

    $scope.closeVisitModal = function () {
        $('#visitModal').modal('hide');
    };

    $scope.cancelBookingVisitOrder = function (data) {
        function confirmDeleteType() {
            $('#visitModal').modal('hide'); // Đóng modal khi thành công
        }
        confirmAlert("Xóa Visit", confirmDeleteType);
    };
})