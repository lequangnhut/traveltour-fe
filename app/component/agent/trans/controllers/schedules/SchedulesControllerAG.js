travel_app.controller('SchedulesControllerAG', function ($scope, $timeout, $filter, $location, $routeParams, $http, LocalStorageService, SchedulesServiceAG, TransportServiceAG) {
    let searchTimeout;
    let brandId = LocalStorageService.get('brandId');
    let scheduleId = $routeParams.id;

    $scope.provinces = [];

    $scope.isLoading = false;

    $scope.currentPage = 0;
    $scope.pageSize = 5;

    $scope.schedules = {
        id: null,
        transportationId: null,
        fromLocation: null,
        toLocation: null,
        departureTime: null,
        arrivalTime: null,
        unitPrice: null,
        bookedSeat: null,
        tripType: null,
        dateCreated: null,
        isActive: null,
        isStatus: null
    }

    function errorCallback() {
        $location.path('/admin/internal-server-error')
    }

    $scope.validateDates = function () {
        const start = new Date($scope.schedules.departureTime);
        const end = new Date($scope.schedules.arrivalTime);
        const now = new Date();

        // Kiểm tra nếu ngày / giờ về phải trước ngày / giờ đi
        if (start >= end) {
            $scope.form_trips.arrivalTime.$setValidity('dateRange', false);
        } else {
            $scope.form_trips.arrivalTime.$setValidity('dateRange', true);
        }

        // Kiểm tra nếu ngày / giờ đi là ngày / giờ quá khứ
        if (start <= now) {
            $scope.form_trips.departureTime.$setValidity('futureDate', false);
        } else {
            $scope.form_trips.departureTime.$setValidity('futureDate', true);
        }
    };

    $scope.$watch('schedules.departureTime', function () {
        $scope.validateDates();
    });

    $scope.$watch('schedules.arrivalTime', function () {
        $scope.validateDates();
    });

    /**
     * API lấy dữ liệu tỉnh thành và fill dữ liệu lên select
     */
    $http.get('/lib/address/data.json').then(function (response) {
        $scope.provinces = response.data;
    });

    /**
     * Hàm kiểm tra sự trùng lặp giữa điểm đi và điểm đến
     * @returns {boolean}
     */
    function hasDuplicateSelection() {
        return $scope.schedules.fromLocation === $scope.schedules.toLocation;
    }

    /**
     * Hàm kiểm tra sự trùng lặp giữa điểm đi và điểm đến
     */
    $scope.updateToLocation = function () {
        if (hasDuplicateSelection()) {
            $scope.schedules.toLocation = null;
            $scope.toLocationError = true;
        } else {
            $scope.toLocationError = false;
        }

        $scope.filteredProvinces = $scope.provinces.filter(function (city) {
            return city.Name !== $scope.schedules.fromLocation;
        });
    };

    $scope.init = function () {
        SchedulesServiceAG.findAllSchedules(brandId, $scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortDir).then(function (response) {
            $scope.transportationSchedules = response.data.content;
            $scope.totalPages = Math.ceil(response.data.totalElements / $scope.pageSize);
            $scope.totalElements = response.data.totalElements;
        }, errorCallback).finally(function () {
            $scope.isLoading = false;
        });

        /**
         * Tìm kiếm
         */
        $scope.searchTransportationSchedules = function () {
            if (searchTimeout) $timeout.cancel(searchTimeout);

            searchTimeout = $timeout(function () {
                SchedulesServiceAG.findAllSchedules(brandId, $scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortDir, $scope.searchTerm)
                    .then(function (response) {
                        $scope.transportationSchedules = response.data.content;
                        $scope.totalPages = Math.ceil(response.data.totalElements / $scope.pageSize);
                        $scope.totalElements = response.data.totalElements;
                    }, errorCallback).finally(function () {
                    $scope.isLoading = false;
                });
            }, 500);
        };

        /**
         * Tìm tất cả phương tiện bằng brandId
         * @param brandId
         */
        SchedulesServiceAG.findAllScheduleByTransportId(brandId).then(function (response) {
            if (response.status === 200) {
                $scope.transportations = response.data.data;
            } else {
                $location.path('/admin/page-not-found');
            }
        }, errorCallback);

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

        if (scheduleId !== undefined && scheduleId !== null && scheduleId !== "") {
            SchedulesServiceAG.findByScheduleId(scheduleId).then(function successCallback(response) {
                if (response.status === 200) {
                    $scope.schedules = response.data.data.schedules;
                    $scope.schedules.departureTime = new Date($scope.schedules.departureTime);
                    $scope.schedules.arrivalTime = new Date($scope.schedules.arrivalTime);
                    $scope.schedules.unitPrice = response.data.data.price;
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
            return $scope.sortDir === 'asc' ? 'fa-sort-up' : 'fa-sort-down';
        }
        return 'fa-sort';
    };

    /**
     * Gọi api create
     */
    $scope.createSchedule = function () {
        $scope.isLoading = true;
        $scope.schedules.departureTime = new Date($scope.schedules.departureTime).toISOString();
        $scope.schedules.arrivalTime = new Date($scope.schedules.arrivalTime).toISOString();

        let transportationSchedulesDto = $scope.schedules;

        SchedulesServiceAG.create(transportationSchedulesDto).then(function () {
            $location.path('/business/transport/schedules-management');
            toastAlert('success', 'Thêm mới thành công !');
        }, errorCallback).finally(function () {
            $scope.isLoading = false;
        });
    }

    /**
     * Gọi api update
     */
    function confirmUpdate() {
        $scope.isLoading = true;
        $scope.schedules.departureTime = new Date($scope.schedules.departureTime).toISOString();
        $scope.schedules.arrivalTime = new Date($scope.schedules.arrivalTime).toISOString();

        let transportationSchedulesDto = $scope.schedules;

        SchedulesServiceAG.update(transportationSchedulesDto).then(function () {
            $location.path('/business/transport/schedules-management');
            toastAlert('success', 'Cập nhật thành công !');
        }, errorCallback).finally(function () {
            $scope.isLoading = false;
        });
    }

    $scope.updateSchedule = function () {
        confirmAlert('Bạn có chắc chắn muốn cập nhật không ?', confirmUpdate);
    }

    /**
     * Gọi api delete
     */
    $scope.deleteSchedule = function (scheduleId, fromLocation, toLocation) {
        function confirmDelete() {
            SchedulesServiceAG.delete(scheduleId).then(function () {
                $location.path('/business/transport/schedules-management');
                toastAlert('success', 'Xóa chuyến đi thành công !');
            }, errorCallback).finally(function () {
                $scope.isLoading = false;
            });
        }

        confirmAlert('Bạn có chắc chắn muốn xóa chuyến đi từ '
            + fromLocation + ' đến ' + toLocation + ' không ?', confirmDelete);
    }

    $scope.init();
});
