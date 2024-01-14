travel_app.controller('StaffControllerAD', function ($scope) {

    $scope.user = {
        fullname: null,
        phoneNumber: null,
        email: null,
        birth: null,
        gender: null,
        citizenid: null,
        address: null,
        staffstatus: null
    }

    /**
     * Upload hình ảnh và lưu vào biến business_license
     * @param file
     */
    $scope.uploadAvatarFile = function (file) {
        if (file && !file.$error) {
            $scope.user.avatar = file;
        }
    };

    $scope.checkBirth = function () {
        var birthDate = new Date($scope.user.birth);
        var today = new Date();

        var age = today.getFullYear() - birthDate.getFullYear();
        var monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        if (age < 16) {
            $scope.user.birth = null;
        }
    };

    $scope.isBirthInvalid = function () {
        return !$scope.user.birth; // Nếu không có ngày sinh, trả về true
    };

    $scope.isBirthValid = function () {
        return !$scope.isBirthInvalid(); // Ngược lại, trả về false
    };

    /**
     * Submit gửi dữ liệu cho api
     */
    $scope.submitAdminStaffEdit = function () {
        console.log($scope.user)
    };

    $scope.submitAdminStaffAdd = function () {
        console.log($scope.user)
    };
});