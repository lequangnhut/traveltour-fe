travel_app.controller('RegisterBusinessControllerAG', function ($scope, $http, $location, AuthService, AgenciesServiceAG) {
    let user = $scope.user;

    $scope.phoneError = null;
    $scope.checkboxChecked = false;
    $scope.currentStep = 1;

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

    $scope.address = {
        province: null,
        district: null,
        ward: null,
    }

    $scope.agent = {
        id: null,
        nameAgency: null,
        representativeName: null,
        taxId: null,
        urlWebsite: null,
        phone: null,
        province: null,
        district: null,
        ward: null,
        address: null,
        imgDocument: null,
    }

    function errorCallback(error) {
        $location.path('/admin/internal-server-error')
    }

    $scope.init = function () {
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

        /**
         * @message API tìm doanh nghiệp bằng userId
         */
        if (user !== undefined && user !== null && user !== "") {
            AgenciesServiceAG.findByUserId(user.id).then(function successCallback(response) {
                $scope.agent = response.data;
            }, errorCallback);
        }
    }

    /**
     * Upload hình ảnh và lưu vào biến imgDocument
     * @param file
     */
    $scope.uploadImgDocument = function (file) {
        if (file && !file.$error) {
            $scope.agent.imgDocument = file;
        }
    };

    $scope.registerBusiness = function () {
        $scope.isLoading = true;

        const dataAgencies = new FormData();
        dataAgencies.append("agenciesDto", new Blob([JSON.stringify($scope.agent)], {type: "application/json"}));
        dataAgencies.append("imgDocument", $scope.agent.imgDocument);

        AgenciesServiceAG.registerBusiness(dataAgencies).then(function successCallback() {
            $location.path('/business/register-business-success');
        }, errorCallback).finally(function () {
            $scope.isLoading = false;
        });
    }

    $scope.init();
})