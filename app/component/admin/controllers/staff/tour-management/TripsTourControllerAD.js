travel_app.controller('TripsTourControllerAD', function ($scope, $sce, $location, $routeParams, $timeout, TourTripsServiceAD, ToursServiceAD) {
    $scope.isLoading = true;

    $scope.tourTrips = {
        tourId: $routeParams.tourId,
        dayInTrip: null,
        activityInDay: null,
    };

    $scope.tourTripsList = []; // Biến để lưu danh sách tours
    $scope.currentPage = 0; // Trang hiện tại
    $scope.pageSize = 5; // Số lượng tours trên mỗi trang

    let tourTripsId = $routeParams.tourTripsId;
    let tourId = $scope.tourTrips.tourId;

    $scope.tourName = '';
    $scope.activityInDayTouched = false
    $scope.maxActivityInDay = 1;

    $scope.showActivities = false;

    function errorCallback() {
        // $location.path('/admin/internal-server-error')
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
        TourTripsServiceAD.getAllTrips($scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortDir, tourId)
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
                        console.log(response)
                        $scope.tourTrips = response.data.data;

                    }, 0);
                }
            }, errorCallback);
        }
        if (tourId !== undefined && tourTripsId !== null && tourTripsId !== "") {
            ToursServiceAD.findTourById(tourId).then(function successCallback(response) {
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
            return $scope.sortDir === 'asc' ? 'arrow_drop_up' : 'arrow_drop_down';
        }
        return 'swap_vert';
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
            $location.path('/admin/basic-tour-list/trips-tour-list/' + $scope.tourTrips.tourId); // Điều hướng sau khi danh sách cập nhật
        }, errorCallback).finally(function () {
            $scope.isLoading = false;
        });

    };

    //form update
    $scope.updateTourTripsSubmit = () => {
        const dataTourTrips = new FormData();
        $scope.isLoading = true;

        dataTourTrips.append("tourTripsDto", new Blob([JSON.stringify($scope.tourTrips)], {type: "application/json"}));

        TourTripsServiceAD.updateTrips(tourTripsId, dataTourTrips).then(function successCallback() {
            toastAlert('success', 'Cập nhật thành công !');
            $location.path('/admin/basic-tour-list/trips-tour-list/' + $scope.tourTrips.tourId);
        }, errorCallback).finally(function () {
            $scope.isLoading = false;
        });
    };

    //delete
    /**
     * Gọi api delete tour
     */
    $scope.deleteTourTrips = function (tourTripsId) {
        function confirmDeleteTour() {
            TourTripsServiceAD.deactivateTrips(tourTripsId).then(function successCallback() {
                toastAlert('success', 'Xóa thành công !');
                $scope.getTourTripsList();
            }, errorCallback);
        }

        confirmAlert('Bạn có chắc chắn muốn xóa tour trips này không ?', confirmDeleteTour);
    }
});
