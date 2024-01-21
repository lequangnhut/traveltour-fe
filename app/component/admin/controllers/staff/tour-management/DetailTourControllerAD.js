travel_app.controller('DetailTourControllerAD', function ($scope, $location, $routeParams, $timeout, $http, TourDetailsServiceAD, ToursServiceAD, AccountServiceAD) {
    $scope.tourDetail = {
        tourId: null,
        guideId: null,
        departureDate: null,
        arrivalDate: null,
        numberOfGuests: null,
        unitPrice: null,
        tourDetailNotes: null,
        tourDetailStatus: null,
        dateCreated: null,
        tourDetailDescription: null,
        fromLocation: null,
        toLocation: null,
    };

    let searchTimeout;

    $scope.tourDetailList = []; // Biến để lưu danh sách tours
    $scope.currentPage = 0; // Trang hiện tại
    $scope.pageSize = 5; // Số lượng tours trên mỗi trang

    let tourId = $routeParams.id;

    // Khai báo biến để lưu danh sách tourType
    $scope.tourTypeList = [];

    function errorCallback(error) {
        console.log(error)
        toastAlert('error', "Máy chủ không tồn tại !");
    }

    // Hàm kiểm tra ngày bắt đầu có hợp lệ
    $scope.isStartDateValid = function () {
        if ($scope.tourDetail.startDate && $scope.tourDetail.endDate) {
            return new Date($scope.tourDetail.startDate) <= new Date($scope.tourDetail.endDate);
        }
        return true; // Mặc định là hợp lệ nếu một trong hai ngày không được chọn
    };

    $scope.isEndDateValid = function () {
        if ($scope.tourDetail.endDate && $scope.tourDetail.startDate) {
            return new Date($scope.tourDetail.endDate) >= new Date($scope.tourDetail.startDate);
        }
        return true; // Mặc định là hợp lệ nếu một trong hai ngày không được chọn
    };


    $scope.isNumberOfGuestsValid = function () {
        return $scope.tourDetail.numberOfGuests > 0; // Số lượng khách phải lớn hơn 0
    };


    $scope.setPage = function (page) {
        if (page >= 0 && page < $scope.totalPages) {
            $scope.currentPage = page;
            $scope.getTourDetailList();
        }
    };

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

    $scope.pageSizeChanged = function () {
        $scope.currentPage = 0; // Đặt lại về trang đầu tiên
        $scope.getTourDetailList(); // Tải lại dữ liệu với kích thước trang mới
    };

    $scope.getDisplayRange = function () {
        return Math.min(($scope.currentPage + 1) * $scope.pageSize, $scope.totalElements);
    };

    $scope.getTourDetailList = function () {
        TourDetailsServiceAD.findAllTourDetails($scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortDir)
            .then(function (response) {
                $scope.tourDetailList = response.data.data.content;
                $scope.totalPages = Math.ceil(response.data.data.totalElements / $scope.pageSize);
                $scope.totalElements = response.data.data.totalElements; // Tổng số phần tử

                // response.data.content.forEach(tour => {
                //     $scope.loadTourTypeName(tour.tourTypeId);
                // });
            }, errorCallback);

        if (tourId !== undefined && tourId !== null && tourId !== "") {
            TourDetailsServiceAD.findTourById(tourId).then(function successCallback(response) {
                if (response.status === 200) {
                    $scope.tourBasic = response.data.data;
                }
            }, errorCallback);
        }
    };

    //sắp xếp
    $scope.sortData = function (column) {
        $scope.sortBy = column;
        $scope.sortDir = ($scope.sortDir === 'asc') ? 'desc' : 'asc';
        $scope.getTourDetailList();
    };

    $scope.getSortIcon = function (column) {
        if ($scope.sortBy === column) {
            return $scope.sortDir === 'asc' ? 'fa-sort-up' : 'fa-sort-down';
        }
        return 'fa-sort';
    };

    //tìm kiếm
    $scope.searchTourDetail = function () {
        if (searchTimeout) $timeout.cancel(searchTimeout);

        searchTimeout = $timeout(function () {
            TourDetailsServiceAD.findAllTourDetails($scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortDir, $scope.searchTerm)
                .then(function (response) {
                    $scope.tourDetailList = response.data.data.content;
                    $scope.totalPages = Math.ceil(response.data.data.totalElements / $scope.pageSize);
                    $scope.totalElements = response.data.data.totalElements;
                }, errorCallback);
        }, 500); // 500ms debounce
    };

    $scope.getTourDetailList();

    /*==============================================================================*/

    //fill form input
    $scope.loadTourDetailForm = function () {
        ToursServiceAD.findAllToursSelect().then(function (response) {
            $scope.tourBasicList = response.data.data;
        }, errorCallback);

        AccountServiceAD.findUsersByRolesIsGuild().then(function successCallback(response) {
            $scope.UsersByRolesIsGuildSelect = response.data.data;
            console.log(response)
        }, errorCallback);

        $http.get('/lib/address/data.json').then(function (response) {
            $scope.provinces = response.data;
        }, errorCallback);

        $scope.onProvinceChange = function (locationType) {
            let selectedProvince = $scope.provinces.find(p => p.Id === $scope.tourDetail[locationType]);
            if (selectedProvince) {
                $scope.tourDetail[locationType] = selectedProvince.Name;
                console.log($scope.tourDetail[locationType])
            }
        };

    };

    $scope.loadTourDetailForm()

    //form create

    $scope.loadSelectTourType = function () {
        ToursTypeServiceAD.getAllTourTypes()
            .then(function (response) {
                $scope.tourTypeList = response.data;
            }, errorCallback);
    };

    // Gọi hàm để tải danh sách tourType khi controller được khởi tạo
    // $scope.loadSelectTourType();

    $scope.createTourSubmit = () => {
        $scope.isLoading = true;
        const dataTrans = new FormData();

        dataTrans.append("toursDto", new Blob([JSON.stringify($scope.tourBasic)], {type: "application/json"}));
        dataTrans.append("tourImg", $scope.tourImgNoCloud);

        TourDetailsServiceAD.createTour(dataTrans).then(function successCallback() {
            toastAlert('success', 'Thêm mới thành công !');
            $location.path('/admin/basic-tour-list');
        }, errorCallback).finally(function () {
            $scope.isLoading = false;
        });
    };

    function urlToFile(url, fileName, mimeType) {
        return fetch(url)
            .then(response => response.blob())
            .then(blob => new File([blob], fileName, {type: mimeType}));
    }

    //form update
    $scope.updateTourSubmit = () => {
        const dataTour = new FormData();
        $scope.isLoading = true;

        if ($scope.hasImage) {
            dataTour.append("toursDto", new Blob([JSON.stringify($scope.tourBasic)], {type: "application/json"}));
            dataTour.append("tourImg", $scope.tourImgNoCloud);
            updateTour(tourId, dataTour);
        } else {
            urlToFile($scope.tourBasic.tourImg, fileName, mimeType).then(file => {
                dataTour.append("toursDto", new Blob([JSON.stringify($scope.tourBasic)], {type: "application/json"}));
                dataTour.append("tourImg", file);
                updateTour(tourId, dataTour);
            }, errorCallback);
        }
    };

    const updateTour = (tourId, dataTour) => {
        TourDetailsServiceAD.updateTour(tourId, dataTour).then(function successCallback() {
            toastAlert('success', 'Cập nhật thành công !');
            $location.path('/admin/basic-tour-list');
        }, errorCallback).finally(function () {
            $scope.isLoading = false;
        });
    }


    //delete
    /**
     * Gọi api delete tour
     */
    $scope.deleteTour = function (userId, tourName) {
        function confirmDeleteTour() {
            TourDetailsServiceAD.deactivateTour(userId).then(function successCallback() {
                toastAlert('success', 'Xóa tour thành công !');
                $scope.getTourDetailList();
            }, errorCallback);
        }

        confirmAlert('Bạn có chắc chắn muốn xóa tour ' + tourName + ' không ?', confirmDeleteTour);
    }
});
