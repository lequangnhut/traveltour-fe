travel_app.controller('BasicTourControllerAD', function ($scope, $location, $routeParams, $timeout, ToursServiceAD, ToursTypeServiceAD) {
    $scope.isLoading = true;

    const fileName = "default.jpg";
    const mimeType = "image/jpeg";

    $scope.hasImage = false;

    $scope.tourBasicList = []; // Biến để lưu danh sách tours
    $scope.currentPage = 0; // Trang hiện tại
    $scope.pageSize = 5; // Số lượng tours trên mỗi trang


    // Đối tượng tourBasic mới cho form tour
    $scope.tourBasic = {
        tourName: null,
        tourTypeId: null, dateCreated: null,
        isActive: null,
        tourImg: null,
        tourDescription: ''
    };

    let searchTimeout;

    $scope.tourTypeNames = {};

    let tourId = $routeParams.id;

    //================================================================

    // Khai báo biến để lưu danh sách tourType
    $scope.tourTypeList = [];

    function errorCallback() {
        $location.path('/admin/internal-server-error')
    }

    /**
     * Tải lên hình ảnh tour và lưu vào biến tourBasic.tourImg
     * @param file
     */
    $scope.uploadTourImage = function (file) {
        if (file && !file.$error) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $scope.tourBasic.tourImg = e.target.result;
                $scope.tourImgNoCloud = file;
                $scope.hasImage = true; // Đánh dấu là đã có ảnh
                $scope.$apply();
            };

            reader.readAsDataURL(file);
        }
    };

    $scope.getCurrentImageSource = function () {
        if ($scope.tourBasic.tourImg && typeof $scope.tourBasic.tourImg === 'string' && $scope.tourBasic.tourImg.startsWith('http')) {
            $scope.tourImgNoCloud = $scope.tourBasic.tourImg;
            return $scope.tourBasic.tourImg;
        } else if ($scope.tourBasic.tourImg && typeof $scope.tourBasic.tourImg === 'string') {
            return $scope.tourBasic.tourImg;
        }
    };

    $scope.loadTourTypeName = function (tourId) {
        if (!$scope.tourTypeNames[tourId]) {
            ToursTypeServiceAD.findTourTypeById(tourId)
                .then(function (response) {
                    $scope.tourTypeNames[tourId] = response.data.tourTypeName;
                }, errorCallback);
        }
    };


    $scope.setPage = function (page) {
        if (page >= 0 && page < $scope.totalPages) {
            $scope.currentPage = page;
            $scope.getTourBasicList();
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
        $scope.getTourBasicList(); // Tải lại dữ liệu với kích thước trang mới
    };

    $scope.getDisplayRange = function () {
        return Math.min(($scope.currentPage + 1) * $scope.pageSize, $scope.totalElements);
    };

    $scope.getTourBasicList = function () {
        ToursServiceAD.findAllTours($scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortDir)
            .then(function (response) {
                if (response.data === null || response.data.content.length === 0) {
                    $scope.setPage(Math.max(0, $scope.currentPage - 1));
                    return
                }
                $scope.tourBasicList = response.data.content;
                $scope.totalPages = Math.ceil(response.data.totalElements / $scope.pageSize);
                $scope.totalElements = response.data.totalElements; // Tổng số phần tử

                response.data.content.forEach(tour => {
                    $scope.loadTourTypeName(tour.tourTypeId);
                });
            }, errorCallback).finally(function () {
            $scope.isLoading = false;
        });

        if (tourId !== undefined && tourId !== null && tourId !== "") {
            ToursServiceAD.findTourById(tourId).then(function successCallback(response) {
                if (response.status === 200) {
                    $scope.tourBasic = response.data;
                }
            }, errorCallback);
        }
    };


    $scope.sortData = function (column) {
        $scope.sortBy = column;
        $scope.sortDir = ($scope.sortBy === column && $scope.sortDir === 'asc') ? 'desc' : 'asc';
        $scope.getTourBasicList();
    };

    $scope.getSortIcon = function (column) {
        if ($scope.sortBy === column) {
            return $scope.sortDir === 'asc' ? 'arrow_drop_up' : 'arrow_drop_down';
        }
        return 'swap_vert';
    };


    $scope.searchTours = function () {
        if (searchTimeout) $timeout.cancel(searchTimeout);

        searchTimeout = $timeout(function () {
            ToursServiceAD.findAllTours($scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortDir, $scope.searchTerm)
                .then(function (response) {
                    $scope.tourBasicList = response.data.content;
                    $scope.totalPages = Math.ceil(response.data.totalElements / $scope.pageSize);
                    $scope.totalElements = response.data.totalElements;
                }, errorCallback);
        }, 500); // 500ms debounce
    };

    $scope.getTourBasicList();

    /*==============================================================================*/
    //form create

    $scope.loadSelectTourType = function () {
        ToursTypeServiceAD.getAllTourTypes()
            .then(function (response) {
                $scope.tourTypeList = response.data;
            }, errorCallback);
    };

    // Gọi hàm để tải danh sách tourType khi controller được khởi tạo
    $scope.loadSelectTourType();

    $scope.createTourSubmit = () => {
        $scope.isLoading = true;
        const dataTrans = new FormData();

        dataTrans.append("toursDto", new Blob([JSON.stringify($scope.tourBasic)], {type: "application/json"}));
        dataTrans.append("tourImg", $scope.tourImgNoCloud);

        ToursServiceAD.createTour(dataTrans).then(function successCallback() {
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
        ToursServiceAD.updateTour(tourId, dataTour).then(function successCallback() {
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
            ToursServiceAD.deactivateTour(userId).then(function successCallback() {
                toastAlert('success', 'Xóa thành công !');
                $scope.getTourBasicList();
            }, errorCallback);
        }

        confirmAlert('Bạn có chắc chắn muốn xóa tour ' + tourName + ' không ?', confirmDeleteTour);
    }
});