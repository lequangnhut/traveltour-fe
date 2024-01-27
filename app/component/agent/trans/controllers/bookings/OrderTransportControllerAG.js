travel_app.controller('OrderTransportControllerAG', function ($scope, $routeParams, $filter, $timeout, $location, LocalStorageService, GenerateCodeFactory, TransportServiceAG, OrderTransportService) {
    let searchTimeout;
    let orderTransportId = $routeParams.id;
    let brandId = LocalStorageService.get('brandId');
    let userId = $scope.user.id;

    $scope.isLoading = true;

    $scope.currentPage = 0;
    $scope.pageSize = 5;

    $scope.transportScheduleName = {};

    $scope.bookings = {
        id: null,
        userId: userId,
        transportationScheduleId: null,
        customerName: null,
        customerCitizenCard: null,
        customerPhone: null,
        customerEmail: null,
        amountTicket: null,
        orderTotal: null,
        priceFormat: null,
        paymentMethod: null,
        orderCode: GenerateCodeFactory.generateOrderCode(),
        dateCreated: new Date(),
        orderStatus: null,
        orderNote: null
    }

    function errorCallback() {
        $location.path('/admin/internal-server-error');
    }

    $scope.init = function () {
        OrderTransportService.findAllOrderTransport(brandId, $scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortDir)
            .then(function successCallback(response) {
                if (response.status === 200) {
                    $scope.orderTransport = response.data.content;
                    $scope.totalPages = Math.ceil(response.data.totalElements / $scope.pageSize);
                    $scope.totalElements = response.data.totalElements;

                    response.data.content.forEach(transportSchedule => {
                        $scope.findTransportSchedule(transportSchedule.transportationScheduleId);
                    });
                }
            }, errorCallback).finally(function () {
            $scope.isLoading = false;
        });

        /**
         * Tìm kiếm
         */
        $scope.searchOrderTransport = function () {
            if (searchTimeout) $timeout.cancel(searchTimeout);

            searchTimeout = $timeout(function () {
                OrderTransportService.findAllOrderTransport(brandId, $scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortDir, $scope.searchTerm)
                    .then(function (response) {
                        $scope.orderTransport = response.data.content;
                        $scope.totalPages = Math.ceil(response.data.totalElements / $scope.pageSize);
                        $scope.totalElements = response.data.totalElements;
                    }, errorCallback).finally(function () {
                    $scope.isLoading = false;
                });
            }, 500);
        };

        /**
         * Tìm tên thương hiệu phương tiện bằng brandId
         * @param transportTypeId
         */
        TransportServiceAG.findByTransportBrandId(brandId).then(function (response) {
            if (response.status === 200) {
                $scope.transportBrand = response.data.data;
            } else {
                $location.path('/admin/page-not-found');
            }
        }, errorCallback);

        /**
         * Tìm tên thương hiệu phương tiện bằng brandId
         * @param transportTypeId
         */
        OrderTransportService.findScheduleByBrandId(brandId).then(function (response) {
            if (response.status === 200) {
                $scope.transportSchedules = response.data.data;
            } else {
                $location.path('/admin/page-not-found');
            }
        }, errorCallback);

        /**
         * Tìm tên tỉnh đi với tỉnh đến bằng scheduleId
         * @param scheduleId
         */
        $scope.findTransportSchedule = function (scheduleId) {
            if (!$scope.transportScheduleName[scheduleId]) {
                OrderTransportService.findScheduleByScheduleId(scheduleId).then(function (response) {
                    if (response.status === 200) {
                        $scope.transportScheduleName[scheduleId] = response.data.data;
                    } else {
                        $location.path('/admin/page-not-found');
                    }
                }, errorCallback);
            }
        };

        /**
         * Update số lượng thì giá tiền cập nhật lun theo số vé
         */
        $scope.updateAmountAndTotal = function () {
            $scope.bookings.amountTicket = 1;

            const selectedSchedule = $scope.transportSchedules.find(function (schedule) {
                return schedule.id === $scope.bookings.transportationScheduleId;
            });

            if (selectedSchedule) {
                $scope.bookings.orderTotal = $scope.formatPrice(selectedSchedule.unitPrice * $scope.bookings.amountTicket);
            }
        };

        $scope.updateTotal = function () {
            const selectedSchedule = $scope.transportSchedules.find(function (schedule) {
                return schedule.id === $scope.bookings.transportationScheduleId;
            });

            if (selectedSchedule) {
                $scope.bookings.orderTotal = $scope.formatPrice(selectedSchedule.unitPrice * $scope.bookings.amountTicket);
            }
        };

        if (orderTransportId !== undefined && orderTransportId !== null && orderTransportId !== "") {
            OrderTransportService.findByOrderTransportId(orderTransportId).then(function successCallback(response) {
                if (response.status === 200) {
                    $scope.bookings = response.data.data.orderTransportations;
                    $scope.bookings.orderTotal = response.data.data.price;
                } else {
                    $location.path('/admin/page-not-found');
                }
            }, errorCallback);
        }
    }

    /**
     * Phân trang
     */
    $scope.setPage = function (page) {
        if (page >= 0 && page < $scope.totalPages) {
            $scope.currentPage = page;
            $scope.init();
        }
    };

    $scope.getPaginationRange = function () {
        const range = [];
        let start, end;

        if ($scope.totalPages <= 3) {
            start = 0;
            end = $scope.totalPages;
        } else {
            start = Math.max(0, $scope.currentPage - 1);
            end = Math.min(start + 3, $scope.totalPages);

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
        $scope.init();
    };

    $scope.getDisplayRange = function () {
        return Math.min(($scope.currentPage + 1) * $scope.pageSize, $scope.totalElements);
    };

    /**
     * Sắp xếp
     */
    $scope.sortData = function (column) {
        $scope.sortBy = column;
        $scope.sortDir = ($scope.sortDir === 'asc') ? 'desc' : 'asc';
        $scope.init();
    };

    $scope.getSortIcon = function (column) {
        if ($scope.sortBy === column) {
            return $scope.sortDir === 'asc' ? 'arrow_drop_up' : 'arrow_drop_down';
        }
        return 'swap_vert';
    };

    /**
     * Gọi api tạo mới
     */
    $scope.createOrderTransport = function () {
        $scope.isLoading = true;
        $scope.bookings.priceFormat = $scope.bookings.orderTotal;
        let orderTransportationsDto = $scope.bookings;

        OrderTransportService.create(orderTransportationsDto).then(function successCallback() {
            toastAlert('success', 'Thêm mới thành công !')
            $location.path('/business/transport/booking-management');
        }, errorCallback).finally(function () {
            $scope.isLoading = false;
        });
    }

    /**
     * Gọi api update
     */
    $scope.updateOrderTransport = function () {
        function confirmUpdate() {
            $scope.isLoading = true;
            $scope.bookings.priceFormat = $scope.bookings.orderTotal;
            let orderTransportationsDto = $scope.bookings;

            OrderTransportService.update(orderTransportationsDto).then(function successCallback() {
                toastAlert('success', 'Cập nhật thành công !')
                $location.path('/business/transport/booking-management');
            }, errorCallback).finally(function () {
                $scope.isLoading = false;
            });
        }

        confirmAlert('Bạn có chắc chắn muốn cập nhật không ?', confirmUpdate);
    }

    /**
     * Gọi api delete
     */
    $scope.deleteOrderTransport = function (orderTransportId, amountTicket, fromLocation, toLocation) {
        function confirmDelete() {
            OrderTransportService.delete(orderTransportId).then(function () {
                toastAlert('success', 'Xóa vé thành công !');
                $location.path('/business/transport/booking-management');
                $scope.init();
            }, errorCallback).finally(function () {
                $scope.isLoading = false;
            });
        }

        confirmAlert('Bạn có chắc chắn muốn xóa ' + amountTicket + ' vé đi từ '
            + fromLocation + ' đến ' + toLocation + ' không ?', confirmDelete);
    }

    $scope.init();
});
