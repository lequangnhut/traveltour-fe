travel_app.controller('RegisterTransControllerAG', function ($scope, $http, $location, AgenciesServiceAG, TransportServiceAG, AuthService) {
    $scope.showNextForm = false;
    $scope.showThirdForm = false;
    $scope.checkboxChecked = false;

    $scope.provinces = [];
    $scope.districts = [];
    $scope.wards = [];

    $scope.phoneError = null;

    $scope.agent = {
        nameAgency: null,
        representativeName: null,
        taxId: null,
        urlWebsite: null,
        phone: null,
        provinceName: null,
        districtName: null,
        wardName: null,
        address: null,
        imgDocument: null,
        transportationBrandName: null,
        transportationBrandImg: null
    }

    function errorCallback(error) {
        console.log(error)
        toastAlert('error', "Máy chủ không tồn tại !");
    }

    $scope.validateCheckbox = function () {
        return $scope.checkboxChecked;
    };

    $scope.goToNextSection = function () {
        $scope.showNextForm = true;
    };

    $scope.goToThirdSection = function () {
        $scope.showThirdForm = true;
    };

    $scope.goPreviousSectionOne = function () {
        $scope.showNextForm = false;
        $scope.showThirdForm = false;
    };

    $scope.goPreviousSectionTwo = function () {
        $scope.showThirdForm = false;
    };

    /**
     * API lấy dữ liệu tỉnh thành và fill dữ liệu lên select
     */
    $http.get('/lib/address/data.json').then(function (response) {
        $scope.provinces = response.data;
    }, errorCallback);

    $scope.onProvinceChange = function () {
        var selectedProvince = $scope.provinces.find(p => p.Id === $scope.agent.province);
        if (selectedProvince) {
            $scope.agent.provinceName = selectedProvince.Name;
        }

        $scope.districts = selectedProvince ? selectedProvince.Districts : [];
        $scope.agent.districts = null;
        $scope.agent.ward = null;
    };

    $scope.onDistrictChange = function () {
        var selectedDistrict = $scope.districts.find(d => d.Id === $scope.agent.districts);
        if (selectedDistrict) {
            $scope.agent.districtName = selectedDistrict.Name;
        }

        $scope.wards = selectedDistrict ? selectedDistrict.Wards : [];
        $scope.agent.ward = null;
        $scope.agent.wardName = null;
    };

    $scope.onWardChange = function () {
        var selectedWard = $scope.wards.find(w => w.Id === $scope.agent.ward);
        if (selectedWard) {
            $scope.agent.wardName = selectedWard.Name;
        }
    };

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
     * Upload hình ảnh và lưu vào biến imgDocument
     * @param file
     */
    $scope.uploadImgDocument = function (file) {
        if (file && !file.$error) {
            $scope.agent.imgDocument = file;
        }
    };

    /**
     * Submit gửi dữ liệu cho api
     */
    $scope.submitDataRegisterTrans = function () {
        const dataTrans = new FormData();
        dataTrans.append("transportDto", new Blob([JSON.stringify($scope.agent)], {type: "application/json"}));
        dataTrans.append("transportationBrandImg", $scope.agent.transportationBrandImg);
        dataTrans.append("imgDocument", $scope.agent.imgDocument);

        TransportServiceAG.registerTransport(dataTrans).then(function successCallback() {
            $location.path('/business/register-transport-success');
        }, errorCallback);
    };

    $scope.init();
});
