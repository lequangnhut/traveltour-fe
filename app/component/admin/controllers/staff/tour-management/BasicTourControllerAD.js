travel_app.controller('BasicTourControllerAD', function ($scope, $location, $routeParams, ToursServiceAD) {

    $scope.tourBasicList = []; // Biến để lưu danh sách tours
    $scope.currentPage = 0; // Trang hiện tại
    $scope.pageSize = 5; // Số lượng tours trên mỗi trang
    $scope.totalPages = 0; // Tổng số trang
    $scope.sortBy = 'id'; // Sắp xếp theo trường nào
    $scope.sortDir = 'asc'; // Hướng sắp xếp


    // Đối tượng tourBasic mới cho form tour
    $scope.tourBasic = {
        tourName: null,
        tourType: null,
        tourStatus: null,
        tourImage: null
    };

    function errorCallback(error) {
        console.log(error)
        toastAlert('error', "Máy chủ không tồn tại !");
    }

    /**
     * Tải lên hình ảnh tour và lưu vào biến tourBasic.tourImage
     * @param file
     */
    $scope.uploadTourImage = function (file) {
        if (file && !file.$error) {
            $scope.tourBasic.tourImage = file;
        }
    };

    /**
     * Gửi dữ liệu tour để cập nhật hoặc tạo mới
     */
    $scope.submitTour = function () {
        console.log($scope.tourBasic);
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
                $scope.tourBasicList = response.data.content;
                $scope.totalPages = Math.ceil(response.data.totalElements / $scope.pageSize);
                $scope.totalElements = response.data.totalElements; // Tổng số phần tử
            }, errorCallback);
    };


    $scope.sortData = function (column) {
        $scope.sortBy = column;
        $scope.sortDir = ($scope.sortDir === 'asc') ? 'desc' : 'asc';
        $scope.getTourBasicList();
    };


    $scope.createTour = function () {
        ToursServiceAD.createTour($scope.tourBasic)
            .then(function (response) {
                // Xử lý khi tạo tour thành công
            }, errorCallback);
    };

    $scope.getTourBasicList();

});