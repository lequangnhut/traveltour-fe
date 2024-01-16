travel_app.controller('CustomerControllerAD', function ($scope) {
    $scope.customer = {
        fullName: null,
        phoneNumber: null,
        email: null,
        birth: null,
        gender: null,
        citizenId: null,
        address: null,
        status: null
    }

    /**
     * Upload hình ảnh và lưu vào biến business_license
     * @param file
     */
    $scope.uploadAvatarFile = function (file) {
        if (file && !file.$error) {
            $scope.customer.avatar = file;
        }
    };

    $scope.checkBirth = function () {
        var birthDate = new Date($scope.customer.birth);
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
        return !$scope.isBirthInvalid() && $scope.customer.birth; // Kiểm tra cả tuổi và ngày sinh không rỗng
    };

    /**
     * Submit gửi dữ liệu cho api
     */
    $scope.submitCustomer = function () {
        console.log($scope.customer)
    };

});