travel_app.controller("RegisterHotelControllerAG", function ($scope, $http, $location, AuthService, HotelServiceAG, AgenciesServiceAG) {
    $scope.currentStep = 1;
    $scope.phoneError = null;
    $scope.checkboxChecked = false;

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

    function errorCallback() {
        $location.path('/admin/internal-server-error')
    }

    $scope.address = {
        province: null, district: null, ward: null
    }

    $scope.hotels = {
        hotelName: null,
        urlWebsite: null,
        phone: null,
        amountRoom: null,
        floorNumber: null,
        province: null,
        district: null,
        ward: null,
        address: null,
        hotelAvatar: null,
        hotelTypeId: null,
        avatarHotel: null,
        agenciesId: null
    };

    $scope.rooms = {
        roomTypeName: null,
        roomTypeAvatar: null,
        hotelId: null,
        capacityAdults: null,
        capacityChildren: null,
        amountRoom: null,
        price: null,
        roomTypeDescription: null,
        roomTypeImage: null
    }


    $scope.init = function () {
        let user = $scope.user;

        if (user !== undefined && user !== null && user !== "") {
            AgenciesServiceAG.findByUserId(user.id).then(function successCallback(response) {
                let agencyId = $scope.hotels.agenciesId = response.data.id;

                HotelServiceAG.findByAgencyId(agencyId).then(function successCallback(response) {
                    $scope.hotels = response.data;
                }, errorCallback);
            }, errorCallback);
        }

        /**
         * @message Check duplicate phone
         */
        $scope.checkDuplicatePhone = function () {
            AuthService.checkExistPhone($scope.hotels.phone).then(function successCallback(response) {
                $scope.phoneError = response.data.exists;
            }, errorCallback);
        };
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
         * Danh sách các checkbox vị trí tiện ích khách sạn
         * @type {[{checked: boolean, id: string, label: string},{checked: boolean, id: string, label: string}]}
         */
        HotelServiceAG.getListPlaceUtilities().then(function (response) {
            try {
                if (response.status === 404) {
                    // Xử lý khi không tìm thấy
                } else if (response.status === 200) {
                    $scope.placeUtilitiesList = response.data.data.map(function (item) {
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
         * Danh sách các checkbox vị trí tiện ích phòng
         */
        HotelServiceAG.getListRoomUtilities().then(function (response) {
            try {
                if (response.status === 404) {
                    // Xử lý khi không tìm thấy
                } else if (response.status === 200) {
                    $scope.roomUtilitiesList = response.data.data.map(function (item) {
                        return {id: item.id, label: item.roomUtilitiesName, checked: false};
                    });
                } else {
                    // Xử lý trường hợp khác
                }
            } catch (e) {
                // Xử lý exception nếu cần
            }
        });

        $scope.updatePlaceUtilities = function () {
            $scope.selectedPlaceUtilitiesIds = [];

            angular.forEach($scope.placeUtilitiesList, function (placeUtilities) {
                if (placeUtilities.isSelected) {
                    $scope.selectedPlaceUtilitiesIds.push(placeUtilities.id);
                }
            });
            $scope.placeUtilitiesCheck = $scope.selectedPlaceUtilitiesIds.length > 0 ? 1 : 0;
        };

        $scope.updateRoomUtilities = function () {
            $scope.selectedRoomUtilitiesIds = [];

            angular.forEach($scope.roomUtilitiesList, function (roomUtilities) {
                if (roomUtilities.isSelected) {
                    $scope.selectedRoomUtilitiesIds.push(roomUtilities.id);
                }
            });
            $scope.roomUtilitiesCheck = $scope.selectedRoomUtilitiesIds.length > 0 ? 1 : 0;
        };

        /**
         * Upload hình ảnh và lưu vào biến hotelAvatar
         * @param file
         */
        $scope.uploadAvatarImages = function (file) {
            if (file && !file.$error) {
                $scope.hotels.hotelAvatar = file;
            }
        };

        /**
         * Bắt lỗi ảnh phòng khách sạn
         */
        $scope.uploadRoomTypeImages = function (files) {
            const maxImages = 30;

            if (!$scope.rooms.roomTypeImage) {
                $scope.rooms.roomTypeImage = [];
            }

            if ($scope.rooms.roomTypeImage.length + files.length >= maxImages) {
                centerAlert('Không hợp lệ', "Bạn chỉ có thể chọn tối đa " + maxImages + " hình ảnh.", 'warning');
                $scope.rooms.roomTypeImage.clear();
                return;
            }

            angular.forEach(files, function (file) {
                if (file && !file.$error) {
                    $scope.rooms.roomTypeImage.push(file);
                }
            });
        };

        /**
         * Upload hình ảnh và lưu vào biến roomTypeAvatar
         * @param file
         */
        $scope.uploadAvatarRooms = function (file) {
            if (file && !file.$error) {
                $scope.rooms.roomTypeAvatar = file;
            }
        };
    }

    /**
     * Submit dữ liệu gửi lên api
     */
    $scope.submitRegisterHotel = function () {
        $scope.isLoading = true;
        const formData = new FormData();

        const dataHotelRoom = {
            hotelsDto: $scope.hotels,
            roomTypesDto: $scope.rooms,
            selectedPlaceUtilitiesIds: $scope.selectedPlaceUtilitiesIds,
            selectedRoomUtilitiesIds: $scope.selectedRoomUtilitiesIds,
        }

        formData.append('dataHotelRoom', new Blob([JSON.stringify(dataHotelRoom)], {type: 'application/json'}));
        angular.forEach($scope.rooms.roomTypeImage, function (file) {
            formData.append('roomTypeImage', file);
        });
        formData.append('hotelAvatar', $scope.hotels.hotelAvatar);
        formData.append('roomTypeAvatar', $scope.rooms.roomTypeAvatar);

        HotelServiceAG.registerHotels(formData).then(function () {
            centerAlert('Thành công !', 'Thông tin khách sạn đã được cập nhật thành công.', 'success');
            $location.path('/business/select-type');
        }, errorCallback).finally(function () {
            $scope.isLoading = false;
        });
    };

    $scope.init();
})