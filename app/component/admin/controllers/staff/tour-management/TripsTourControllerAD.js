travel_app.controller('TripsTourControllerAD', function ($scope, $sce, $location, $routeParams, $timeout, TourTripsServiceAD, ToursServiceAD) {
    $scope.isLoading = true;

    $scope.tourTrips = {
        tourDetailId: $routeParams.tourDetailId,
        dayInTrip: null,
        activityInDay: null,
    };

    $scope.tourTripsList = []; // Biến để lưu danh sách tours
    $scope.currentPage = 0; // Trang hiện tại
    $scope.pageSize = 5; // Số lượng tours trên mỗi trang

    let tourTripsId = $routeParams.tourTripsId;
    let tourDetailId = $scope.tourTrips.tourDetailId;

    $scope.tourName = '';
    $scope.activityInDayTouched = false
    $scope.maxActivityInDay = 1;

    $scope.showActivities = false;

    function errorCallback() {
        $location.path('/admin/internal-server-error')
    }

    $scope.setTouched = function () {
        $scope.activityInDayTouched = true;
    };

    $scope.isActive = function () {
        return $scope.activityInDayTouched &&
            ($scope.tourTrips.activityInDay === null ||
                $scope.tourTrips.activityInDay === undefined ||
                $scope.tourTrips.activityInDay === '');
    };

    $scope.canSubmit = function () {
        return $scope.activityInDayTouched && !$scope.isActive();
    };

    $scope.toggleActivities = function () {
        $scope.showActivities = !$scope.showActivities;
    };

    //phân trang
    $scope.setPage = function (page) {
        if (page >= 0 && page < $scope.totalPages) {
            $scope.currentPage = page;
            $scope.getTourTripsList();
        }
    };

    $scope.getPaginationRange = function () {
        let range = [];
        let start, end;

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

        for (let i = start; i < end; i++) {
            range.push(i);
        }

        return range;
    };

    $scope.pageSizeChanged = function () {
        $scope.currentPage = 0; // Đặt lại về trang đầu tiên
        $scope.getTourTripsList(); // Tải lại dữ liệu với kích thước trang mới
    };

    $scope.getDisplayRange = function () {
        return Math.min(($scope.currentPage + 1) * $scope.pageSize, $scope.totalElements);
    };

    $scope.getTourTripsList = function () {
        TourTripsServiceAD.getAllTrips($scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortDir, tourDetailId)
            .then(function (response) {
                if (response.data.data === null || response.data.data.content.length === 0) {
                    $scope.setPage(Math.max(0, $scope.currentPage - 1));
                    return
                }
                $scope.tourTripsList = response.data.data.content;
                $scope.totalPages = Math.ceil(response.data.data.totalElements / $scope.pageSize);
                $scope.totalElements = response.data.data.totalElements; // Tổng số phần tử

                $scope.tourTripsList.forEach(function (tourTrips) {
                    tourTrips.activityInDay = $sce.trustAsHtml(tourTrips.activityInDay);
                });
            }, errorCallback).finally(function () {
            $scope.isLoading = false;
        });

        if (tourTripsId !== undefined && tourTripsId !== null && tourTripsId !== "") {
            TourTripsServiceAD.findTripsById(tourTripsId).then(function successCallback(response) {
                if (response.status === 200) {
                    $timeout(function () {
                        $scope.tourTrips = response.data.data;

                    }, 0);
                }
            }, errorCallback);
        }
        if (tourDetailId !== undefined && tourTripsId !== null && tourTripsId !== "") {
            ToursServiceAD.findTourById(tourDetailId).then(function successCallback(response) {
                $scope.tourName = response.data.tourName;
            }, errorCallback);
        }

    };

    //sắp xếp
    $scope.sortData = function (column) {
        $scope.sortBy = column;
        $scope.sortDir = ($scope.sortDir === 'asc') ? 'desc' : 'asc';
        $scope.getTourTripsList();
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

    $scope.getTourTripsList();

    /*==============================================================================*/

    //form create

    $scope.createTourTripsSubmit = () => {
        $scope.isLoading = true;
        const dataTourTrips = new FormData();

        dataTourTrips.append("tourTripsDto", new Blob([JSON.stringify($scope.tourTrips)], {type: "application/json"}));

        TourTripsServiceAD.createTrips(dataTourTrips).then(function successCallback() {
            toastAlert('success', 'Thêm mới thành công !');
            $location.path('/admin/detail-tour-list/trips-tour-list/' + $scope.tourTrips.tourDetailId); // Điều hướng sau khi danh sách cập nhật
        }, errorCallback).finally(function () {
            $scope.isLoading = false;
        });

    };

    //form update
    $scope.updateTourTripsSubmit = () => {
        function confirmUpdate() {
            const dataTourTrips = new FormData();
            $scope.isLoading = true;

            dataTourTrips.append("tourTripsDto", new Blob([JSON.stringify($scope.tourTrips)], {type: "application/json"}));

            TourTripsServiceAD.updateTrips(tourTripsId, dataTourTrips).then(function successCallback() {
                toastAlert('success', 'Cập nhật thành công !');
                $location.path('/admin/detail-tour-list/trips-tour-list/' + $scope.tourTrips.tourDetailId);
            }, errorCallback).finally(function () {
                $scope.isLoading = false;
            });
        }

        confirmAlert('Bạn có chắc chắn muốn cập nhật kế hoạch không ?', confirmUpdate);
    };

    //delete
    /**
     * Gọi api delete tour
     */
    $scope.deleteTourTrips = function (tourTripsId) {
        function confirmDeleteTour() {
            TourTripsServiceAD.deactivateTrips(tourTripsId).then(function successCallback() {
                toastAlert('success', 'Xóa kế hoạch thành công !');
                $scope.getTourTripsList();
            }, errorCallback);
        }

        confirmAlert('Bạn có chắc chắn muốn xóa kế hoạch không ?', confirmDeleteTour);
    }
});
