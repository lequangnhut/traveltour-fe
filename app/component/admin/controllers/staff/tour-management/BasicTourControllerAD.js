travel_app.controller('BasicTourControllerAD', function ($scope) {
    // Đối tượng tourBasic mới cho form tour
    $scope.tourBasic = {
        tourName: null,
        tourType: null,
        tourStatus: null,
        tourImage: null
    };


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

});