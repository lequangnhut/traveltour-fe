travel_app.controller('RegisterTransControllerAG', function ($scope, $http, $routeParams, $location, AgenciesServiceAG, TransportBrandServiceAG, AuthService) {
    let brandId = $routeParams.id;

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

    $scope.transportBrand = {
        id: null,
        agenciesId: null,
        transportationBrandName: null,
        transportationBrandPolicy: null,
        transportationBrandImg: null
    }

    $scope.init = function () {
        let user = $scope.user;

        if (user !== undefined && user !== null && user !== "") {
            AgenciesServiceAG.findByUserId(user.id).then(function successCallback(response) {
                $scope.agencies = response.data;
            }, errorCallback);
        }

        if (brandId !== undefined && brandId !== null && brandId !== "") {
            TransportBrandServiceAG.findByTransportBrandId(brandId).then(function successCallback(response) {
                if (response.status === 200) {
                    $scope.transportBrand = response.data.data;
                } else {
                    $location.path('/admin/page-not-found')
                }
            }, errorCallback);
        }
    }

    /**
     * Upload hình ảnh và lưu vào biến transportationBrandImg
     * @param file
     */
    $scope.uploadTransportBrandImg = function (file) {
        if (file && !file.$error) {
            $scope.transportBrand.transportationBrandImg = file;
        }
    };

    /**
     * Submit gửi dữ liệu cho api
     */
    $scope.submitDataRegisterTrans = function () {
        TransportBrandServiceAG.findAllByAgencyId($scope.agencies.id).then(function successCallback(response) {
            let transportBrand = response.data;

            if (transportBrand.length === 1) {
                let existingTrans = transportBrand[0];

                if (existingTrans.transportationBrandName == null) {
                    $scope.submitDataAPITransport('register', 'select-type');
                } else {
                    $scope.submitDataAPITransport('create', 'transport/home');
                }
            } else {
                $scope.submitDataAPITransport('create', 'transport/home');
            }
        }, errorCallback);
    };

    $scope.submitDataAPITransport = function (apiUrl, urlRedirect) {
        $scope.isLoading = true;
        $scope.transportBrand.agenciesId = $scope.agencies.id;

        const dataTrans = new FormData();
        dataTrans.append("transportDto", new Blob([JSON.stringify($scope.transportBrand)], {type: "application/json"}));
        dataTrans.append("transportImg", $scope.transportBrand.transportationBrandImg);

        TransportBrandServiceAG.registerTransport(dataTrans, apiUrl).then(function successCallback() {
            $location.path('/business/' + urlRedirect);
            centerAlert('Thành công !', 'Thông tin phương tiện đã được cập nhật thành công.', 'success');
        }, errorCallback).finally(function () {
            $scope.isLoading = false;
        });
    };

    /**
     * Gọi api để cập nhật transport brand
     */
    $scope.updateTransport = function () {
        function confirmUpdate() {
            $scope.isLoading = true;

            const dataTrans = new FormData();
            dataTrans.append("transportDto", new Blob([JSON.stringify($scope.transportBrand)], {type: "application/json"}));
            dataTrans.append("transportImg", $scope.transportBrand.transportationBrandImg);

            TransportBrandServiceAG.update(dataTrans).then(function successCallback() {
                $location.path('/business/transport/home');
                centerAlert('Thành công !', 'Thông tin phương tiện đã được cập nhật thành công.', 'success');
            }, errorCallback).finally(function () {
                $scope.isLoading = false;
            });
        }

        confirmAlert('Bạn có chắc chắn muốn cập nhật không ?', confirmUpdate);
    }

    $scope.deleteTransport = function () {
        function confirmDelete() {
            $scope.isLoading = true;

            TransportBrandServiceAG.delete(brandId).then(function successCallback() {
                $location.path('/business/transport/home');
                centerAlert('Thành công !', 'Xóa thông tin nhà xe thành công.', 'success');
            }, errorCallback).finally(function () {
                $scope.isLoading = false;
            });
        }

        confirmAlert('Bạn có chắc chắn muốn xóa không ?', confirmDelete);
    }

    $scope.init();
});
