travel_app.controller('RegisterTransControllerAG', function ($scope, $http) {
    $scope.showNextForm = false;
    $scope.showThirdForm = false;
    $scope.checkboxChecked = false;

    $scope.provinces = [];
    $scope.districts = [];
    $scope.wards = [];

    $scope.agent = {
        name: null,
        fname: null,
        mst: null,
        phone: null,
        provinceName: null,
        districtName: null,
        wardName: null,
        address: null,
        business_license: null,
        name_agent: null,
        business_images: null
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
    });

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
     * Upload hình ảnh và lưu vào biến business_images
     * @param file
     */
    $scope.uploadBusinessImage = function (file) {
        if (file && !file.$error) {
            $scope.agent.business_images = file;
        }
    };

    /**
     * Upload hình ảnh và lưu vào biến business_license
     * @param file
     */
    $scope.uploadBusinessLicense = function (file) {
        if (file && !file.$error) {
            $scope.agent.business_license = file;
        }
    };

    /**
     * Submit gửi dữ liệu cho api
     */
    $scope.submitDataRegisterTrans = function () {
        console.log($scope.agent)
        // var formData = new FormData();
        // formData.append("demoDTO", new Blob([JSON.stringify($scope.agent)], {type: "application/json"}));
        // formData.append("business_license", $scope.agent.business_license);
        // formData.append("business_images", $scope.agent.business_images);
        //
        // $http({
        //     method: 'POST',
        //     url: 'http://localhost:8080/api/v1/demo/demo-upload-file',
        //     headers: {'Content-Type': undefined},
        //     data: formData,
        //     transformRequest: angular.identity
        // }).then(function successCallback(response) {
        //     console.log(response.data);
        // });
    };
});
