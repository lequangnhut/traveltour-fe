travel_app.controller('RegisterTransControllerAG', function ($scope, $http, $location, AgenciesServiceAG, TransportServiceAG, AuthService) {
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

    function errorCallback(error) {
        console.log(error)
        toastAlert('error', "Máy chủ không tồn tại !");
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
        $scope.isLoading = true;

        const dataTrans = new FormData();
        dataTrans.append("transportDto", new Blob([JSON.stringify($scope.agent)], {type: "application/json"}));
        dataTrans.append("transportImg", $scope.agent.transportationBrandImg);

        TransportServiceAG.registerTransport(dataTrans).then(function successCallback() {
            $location.path('/business/select-type');
            centerAlert('Thành công !', 'Thông tin phương tiện đã được cập nhật thành công.', 'success')
        }, errorCallback).finally(function () {
            $scope.isLoading = false;
        });
    };

    $scope.init();
});
