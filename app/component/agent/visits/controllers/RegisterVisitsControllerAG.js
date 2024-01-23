travel_app.controller('RegisterVisitsControllerAG', function ($scope, $http, $filter, $location, AuthService, VisitLocationServiceAG, AgenciesServiceAG) {
    $scope.currentStep = 1;
    $scope.checkboxChecked = false;
    $scope.phoneError = null;

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
        $location.path('/admin/internal-server-error')
    }

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
        closingTime: null,
        agenciesId: null
    }

    $scope.init = function () {
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
        VisitLocationServiceAG.findAllByAgencyId($scope.agencies.id).then(function successCallback(response) {
            let locationVisit = response.data;

            if (locationVisit.length === 1) {
                let existingVisit = locationVisit[0];

                if (existingVisit.visitLocationName == null) {
                    $scope.submitAPIVisit('register');
                } else {
                    $scope.submitAPIVisit('create');
                }
            } else {
                $scope.submitAPIVisit('create');
            }
        }, errorCallback);
    }

    $scope.submitAPIVisit = function (apiUrl) {
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
        $scope.agent.agenciesId = $scope.agencies.id;

        const dataVisit = new FormData();
        dataVisit.append("visitLocationsDto", new Blob([JSON.stringify($scope.agent)], {type: "application/json"}));
        dataVisit.append("visitLocationImage", $scope.agent.visitLocationImage);
        dataVisit.append("selectedTickets", new Blob([JSON.stringify(selectedTickets)], {type: "application/json"}));
        dataVisit.append("unitPrices", new Blob([JSON.stringify(unitPrices)], {type: "application/json"}));

        VisitLocationServiceAG.registerVisit(dataVisit, apiUrl).then(function successCallback() {
            $location.path('/business/select-type');
            centerAlert('Thành công !', 'Thông tin địa điểm tham quan đã được cập nhật thành công.', 'success')
        }, errorCallback).finally(function () {
            $scope.isLoading = false;
        });
    };

    $scope.init();
});
