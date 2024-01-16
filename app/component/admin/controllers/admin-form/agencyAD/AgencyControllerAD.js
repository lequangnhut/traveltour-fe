travel_app.controller('AgencyControllerAD', function ($scope, $http) {

    $scope.provinces = [];
    $scope.districts = [];
    $scope.wards = [];

    $scope.agent = {
        agencyname: null,
        mentor: null,
        taxid: null,
        phoneNumber: null,
        website: null,
        province: null,
        districts: null,
        ward: null,
        address: null,
        business_license: null,
        agencystatus: null
    }

    /**
     * API lấy dữ liệu tỉnh thành và fill dữ liệu lên select
     */
    $http.get('/lib/address/data.json').then(function (response) {
        $scope.provinces = response.data;
    });

    $scope.onProvinceChange = function () {
        $scope.districts = $scope.provinces.find(p => p.Id === $scope.agent.province).Districts;
        $scope.agent.districts = null;
        $scope.agent.ward = null;
    };

    $scope.onDistrictChange = function () {
        $scope.wards = $scope.districts.find(d => d.Id === $scope.agent.districts).Wards;
        $scope.agent.ward = null;
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
    $scope.submitAdminAgencyEdit = function () {
        console.log($scope.agent)
    };

    $scope.submitAdminAgencyAdd = function () {
        console.log($scope.agent)
    };
});