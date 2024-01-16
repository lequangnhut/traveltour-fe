travel_app.controller('VehicleControllerAD', function ($scope) {
    // Đối tượng vehicle mới cho form phương tiện
    $scope.vehicle = {
        tourName: null,
        vehicleName: null,          // Tên phương tiện
        vehicleNumber: null,        // Số hiệu phương tiện
        seatingCapacity: null,      // Số chỗ ngồi
        vehicleStatus: null,        // Trạng thái phương tiện
        fromLocation: null,         // Điểm xuất phát
        toLocation: null            // Điểm đến
    };

    // Hàm xử lý khi form được gửi
    $scope.submitVehicle = function () {
        console.log($scope.vehicle);
    };
});