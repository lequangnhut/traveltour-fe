travel_app.controller('DetailTourControllerAD', function ($scope) {
    $scope.tourDetail = {
        tourName: '',
        tourGuide: '',
        numberOfGuests: null,
        startDate: '',
        endDate: '',
        price: null,
        tourStatus: '',
        note: ''
    };

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


    // Hàm kiểm tra số lượng khách có hợp lệ
    $scope.isNumberOfGuestsValid = function () {
        return $scope.tourDetail.numberOfGuests > 0; // Số lượng khách phải lớn hơn 0
    };

    /**
     * Gửi dữ liệu tour để cập nhật hoặc tạo mới
     */
    $scope.submitTourDetail = function () {
        console.log($scope.tourDetail)
    };

});
