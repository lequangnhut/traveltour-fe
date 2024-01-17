travel_app.controller('AccountControllerAD', function ($scope, $location, $routeParams, AccountServiceAD, AuthService) {
    $scope.selectedRoles = [];

    $scope.emailError = false;
    $scope.phoneError = false;

    $scope.admin = {
        email: null,
        password: null,
        cpsw: null,
        fullName: null,
        address: null,
        citizenCard: null,
        phone: null,
        isActive: null
    }

    let userId = $routeParams.id;

    function errorCallback(error) {
        console.log(error)
        toastAlert('error', "Máy chủ không tồn tại !");
    }

    /**
     * @message Check duplicate email
     */
    $scope.checkDuplicateEmail = function () {
        AuthService.checkExistEmail($scope.admin.email).then(function successCallback(response) {
            $scope.emailError = response.data.exists;
        });
    };

    /**
     * @message Check duplicate phone
     */
    $scope.checkDuplicatePhone = function () {
        AuthService.checkExistPhone($scope.admin.phone).then(function successCallback(response) {
            $scope.phoneError = response.data.exists;
        });
    };

    /**
     * @message Chọn role lưu vào mảng selectedRoles
     */
    $scope.toggleRole = function (role) {
        var index = $scope.selectedRoles.indexOf(role);

        if (index === -1) {
            $scope.selectedRoles.push(role);
        } else {
            $scope.selectedRoles.splice(index, 1);
        }
    };

    /**
     * Gọi api show dữ liệu lên bảng
     */
    $scope.init = function () {
        AccountServiceAD.findAllAccountStaff().then(function successCallback(response) {
            if (response.status === 200) {
                $scope.listAccountStaff = response.data;
            }
        }, errorCallback);

        AccountServiceAD.findAllAccountAgent().then(function successCallback(response) {
            if (response.status === 200) {
                $scope.listAccountAgent = response.data;
            }
        }, errorCallback);

        if (userId !== undefined && userId !== null && userId !== "") {
            AccountServiceAD.findById(userId).then(function successCallback(response) {
                if (response.status === 200) {
                    $scope.admin = response.data;
                }
            }, errorCallback);
        }
    }

    /**
     * Gọi api tạo mới account
     */
    $scope.createAccountStaff = function () {
        let dataAccount = {
            accountDto: $scope.admin, roles: $scope.selectedRoles
        }
        AccountServiceAD.create(dataAccount).then(function successCallback() {
            toastAlert('success', 'Thêm mới thành công !');
            $location.path('/admin/account-management');
        }, errorCallback);
    }

    /**
     * Gọi api cập nhật account
     */
    function confirmUpdate() {
        AccountServiceAD.update($scope.admin).then(function successCallback() {
            toastAlert('success', 'Cập nhật thành công !');
            $location.path('/admin/account-management');
        }, errorCallback);
    }

    $scope.updateAccountStaff = function () {
        confirmAlert('Bạn có chắc chắn muốn cập nhật không ?', confirmUpdate);
    }

    /**
     * Gọi api delete account
     */
    $scope.deleteAccountStaff = function (userId, fullName) {
        function confirmDelete() {
            AccountServiceAD.delete(userId).then(function successCallback() {
                toastAlert('success', 'Xóa tài khoản thành công !');
                $location.path('/admin/account-management');
                $scope.init();
            }, errorCallback);
        }

        confirmAlert('Bạn có chắc chắn muốn xóa nhân viên ' + fullName + ' không ?', confirmDelete);
    }

    $scope.init();
});