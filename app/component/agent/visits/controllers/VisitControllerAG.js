travel_app.controller('VisitControllerAG', function ($scope, $http) {

    $scope.provinces = [];
    $scope.districts = [];
    $scope.wards = [];

    $scope.agent = {
        name: null,
        phone: null,
        provinceName: null,
        districtName: null,
        wardName: null,
        address: null,
        adultTicket: null,
        childTicket: null,
        locationType: null,
        time_open_agent: null,
        time_close_agent: null,
        business_images: null,
        locationTypeUpdate: null,
        agency_status: null,
        locationName: null,
        citizen: null,
        email: null,
        munberAdultTicket: null,
        munberChildTicket: null
    }

    $scope.validateCheckbox = function () {
        return $scope.checkboxChecked;
    };

    /**
     * API lấy dữ liệu tỉnh thành và fill dữ liệu lên select
     */

    $http.get('/lib/address/data.json').then(function (response) {
        $scope.provinces = response.data;
    });

    /**
     * lấy thông tin cho tạo mới
     * */
    $scope.onProvinceChange = function () {
        $scope.districts = $scope.provinces.find(p => p.Id === $scope.agent.provinceName).Districts;
        $scope.agent.districtName = null;
        $scope.agent.wardName = null;
    };

    $scope.onDistrictChange = function () {
        $scope.wards = $scope.districts.find(d => d.Id === $scope.agent.districtName).Wards;
        $scope.agent.wardName = null;
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
    $scope.submitDataCreateVisits = function () {
        console.log($scope.agent)
    };

    $scope.submitDataUpdateVisits = function () {
        console.log($scope.agent)
    };
    $scope.submitDataCreateBookingVisits = function () {
        console.log($scope.agent)
    };
});