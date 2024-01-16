travel_app.controller('TourCustomersControllerAD', function ($scope) {
    $scope.tourCustomer = {
        customerName: null,
        phoneNumber: null,
        birth: null,
    }


    $scope.checkBirth = function () {
        var birthDate = new Date($scope.tourCustomer.birth);
        var today = new Date();

        var age = today.getFullYear() - birthDate.getFullYear();
        var monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        $scope.invalidBirth = age < 16; // Thêm một biến mới để kiểm tra tuổi
    };

    $scope.isBirthInvalid = function () {
        return $scope.invalidBirth; // Sử dụng biến mới để kiểm tra tuổi
    };

    $scope.isBirthValid = function () {
        return !$scope.isBirthInvalid() && $scope.tourCustomer.birth; // Kiểm tra cả tuổi và ngày sinh không rỗng
    };

    /**
     * Submit gửi dữ liệu cho api
     */

    $scope.submitTourCustomer = function () {
        console.log($scope.tourCustomer)
    };

});