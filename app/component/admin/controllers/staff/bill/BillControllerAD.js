travel_app.controller('BillControllerAD', function ($scope) {
    // Khởi tạo đối tượng bill
    $scope.bill = {
        tourName: null,
        nameOfAttraction: null,
        address: null,
        phoneNumber: null,
        stayStatus: null
    };

    // Hàm xử lý khi submit form
    $scope.submitBill = function () {
        console.log($scope.bill);
    };
});
