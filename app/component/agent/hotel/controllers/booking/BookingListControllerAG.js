travel_app.controller('BookingListController', function ($scope, $timeout, OrderHotelServiceAG, LocalStorageService, RoomTypeService) {
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
    $scope.size = '5';
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

    $scope.filter = '0';
    $scope.orderStatus = '';

    /**
     * Phương thức tìm kiếm theo ngày khách hàng đến
     * @param filter
     */
    $scope.findOrderByFilter = function(filter) {
        $scope.filter = filter;
        $scope.getOrderHotelList();
    }

    /**
     * Phương thức tìm kiếm theo trạng thái
     * @param status
     */
    $scope.findOrderByStatus = function(status) {
        $scope.orderStatus = status;
        $scope.getOrderHotelList();
    }

    /**
     * Phương thức lấy danh sách các đơn hàng dựa vào bộ lọc
     */
    $scope.getOrderHotelList = function () {
        $scope.orderHotels = {};
        if($scope.filter !== '0'){
            $scope.orderStatus = '2';
        }

        OrderHotelServiceAG.findAllOrderHotel($scope.currentPage, $scope.size, $scope.sortField, $scope.sortDirection, $scope.searchTerm, hotelId, $scope.filter, $scope.orderStatus)
            .then(function (response) {
                console.log(response.data);
                $scope.isLoading = true;
                if (response.data === null || response.data.content.length === 0) {
                    if ($scope.currentPage > 0) {
                        $scope.setPage($scope.currentPage - 1);
                    }
                    return;
                }
                $scope.orderHotels = response.data.content;
                $scope.totalPages = Math.ceil(response.data.totalElements / $scope.size);
                $scope.totalElements = response.data.totalElements;
            }).catch(function () {
            toastAlert('error', "Máy chủ không tồn tại !");
        }).finally(function () {
            $scope.isLoading = false;
        });
    };

    /**
     * Phương thức tìm kiếm đơn hàng dựa vào tìm kiếm
     */
    var performSearchPromise;
    $scope.performOrderHotelList = function () {
        if (performSearchPromise) {
            clearTimeout(performSearchPromise);
        }
        performSearchPromise = setTimeout(function () {
            OrderHotelServiceAG.findAllOrderHotel($scope.currentPage, $scope.size, $scope.sortField, $scope.sortDirection, $scope.searchTerm, hotelId, $scope.filter, $scope.orderStatus)
                .then(function (response) {
                    console.log(response.data);
                    $scope.isLoading = true;
                    if (response.data === null || response.data.content.length === 0) {
                        $scope.setPage(Math.max(0, $scope.currentPage - 1));
                        return;
                    }
                    $scope.orderHotels = response.data.content;
                    $scope.totalPages = Math.ceil(response.data.totalElements / $scope.size);
                    $scope.totalElements = response.data.totalElements;
                }, errorCallback).finally(function () {
                $scope.isLoading = false;
            });
        }, 500)
    }

    $scope.getOrderHotelList();
    /**
     * phương thức lấy số lượng dữ liệu trả về
     * @returns {number}
     */
    $scope.getDisplayRange = function () {
        return Math.min(($scope.currentPage + 1) * $scope.size, $scope.totalElements);
    };

    /**
     * Phương thúc mở modal chi tiết đặt phòng
     * @param orderId mã hóa đơn khách sạn
     * @returns {Promise<void>}
     */
    $scope.openModalDetailsOrder = async function (orderId) {
        $('#detailsOrderHotelModal').modal("show")

        try {
            var response = await OrderHotelServiceAG.findOrderHotelById(orderId)
            if (response.status === 200) {
                $timeout(function () {
                    $scope.orderHotel = response.data
                    $scope.daysBetween = Math.floor(($scope.orderHotel.checkOut - $scope.orderHotel.checkIn) / (1000 * 60 * 60 * 24));
                }, 100)

            } else {
                toastAlert("error", "Lỗi không xác định")
                $scope.playErrorSound();
            }
        } catch (error) {
            toastAlert("error", error.message)
            $scope.playErrorSound();
        }

    }

    /**
     * Phương thức đóng modal
     */
    $scope.closeModalDetailsOrder = function () {
        $('#detailsOrderHotelModal').modal("hide")
    }

    /**
     * Phương thức xác nhận đơn hàng từ phía khách sạn
     * @param orderId mã hóa đơn
     * @returns {Promise<void>}
     */
    $scope.paymentInvoice = async function (orderId) {
        try {
            // Sử dụng SweetAlert2 để hiển thị cửa sổ xác nhận
            const confirmed = await Swal.fire({
                title: 'Xác nhận thanh toán',
                text: 'Bạn có chắc muốn xác nhận thanh toán cho đơn đặt phòng này?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Xác nhận',
                cancelButtonText: 'Hủy bỏ'
            });

            // Nếu người dùng xác nhận
            if (confirmed.isConfirmed) {
                var response = await OrderHotelServiceAG.confirmInvoiceByOrderId(orderId)
                $scope.isLoading = true;
                if (response.status === 200) {
                    toastAlert("success", response.data.message)
                    $scope.playSuccessSound();
                    $scope.getOrderHotelList()
                    $('#detailsOrderHotelModal').modal("hide")
                } else {
                    toastAlert("error", "Lỗi không xác định")
                    $scope.playErrorSound();
                }
            } else {
                // Người dùng hủy xác nhận
                toastAlert("info", "Thanh toán đã bị hủy bỏ");
            }
        } catch (error) {
            toastAlert("error", error.message)
            $scope.playErrorSound();
        } finally {
            $scope.isLoading = false;
        }
    }

    $scope.roomTypes = {}
    RoomTypeService.findAllRoomTypeDetails($scope.currentPage, 30, $scope.sortBy, $scope.sortDir, "", hotelId, false)
        .then(function (response) {
            $scope.isLoading = true;
            if (response.data.data === null || response.data.data.content.length === 0) {
                $scope.setPage(Math.max(0, $scope.currentPage - 1));
                return
            }
            $scope.roomTypes = response.data.data.content;
            $scope.totalPages = Math.ceil(response.data.data.totalElements / $scope.pageSize);
            $scope.totalElements = response.data.data.totalElements; // Tổng số phần tử
            console.log("phòng:", $scope.roomTypes)
        }, errorCallback).finally(function () {
        $scope.isLoading = false;
    });

    $scope.getRoomTypeName = function (bedTypeId) {
        var bedType = $scope.roomTypes.find(function (bedType) {
            return bedType.id === bedTypeId;
        });

        return bedType ? bedType.roomTypeName : '';
    }

    /**
     * Phương thức xác nhận đơn hàng từ phía khách sạn
     * @param orderId mã hóa đơn
     * @returns {Promise<void>}
     */
    $scope.confirmInvoice = async function (orderId) {
        try {
            // Sử dụng SweetAlert2 để hiển thị cửa sổ xác nhận
            const confirmed = await Swal.fire({
                title: 'Xác nhận duyệt đơn hàng',
                text: 'Bạn có chắc muốn duyệt đơn đặt phòng này?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Xác nhận',
                cancelButtonText: 'Hủy bỏ'
            });

            // Nếu người dùng xác nhận
            if (confirmed.isConfirmed) {
                var response = await OrderHotelServiceAG.confirmInvoiceByOrderId(orderId)
                $scope.isLoading = true;
                if (response.status === 200) {
                    toastAlert("success", response.data.message)
                    $scope.playSuccessSound();
                    $scope.getOrderHotelList()
                    $('#detailsOrderHotelModal').modal("hide")
                } else {
                    toastAlert("error", "Lỗi không xác định")
                    $scope.playErrorSound();
                }
            } else {
                // Người dùng hủy xác nhận
                toastAlert("info", "Duyệt đơn hàng đã bị hủy bỏ");
            }
        } catch (error) {
            toastAlert("error", error.message)
            $scope.playErrorSound();
        } finally {
            $scope.isLoading = false;
        }
    }


    /**
     * Phương thức hủy phòng khách sạn
     * @param orderId  mã hóa đơn
     * @returns {Promise<void>}
     */
    $scope.cancelInvoice = async function (orderId) {
        Swal.fire({
            title: 'Hủy hóa đơn',
            text: 'Nếu cố ý hủy bạn sẽ phải chịu hình phạt',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Hủy hóa đơn',
            cancelButtonText: 'Thôi không hủy nữa',
            input: "text",
            inputLabel: "Nhập lí do huỷ đơn",
            inputAttributes: {
                autocapitalize: 'off'
            },
            preConfirm: async (cancelReason) => {
                try {
                    var response = await OrderHotelServiceAG.cancelInvoiceByOrderId(orderId, cancelReason)
                    $scope.isLoading = true;
                    if (response.status === 200) {
                        toastAlert("success", response.data.message)
                        $scope.playSuccessSound();
                        $scope.getOrderHotelList()
                        $('#detailsOrderHotelModal').modal("hide")
                    } else {
                        toastAlert("error", "Lỗi không xác định")
                        $scope.playErrorSound();
                    }
                } catch (error) {
                    toastAlert("error", error.message)
                    $scope.playErrorSound();
                } finally {
                    $scope.isLoading = false;
                }
            },
            allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
            if (result.isConfirmed) {
                // Thực hiện xác nhận hủy đơn dựa trên lý do được nhập
                console.log("Lý do hủy đơn: " + result.value);
            } else {
                // Người dùng chọn không hủy đơn
                console.log("Không hủy đơn");
            }
        });
    }


})