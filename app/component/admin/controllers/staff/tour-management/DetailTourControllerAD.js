travel_app.controller('DetailTourControllerAD', function ($scope, $location, $routeParams, $timeout, $http, TourDetailsServiceAD, ToursServiceAD, AccountServiceAD) {
    $scope.isLoading = true;

    $scope.tourDetail = {
        tourDetailId: null,
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

    let tourDetailId = $routeParams.id;

    $scope.tourTypeList = [];

    $scope.invalidPriceFormat = false;

    function errorCallback() {
        $location.path('/admin/internal-server-error')
    }

    // Hàm kiểm tra ngày bắt đầu có hợp lệ
    $scope.isStartDateValid = function () {
        if ($scope.tourDetail.departureDate && $scope.tourDetail.arrivalDate) {
            return new Date($scope.tourDetail.departureDate) <= new Date($scope.tourDetail.arrivalDate);
        }
        return true; // Mặc định là hợp lệ nếu một trong hai ngày không được chọn
    };

    $scope.isEndDateValid = function () {
        if ($scope.tourDetail.arrivalDate && $scope.tourDetail.departureDate) {
            return new Date($scope.tourDetail.arrivalDate) >= new Date($scope.tourDetail.departureDate);
        }
        return true; // Mặc định là hợp lệ nếu một trong hai ngày không được chọn
    };


    $scope.isNumberOfGuestsValid = function () {
        return $scope.tourDetail.numberOfGuests >= 16 && $scope.tourDetail.numberOfGuests <= 50; // Số lượng khách phải lớn hơn 0
    };

    function isPriceValid(price) {
        return price > 0;
    }

    $scope.isPriceValid = function () {
        return isPriceValid($scope.tourDetail.unitPrice);
    }

    $scope.onPriceKeyPress = function (event) {
        let inputValue = event.key;

        if (/^[0-9]+$/.test(inputValue)) {
            return true;
        } else {
            event.preventDefault();
            return false;
        }
    };

    $scope.checkPriceFormat = function () {
        // Kiểm tra xem giá có đúng định dạng số không
        if (!/^[0-9]*$/.test($scope.tourDetail.unitPrice)) {
            $scope.invalidPriceFormat = true;
        } else {
            $scope.invalidPriceFormat = false;
        }
    };


    //phân trang
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
                if (response.data.data === null || response.data.data.content.length === 0) {
                    $scope.setPage(Math.max(0, $scope.currentPage - 1));
                    return
                }
                $scope.tourDetailList = response.data.data.content;
                $scope.totalPages = Math.ceil(response.data.data.totalElements / $scope.pageSize);
                $scope.totalElements = response.data.data.totalElements; // Tổng số phần tử
            }, errorCallback).finally(function () {
            $scope.isLoading = false;
        });

        if (tourDetailId !== undefined && tourDetailId !== null && tourDetailId !== "") {
            TourDetailsServiceAD.findTourDetailById(tourDetailId).then( response => {
                if (response.status === 200) {
                    $timeout(function () {
                        $scope.tourDetail = response.data.data;
                        $scope.tourDetail.departureDate = new Date(response.data.data.departureDate);
                        $scope.tourDetail.arrivalDate = new Date(response.data.data.arrivalDate);
                    }, 0);
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
            return $scope.sortDir === 'asc' ? 'arrow_drop_up' : 'arrow_drop_down';
        }
        return 'swap_vert';
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

    $scope.createTourDetailSubmit = () => {
        $scope.isLoading = true;
        const dataTourDetail = new FormData();

        dataTourDetail.append("tourDetailsDto", new Blob([JSON.stringify($scope.tourDetail)], {type: "application/json"}));

        TourDetailsServiceAD.createTourDetail(dataTourDetail).then(function successCallback() {
            toastAlert('success', 'Thêm mới thành công !');
            $location.path('/admin/detail-tour-list');
        }, errorCallback).finally(function () {
            $scope.isLoading = false;
        });
    };

    //form update
    $scope.updateTourDetailSubmit = () => {
        const dataTourDetail = new FormData();
        $scope.isLoading = true;

        dataTourDetail.append("tourDetailsDto", new Blob([JSON.stringify($scope.tourDetail)], {type: "application/json"}));

        TourDetailsServiceAD.updateTourDetail(tourDetailId, dataTourDetail).then(function successCallback() {
            toastAlert('success', 'Cập nhật thành công !');
            $location.path('/admin/detail-tour-list');
        }, errorCallback).finally(function () {
            $scope.isLoading = false;
        });
    };

    //delete
    /**
     * Gọi api delete tour
     */
    $scope.deleteTourDetail = function (tourDetailId) {
        function confirmDeleteTour() {
            TourDetailsServiceAD.deactivateTourDetail(tourDetailId).then(function successCallback() {
                toastAlert('success', 'Xóa thành công !');
                $scope.getTourDetailList();
            }, errorCallback);
        }

        confirmAlert('Bạn có chắc chắn muốn xóa tour detail có id là ' + tourDetailId + ' không ?', confirmDeleteTour);
    }
});
