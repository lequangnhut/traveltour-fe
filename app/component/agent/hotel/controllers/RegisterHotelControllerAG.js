travel_app.controller("RegisterHotelControllerAG", function ($scope, $http, $location, HotelServiceAG) {
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

    $scope.address = {
        province: null,
        district: null,
        ward: null
    }

    $scope.hotels = {
        nameBusiness: null,
        representative: null,
        taxCode: null,
        phoneNumber: null,
        website: null,
        province: null,
        district: null,
        ward: null,
        address: null,
        floors: null,
        avatarHotel: null,
        document: null,
        note: null
    };

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
                $scope.hotels.province = selectedProvince.Name;
            }

            $scope.districts = selectedProvince ? selectedProvince.Districts : [];
            $scope.hotels.district = null;
            $scope.hotels.ward = null;
        };

        $scope.onDistrictChange = function () {
            var selectedDistrict = $scope.districts.find(d => d.Id === $scope.address.district);
            if (selectedDistrict) {
                $scope.hotels.district = selectedDistrict.Name;
            }

            $scope.wards = selectedDistrict ? selectedDistrict.Wards : [];
            $scope.hotels.ward = null;
        };

        $scope.onWardChange = function () {
            var selectedWard = $scope.wards.find(w => w.Id === $scope.address.ward);
            if (selectedWard) {
                $scope.hotels.ward = selectedWard.Name;
            }
        };

        /**
         * Danh sách loại phòng
         */
        HotelServiceAG.getListHotelType().then(function (response) {
            try {
                if (response.status === 404) {
                    // Xử lý khi không tìm thấy
                } else if (response.status === 200) {
                    $scope.hotelTypes = response.data.data;
                } else {
                    // Xử lý trường hợp khác
                }
            } catch (e) {
                // Xử lý exception nếu cần
            }
        });

        /**
         * Danh sách loại giường
         */
        HotelServiceAG.findListBedType().then(function (response) {
            try {
                if (response.status === 404) {
                    // Xử lý khi không tìm thấy
                } else if (response.status === 200) {
                    $scope.bedTypes = response.data.data;
                } else {
                    // Xử lý trường hợp khác
                }
            } catch (e) {
                // Xử lý exception nếu cần
            }
        });

        /**
         * Danh sách các checkbox vị trí tiện ích phòng
         */
        HotelServiceAG.getListRoomUtilities().then(function (response) {
            try {
                if (response.status === 404) {
                    // Xử lý khi không tìm thấy
                } else if (response.status === 200) {
                    $scope.checkBoxRoomUtil = response.data.data.map(function (item) {
                        return {id: item.id, label: item.roomUtilitiesName, checked: false};
                    });
                } else {
                    // Xử lý trường hợp khác
                }
            } catch (e) {
                // Xử lý exception nếu cần
            }
        });

        /**
         * Danh sách các checkbox vị trí tiện ích khách sạn
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

            if ($scope.hotels.avatarHotel && $scope.hotels.avatarHotel.length > maxImages) {
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

            if ($scope.hotels.document && $scope.hotels.document.length > maxImages) {
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

        const dataTrans = new FormData();
        dataTrans.append("transportDto", new Blob([JSON.stringify($scope.hotels)], {type: "application/json"}));
        dataTrans.append("transportImg", $scope.hotels.transportationBrandImg);

        HotelServiceAG.registerHotels(dataTrans).then(function () {
            $location.path('/business/select-type');
            centerAlert('Thành công !', 'Thông tin khách sạn đã được cập nhật thành công.', 'success')
        }, errorCallback).finally(function () {
            $scope.isLoading = false;
        });
    };

    $scope.init();
})