travel_app.controller('SchedulesControllerAG', function ($scope, $timeout, $http, LocalStorageService, SchedulesServiceAG, TransportServiceAG) {
    let searchTimeout;
    let brandId = LocalStorageService.get('brandId');

    $scope.isLoading = false;

    $scope.currentPage = 0;
    $scope.pageSize = 5;

    $scope.agent = {
        id: null,
        transportationId: null,
        fromLocation: null,
        toLocation: null,
        departureTime: null,
        arrivalTime: null,
        unitPrice: null,
        bookedSeat: null,
        tripType: null
    }

    /**
     * hqua làm tới đây nè nghe, nhớ đổi tên mấy thuộc tính bên form thêm và update
     */
    function errorCallback() {
        $location.path('/admin/internal-server-error')
    }

    $scope.validateDates = function () {
        const start = new Date($scope.agent.date_trip_start);
        const end = new Date($scope.agent.date_trip_end);
        const now = new Date();

        // Kiểm tra nếu ngày / giờ về phải trước ngày / giờ đi
        if (start >= end) {
            $scope.form_trips.date_trip_end.$setValidity('dateRange', false);
        } else {
            $scope.form_trips.date_trip_end.$setValidity('dateRange', true);
        }

        // Kiểm tra nếu ngày / giờ đi là ngày / giờ quá khứ
        if (start <= now) {
            $scope.form_trips.date_trip_start.$setValidity('futureDate', false);
        } else {
            $scope.form_trips.date_trip_start.$setValidity('futureDate', true);
        }
    };

    $scope.$watch('agent.date_trip_start', function () {
        $scope.validateDates();
    });

    $scope.$watch('agent.date_trip_end', function () {
        $scope.validateDates();
    });

    /**
     * API lấy dữ liệu tỉnh thành và fill dữ liệu lên select
     */
    $http.get('/lib/address/data.json').then(function (response) {
        $scope.provinces = response.data;
    });

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
        console.log($scope.agent)
    }

    /**
     * Gọi api update
     */
    $scope.updateSchedule = function () {

    }

    /**
     * Gọi api delete
     */
    $scope.deleteSchedule = function () {

    }

    $scope.init();
});
