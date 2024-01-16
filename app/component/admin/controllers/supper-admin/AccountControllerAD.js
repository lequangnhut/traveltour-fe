travel_app.controller('AccountControllerAD', function ($scope, AccountServiceAD) {
    $scope.admin = {
        email: null,
        password: null,
        cpsw: null,
        full_name: null,
        phone: null,
        active: null
    }

    function errorCallback() {
        toastAlert('error', "Máy chủ không tồn tại !");
    }

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
    }

    $scope.init();
});