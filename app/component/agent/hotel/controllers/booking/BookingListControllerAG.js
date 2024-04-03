travel_app.controller('BookingListController', function ($scope,$timeout, OrderHotelServiceAG, LocalStorageService) {
    var hotelId = LocalStorageService.get("brandId")

    function errorCallback(error) {
        toastAlert('error', "Máy chủ không tồn tại !");
    }
    $scope.orderHotels = {
        id: null,
        userId: null,
        customerName: null,
        customerCitizenCard: null,
        customerPhone: null,
        customerEmail: null,
        capacityAdult: null,
        capacityKid: null,
        checkIn: null,
        checkOut: null,
        orderTotal: null,
        paymentMethod: null,
        orderCode: null,
        dateCreated: null,
        orderStatus: null,
        orderNote: null
    }
    $scope.currentPage = 0;
    $scope.pageSize = 5;

    /**
     * Phương thức sắp xếp các trường dữ liệu
     * @param column
     */
    $scope.sortData = function (column) {
        $scope.sortField = column;
        $scope.sortDirection = ($scope.sortDirection === 'asc') ? 'desc' : 'asc';
        $scope.getOrderHotelList();
    };

    /**
     * Phương thức kiểm rta giá có đúng định dạng số không
     */
    $scope.checkPriceFormat = function () {
        // Kiểm tra xem giá có đúng định dạng số không
        if (!/^[0-9]*$/.test($scope.tourDetail.unitPrice)) {
            $scope.invalidPriceFormat = true;
        } else {
            $scope.invalidPriceFormat = false;
        }
    };

    /**
     * Phương thức xử lí phân trang khi chuyển trang
     * @param page
     */
    $scope.setPage = function (page) {
        if (page >= 0 && page < $scope.totalPages) {
            $scope.currentPage = page;
            $scope.getOrderHotelList();
        }
    };
    $scope.setPage()
    /**
     * Phương thức xử lí phân trang
     * @returns {*[]}
     */
    $scope.getPaginationRange = function () {
        var range = [];
        var start, end;

        if ($scope.totalPages <= 3) {
            // Nếu tổng số trang nhỏ hơn hoặc bằng 5, hiển thị tất cả các trang
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

        for (var i = start; i < end; i++) {
            range.push(i);
        }

        return range;
    };
    $scope.getPaginationRange()

    /**
     * Phương thức lấy danh sách loại phòng
     */
    $scope.getOrderHotelList = function () {
        console.log($scope.currentPage, $scope.pageSize, $scope.sortField, $scope.sortDirection, '', hotelId)
        OrderHotelServiceAG.findAllOrderHotel($scope.currentPage, $scope.pageSize, $scope.sortField, $scope.sortDirection, '', hotelId)
            .then(function (response) {
                console.log(response.data)
                $scope.isLoading = true;
                if (response.data.data === null || response.data.data.content.length === 0) {
                    $scope.setPage(Math.max(0, $scope.currentPage - 1));
                    return
                }
                $scope.orderHotels = response.data.data.content;
                $scope.totalPages = Math.ceil(response.data.data.totalElements / $scope.pageSize);
                $scope.totalElements = response.data.data.totalElements; // Tổng số phần tử
            }, errorCallback).finally(function () {
            $scope.isLoading = false;
        });
    };

    $scope.getOrderHotelList()

    /**
     * Phương thức tìm kiếm dữ liệu
     */
    // $scope.searchRoomTypeDetail = function () {
    //     if (searchTimeout) $timeout.cancel(searchTimeout);
    //
    //     searchTimeout = $timeout(function () {
    //         OrderHotelServiceAG.findAllOrderHotel($scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortDir, $scope.searchTerm, hotelId)
    //             .then(function (response) {
    //                 $scope.roomTypes = response.data.data.content;
    //                 $scope.totalPages = Math.ceil(response.data.data.totalElements / $scope.pageSize);
    //                 $scope.totalElements = response.data.data.totalElements;
    //             }, errorCallback);
    //     }, 500); // 500ms debounce
    // };
    //
    // $scope.searchRoomTypeDetail();

    /**
     * Phương thức hiển thị số lượng tối đa của dữ liệu
     */
    $scope.pageSizeChanged = function () {
        $scope.currentPage = 0;
        $scope.getOrderHotelList();
    };

    /**
     * phương thức lấy số lượng dữ liệu trả về
     * @returns {number}
     */
    $scope.getDisplayRange = function () {
        return Math.min(($scope.currentPage + 1) * $scope.pageSize, $scope.totalElements);
    };
})