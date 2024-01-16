travel_app.controller('RegisterVisitsControllerAG', function ($scope, $http) {
    $scope.showNextForm = false;
    $scope.showThirdForm = false;
    $scope.checkboxChecked = false;

    $scope.provinces = [];
    $scope.districts = [];
    $scope.wards = [];

    $scope.provinceVisits = [];
    $scope.districtVisits = [];
    $scope.wardVisits = [];

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
        agency_status: null,
        freeTicket: null,
        website: null,
        adultTicket: null,
        childTicket: null,
        locationType: null,
        time_open_agent: null,
        time_close_agent: null,
        business_images: null,
        provinceVisit: null,
        districtVisit: null,
        wardVisit: null,
        addressVisit: null
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
        $scope.provinceVisits = response.data;
    });

    /**
     * lấy thông tin cho thông tin doanh nghiệp
     * */
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
       * lấy thông tin cho thông tin địa điểm
     * */
    $scope.onProvinceVisitChange = function () {
        $scope.districtVisits = $scope.provinceVisits.find(p => p.Id === $scope.agent.provinceVisit).Districts;
        $scope.agent.districtVisit = null;
        $scope.agent.wardVisit = null;
    };
    $scope.onDistrictVisitChange = function () {
        $scope.wardVisits = $scope.districtVisits.find(d => d.Id === $scope.agent.districtVisit).Wards;
        $scope.agent.wardVisit = null;
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


});
