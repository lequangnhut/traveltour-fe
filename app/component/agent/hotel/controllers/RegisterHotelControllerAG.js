travel_app.controller("RegisterHotelControllerAG", function ($scope, $http, HotelServiceAG) {
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

    function errorCallback(error) {
        console.log(error)
        toastAlert('error', "Máy chủ không tồn tại !");
    }

    $scope.provinces = [];
    $scope.districts = [];
    $scope.wards = [];

    $scope.company = {
        nameBusiness: null,
        representative: null,
        taxCode: null,
        phoneNumber: null,
        website: null,
        province: null,
        district: null,
        ward: null,
        address: null,
        provinceName: null,
        districtName: null,
        wardName: null,
        floors: null,
        avatarHotel: null,
        document: null,
        note: null
    };

    $scope.init = function () {
        /**
         * API lấy dữ liệu địa chỉ trong file data.json
         */
        $http.get('/lib/address/data.json').then(function (response) {
            $scope.provinces = response.data;
        });

        /**
         * lấy thông tin cho thông tin tỉnh thành
         * */
        $scope.onProvinceChange = function () {
            var selectedProvince = $scope.provinces.find(p => p.Id === $scope.company.province);
            if (selectedProvince) {
                $scope.company.provinceName = selectedProvince.Name;
            }

            $scope.districts = selectedProvince ? selectedProvince.Districts : [];
            $scope.company.district = null;
            $scope.company.ward = null;
        };

        /**
         * Lấy thông tin huyện nếu tỉnh đã được chọn
         */
        $scope.onDistrictChange = function () {
            var selectedDistrict = $scope.districts.find(d => d.Id === $scope.company.district);
            if (selectedDistrict) {
                $scope.company.districtName = selectedDistrict.Name;
            }

            $scope.wards = selectedDistrict ? selectedDistrict.Wards : [];
            $scope.company.ward = null;
            $scope.company.wardName = null;
        };

        /**
         * Lấy dữ liệu của xã nếu huyện đã được chọn
         */
        $scope.onWardChange = function () {
            var selectedWard = $scope.wards.find(w => w.Id === $scope.company.ward);
            if (selectedWard) {
                $scope.company.wardName = selectedWard.Name;
            }
        };

        /**
         * Danh sách các checkbox
         * @type {[{checked: boolean, id: string, label: string},{checked: boolean, id: string, label: string}]}
         */
        HotelServiceAG.getListPlaceUtilities().then(function (response) {
            $scope.checkboxes == null;

            try {
                if (response.status === 404) {
                    // Xử lý khi không tìm thấy
                } else if (response.status === 200) {
                    $scope.checkboxes = response.data.data.map(function (item) {
                        return {id: item.id, label: item.placeUtilitiesName, checked: false};
                    });
                } else {
                    // Xử lý trường hợp khác
                }
            } catch (e) {
                // Xử lý exception nếu cần
            }
        });

        /**
         * Băt lỗi hình ảnh đại diện khách sạn
         */
        $scope.validateAvatarHotel = function () {
            var maxImages = 1;

            if ($scope.company.avatarHotel && $scope.company.avatarHotel.length > maxImages) {
                $scope.register_company.avataHotel.$setValidity('maxImages', false);
            } else {
                $scope.register_company.avataHotel.$setValidity('maxImages', true);
            }
        };

        /**
         * Bắt lỗi ảnh giây tờ của khách sạn
         */
        $scope.validateDocumentHotel = function () {
            var maxImages = 50;

            if ($scope.company.document && $scope.company.document.length > maxImages) {
                $scope.register_company.document.$setValidity('maxImages', false);
            } else {
                $scope.register_company.document.$setValidity('maxImages', true);
            }
        };

        $scope.checkboxCount = 0;

        $scope.updateCheckboxCount = function () {
            $scope.checkboxCount = $scope.checkboxes.filter(function (checkbox) {
                return checkbox.checked;
            }).length;
        };
    }

    /**
     * Kiểm tra nếu như chưa lựa chọn dịch vụ thì tắt nút di
     * @returns {*}
     */
    $scope.noCheckboxSelected = function () {
        return $scope.checkboxCount <= 0;
    };

    $scope.submitRegisterHotel = function () {
        $scope.isLoading = true;

        HotelServiceAG.registerHotels().then(function () {

        }, errorCallback).finally(function () {
            $scope.isLoading = false;
        });
    };

    $scope.init();
})