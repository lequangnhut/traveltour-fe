travel_app.controller('RegisterVisitsControllerAG', function ($scope, $http) {
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
        province: null,
        districts: null,
        ward: null,
        address: null,
        business_license: null,
        name_agent: null,
        timeOpen: null,
        timeClose: null,
        agency_status:null,
        freeTicket: null,
        website: null,
        adultTicket: null,
        childTicket: null,
        locationType: null,
        time_open_agent: null,
        time_close_agent: null,
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

    $scope.goToFourthSection = function () {
        $scope.showFourthForm = true;
    };

    $scope.goPreviousSectionOne = function () {
        $scope.showNextForm = false;
        $scope.showThirdForm = false;
        $scope.showFourthForm = false;
    };

    $scope.goPreviousSectionTwo = function () {
        $scope.showThirdForm = false;
        $scope.showFourthForm = false;
    };

    $scope.goPreviousSectionThree = function () {
        $scope.showFourthForm = false;
    };


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
    $scope.submitDataRegisterVisits = function () {
        console.log($scope.agent)
    };

    $scope.submitDataCreateVisits = function () {
        console.log($scope.agent)
    };

});
