travel_app.controller("BookingTransCustomerController", function ($scope, $location, $window, $routeParams, HistoryOrderServiceCUS) {
    $scope.isLoading = true;

    let userId = $routeParams.id;

    $scope.mess = ''

    $scope.bookingTourTransList = [];
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
            $scope.getBookingTourTransList();
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
        $scope.getBookingTourTransList();
    };

    $scope.getDisplayRange = function () {
        return Math.min(($scope.currentPage + 1) * $scope.pageSize, $scope.totalElements);
    };

    $scope.getBookingTourTransList = function () {
        $scope.isLoading = true;
        HistoryOrderServiceCUS.getAllOrderTransByInfo($scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortDir, $scope.orderStatus, userId)
            .then(function (response) {
                if (response.data.data === null || response.data.data.content.length === 0) {
                    $scope.bookingTourTransList.length = 0;
                    $scope.showNull = $scope.orderStatus;
                    return;
                }
                $scope.bookingTourTransList = response.data.data.content;
                $scope.totalPages = Math.ceil(response.data.data.totalElements / $scope.pageSize);
                $scope.totalElements = response.data.data.totalElements;

            }, errorCallback).finally(function () {
            $scope.isLoading = false;
        });
    };

    $scope.getBookingTourTransList();

    $scope.getChangeTransStatus = function(){
        $scope.getBookingTourTransList();
    }

    $scope.isStartPassed = function (checkInDate) {
        var currentDate = new Date();  // Ngày hiện tại
        var departure = new Date(checkInDate);  // Ngày xuất phát
        // Tính số ngày còn lại giữa ngày hiện tại và ngày xuất phát
        var checkDown = Math.ceil((departure - currentDate) / (1000 * 60 * 60 * 24));

        return checkDown < 0;
    };

    $scope.openTransModal = function (data) {
        $('#transModal').modal('show');
        $scope.bookingTrans = data;
        // var currentDate = new Date();  // Ngày hiện tại
        // var departureDate = new Date(data.startDate);  // Ngày xuất phát

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

    $scope.closeTransModal = function () {
        $('#transModal').modal('hide');
    };

    $scope.cancelBookingTransOrder = function (data) {
        function confirmDeleteType() {
            $('#transModal').modal('hide'); // Đóng modal khi thành công
        }
        confirmAlert("Xóa Trans", confirmDeleteType);
    };
})