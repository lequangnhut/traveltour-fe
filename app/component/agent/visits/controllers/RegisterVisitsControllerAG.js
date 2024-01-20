travel_app.controller('RegisterVisitsControllerAG', function ($scope, $http, $filter, $location, AuthService, VisitLocationServiceAG, AgenciesServiceAG) {
    $scope.showNextForm = false;
    $scope.showThirdForm = false;
    $scope.checkboxChecked = false;

    $scope.phoneError = null;

    $scope.address = {
        province: null,
        district: null,
        ward: null
    }

    $scope.ticketTypes = {
        free: null,
        adult: null,
        child: null
    };

    $scope.unitPrice = {
        adult: null,
        child: null
    }

    $scope.agent = {
        visitLocationName: null,
        visitLocationImage: null,
        visitLocationTypeId: null,
        userId: null,
        urlWebsite: null,
        phone: null,
        province: null,
        district: null,
        ward: null,
        address: null,
        openingTime: null,
        closingTime: null
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
        $scope.showFourthForm = false;
    };

    $scope.goPreviousSectionTwo = function () {
        $scope.showThirdForm = false;
        $scope.showFourthForm = false;
    };

    $scope.init = function () {
        let user = $scope.user;

        if (user !== undefined && user !== null && user !== "") {
            AgenciesServiceAG.findByUserId(user.id).then(function successCallback(response) {
                $scope.agent = response.data;
            }, errorCallback);
        }
        /**
         * API lấy dữ liệu loại địa điểm
         */
        VisitLocationServiceAG.findAllVisitType().then(function successCallback(response) {
            $scope.visitType = response.data;
        }, errorCallback);

        /**
         * API lấy dữ liệu tỉnh thành và fill dữ liệu lên select
         */
        $http.get('/lib/address/data.json').then(function (response) {
            $scope.provinces = response.data;
        }, errorCallback);

        $scope.onProvinceChange = function () {
            var selectedProvince = $scope.provinces.find(p => p.Id === $scope.address.province);
            if (selectedProvince) {
                $scope.agent.province = selectedProvince.Name;
            }

            $scope.districts = selectedProvince ? selectedProvince.Districts : [];
            $scope.agent.district = null;
            $scope.agent.ward = null;
        };

        $scope.onDistrictChange = function () {
            var selectedDistrict = $scope.districts.find(d => d.Id === $scope.address.district);
            if (selectedDistrict) {
                $scope.agent.district = selectedDistrict.Name;
            }

            $scope.wards = selectedDistrict ? selectedDistrict.Wards : [];
            $scope.agent.ward = null;
        };

        $scope.onWardChange = function () {
            var selectedWard = $scope.wards.find(w => w.Id === $scope.address.ward);
            if (selectedWard) {
                $scope.agent.ward = selectedWard.Name;
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
    }

    /**
     * Upload hình ảnh và lưu vào biến visitLocationImage
     * @param file
     */
    $scope.uploadVisitLocationImage = function (file) {
        if (file && !file.$error) {
            $scope.agent.visitLocationImage = file;
        }
    };

    /**
     * Submit gửi dữ liệu cho api
     */
    $scope.unitPrices = [];

    $scope.updatePrices = function (ticketType) {
        if ($scope.ticketTypes[ticketType]) {
            $scope.unitPrices[ticketType] = $scope.unitPrice[ticketType];
        } else {
            delete $scope.unitPrices[ticketType];
        }
    };

    $scope.submitDataRegisterVisits = function () {
        const selectedTickets = [];
        const unitPrices = {};
        $scope.isLoading = true;

        if ($scope.ticketTypes.free) {
            selectedTickets.push("Miễn phí vé");
        }
        if ($scope.ticketTypes.adult) {
            selectedTickets.push("Vé người lớn");
        }
        if ($scope.ticketTypes.child) {
            selectedTickets.push("Vé trẻ em");
        }
        if ($scope.ticketTypes.adult) {
            unitPrices.adult = $scope.unitPrice.adult;
        }
        if ($scope.ticketTypes.child) {
            unitPrices.child = $scope.unitPrice.child;
        }

        $scope.agent.openingTime = $filter('date')($scope.agent.openingTime, 'HH:mm:ss');
        $scope.agent.closingTime = $filter('date')($scope.agent.closingTime, 'HH:mm:ss');

        const dataVisit = new FormData();
        dataVisit.append("visitLocationsDto", new Blob([JSON.stringify($scope.agent)], {type: "application/json"}));
        dataVisit.append("visitLocationImage", $scope.agent.visitLocationImage);
        dataVisit.append("selectedTickets", new Blob([JSON.stringify(selectedTickets)], {type: "application/json"}));
        dataVisit.append("unitPrices", new Blob([JSON.stringify(unitPrices)], {type: "application/json"}));

        VisitLocationServiceAG.registerVisit(dataVisit).then(function successCallback() {
            $location.path('/business/select-type');
            centerAlert('Thành công !', 'Thông tin địa điểm tham quan đã được cập nhật thành công.', 'success')
        }, errorCallback).finally(function () {
            $scope.isLoading = false;
        });
    };

    $scope.init();
});
