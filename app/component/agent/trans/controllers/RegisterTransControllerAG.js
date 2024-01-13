travel_app.controller('RegisterTransControllerAG', function ($scope) {
    $scope.showNextForm = false;
    $scope.showThirdForm = false;
    $scope.checkboxChecked = false;

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
     * Submit gửi dữ liệu cho api
     */
    $scope.submitDataRegisterTrans = function () {
        console.log($scope.agent)
    };
});
