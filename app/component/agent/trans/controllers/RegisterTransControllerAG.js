travel_app.controller('RegisterTransControllerAG', function ($scope, $http, $location, AgenciesServiceAG, TransportBrandServiceAG, AuthService) {
    $scope.currentStep = 1;
    $scope.showNextForm = false;
    $scope.showThirdForm = false;
    $scope.checkboxChecked = false;

    $scope.nextStep = function () {
        if ($scope.currentStep < 4) {
            $scope.currentStep++;
        }
    };

    $scope.prevStep = function () {
        if ($scope.currentStep <= 4) {
            $scope.currentStep--;
        }
    };

    function errorCallback() {
        $location.path('/admin/internal-server-error')
    }

    $scope.agent = {
        transportationBrandName: null,
        transportationBrandDescription: null,
        transportationBrandImg: null
    }

    /**
     * @message Check duplicate phone
     */
    $scope.checkDuplicatePhone = function () {
        AuthService.checkExistPhone($scope.agent.phone).then(function successCallback(response) {
            $scope.phoneError = response.data.exists;
        }, errorCallback);
    };

    $scope.init = function () {
        let user = $scope.user;

        if (user !== undefined && user !== null && user !== "") {
            AgenciesServiceAG.findByUserId(user.id).then(function successCallback(response) {
                $scope.agent = response.data;
            }, errorCallback);
        }
    }

    /**
     * Upload hình ảnh và lưu vào biến transportationBrandImg
     * @param file
     */
    $scope.uploadTransportBrandImg = function (file) {
        if (file && !file.$error) {
            $scope.agent.transportationBrandImg = file;
        }
    };

    /**
     * Submit gửi dữ liệu cho api
     */
    $scope.submitDataRegisterTrans = function () {
        TransportBrandServiceAG.findAllByAgencyId($scope.agent.id).then(function successCallback(response) {
            let transportBrand = response.data;

            if (transportBrand.length === 1) {
                let existingTrans = transportBrand[0];

                if (existingTrans.transportationBrandName == null) {
                    $scope.submitDataAPITransport('register');
                } else {
                    $scope.submitDataAPITransport('create');
                }
            } else {
                $scope.submitDataAPITransport('create');
            }
        }, errorCallback);
    };

    $scope.submitDataAPITransport = function (apiUrl) {
        $scope.isLoading = true;

        const dataTrans = new FormData();
        dataTrans.append("transportDto", new Blob([JSON.stringify($scope.agent)], {type: "application/json"}));
        dataTrans.append("transportImg", $scope.agent.transportationBrandImg);

        TransportBrandServiceAG.registerTransport(dataTrans, apiUrl).then(function successCallback() {
            $location.path('/business/select-type');
            centerAlert('Thành công !', 'Thông tin phương tiện đã được cập nhật thành công.', 'success');
        }, errorCallback).finally(function () {
            $scope.isLoading = false;
        });
    };

    $scope.init();
});
