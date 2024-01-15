travel_app.controller('StayControllerAD', function ($scope) {
    // Khởi tạo đối tượng stayDetail
    $scope.stay = {
        tourName: null,
        nameOfAttraction: null,
        address: null,
        phoneNumber: null,
        stayStatus: null
    };

    // Hàm xử lý khi submit form
    $scope.submitStay = function () {
        console.log($scope.stay);
    };
});