travel_app.controller("HotelInformationEdit", function ($scope, $http, $timeout, $location, $routeParams, HotelServiceAG, PlaceUtilitiesService, HotelTypeService, AgenciesServiceAG) {

    $scope.hotelEdit = {
        id: null,
        hotelName: null,
        urlWebsite: null,
        phone: null,
        floorNumber: null,
        province: null,
        district: null,
        ward: null,
        address: null,
        hotelAvatar: null,
        hotelTypeId: null,
        agenciesId: null,
        placeUtilities: [],
        hotelAvatarUpdated: null,
    };

    $scope.selectedUtilitieses = []
    $scope.hasImage = false;
    $scope.location = {}
    $scope.placeUtilitieses = [];
    $scope.hotelTypes = null
    $scope.provinces = [];
    $scope.districts = [];
    $scope.wards = [];

    var hotelId = $routeParams.id;

    $scope.init();

    function errorCallback(error) {
        console.log(error)
        toastAlert('error', "Máy chủ không tồn tại !");
    }


    /**
     * Phương thức lây khách thông tin khách sạn dựa vào id trên đường dẫn
     */
    HotelServiceAG.getHotelByIdHotels(hotelId).then(function (response) {
        $timeout(function () {
            if (response.data.status === '200') {

                $scope.hotelEdit = response.data.data
                console.log($scope.hotelEdit)

                let selectedProvince = $scope.provinces.find(p => p.Name === $scope.hotelEdit.province);
                if (selectedProvince) {
                    $scope.hotelEdit.province = selectedProvince.Name;
                    $scope.districts = selectedProvince ? selectedProvince.Districts : [];
                    let selectedDistrict = $scope.districts.find(d => d.Name === $scope.hotelEdit.district);
                    if (selectedDistrict) {
                        $scope.hotelEdit.district = selectedDistrict.Name;
                    }
                    $scope.wards = selectedDistrict ? selectedDistrict.Wards : [];
                }
            }
        }, 200)

    }, errorCallback).finally(function () {

    });

    /**
     * Danh sách các tiện ích khách sạn
     */
    PlaceUtilitiesService.getListPlaceUtilities().then(function (response) {
        $timeout(function () {
            try {
                if (response.status === 404) {
                    $scope.showErrorListPlaceMessage = "Không tìm thấy dữ liệu, vui lòng thử lại";
                } else if (response.status === 200) {
                    $scope.placeUtilitieses = response.data.data.map(function (item) {

                        var ids = $scope.hotelEdit.placeUtilities.map(function (item) {
                            return item.id;
                        });
                        var checked = ids &&
                            ids.indexOf(item.id) !== -1;

                        console.log(ids)
                        return {id: item.id, label: item.placeUtilitiesName, checked: checked};
                    });

                } else {
                    $scope.showErrorListPlaceMessage = "Không tìm thấy dữ liệu, vui lòng thử lại";
                }
            } catch (e) {
                $scope.showErrorListPlaceMessage = "Không tìm thấy dữ liệu, vui lòng thử lại";
            }
        }, 400)
    });


    /**
     * Phương thức so sánh placeUtilities với danh sách selectPlaceUtilities
     * @param placeUtilities
     * @param selectedPlaceUtils
     * @returns {*}
     */
    $scope.comparePlaceUtilities = function (placeUtilities, selectedPlaceUtils) {
        return selectedPlaceUtils.some(function (selectedPlaceUtil) {
            return selectedPlaceUtil.id === placeUtilities.id && selectedPlaceUtil.isChecked;
        });
    };


    $scope.selectHotelType = function () {
        // Logic khi chọn loại khách sạn
        console.log("Selected hotel type: ", $scope.hotelEdit.hotelType);
    };

    /**
     * Lấy danh sách danh sách loại phòng
     */
    HotelTypeService.getListHotelType().then(function (response) {
        if (response.data.status === '200') {
            $scope.hotelTypes = response.data.data;
        }
    });

    /**
     * API lấy dữ liệu địa chỉ trong file data.json
     */
    $http.get('/lib/address/data.json').then(function (response) {
        $scope.provinces = response.data;
    });

    $scope.init = function () {
        $scope.isLoading = true;

        try{

            /**
             * lấy thông tin cho thông tin tỉnh thành
             * */

            $scope.onProvinceChange = function () {
                var selectedProvince = $scope.provinces.find(p => p.Name === $scope.hotelEdit.province);
                if (selectedProvince) {
                    $scope.hotelEdit.provinceName = selectedProvince.Name;
                }

                $scope.districts = selectedProvince ? selectedProvince.Districts : [];
                $scope.hotelEdit.district = null;
                $scope.hotelEdit.ward = null;

            };

            /**
             * Lấy thông tin huyện nếu tỉnh đã được chọn
             */
            $scope.onDistrictChange = function () {
                var selectedDistrict = $scope.districts.find(d => d.Name === $scope.hotelEdit.district);
                if (selectedDistrict) {
                    $scope.hotelEdit.districtName = selectedDistrict.Name;
                }

                $scope.wards = selectedDistrict ? selectedDistrict.Wards : [];
                $scope.hotelEdit.ward = null;
                $scope.hotelEdit.wardName = null;
            };

            /**
             * Lấy dữ liệu của xã nếu huyện đã được chọn
             */
            $scope.onWardChange = function () {
                var selectedWard = $scope.wards.find(w => w.Name === $scope.hotelEdit.ward);
                if (selectedWard) {
                    $scope.hotelEdit.wardName = selectedWard.Name;
                }
            };
        }catch (e) {
            console.error("Error")
        } finally {
            $scope.isLoading = false;
        }

    }

    /**
     * Băt lỗi hình ảnh đại diện khách sạn
     */
    $scope.validateAvataHotel = function () {
        var maxImages = 1;

        if ($scope.hotelEdit.avatarHotel && $scope.hotelEdit.avatarHotel.length > maxImages) {
            $scope.register_hotelEdit.avataHotel.$setValidity('maxImages', false);
        } else {
            $scope.register_hotelEdit.avataHotel.$setValidity('maxImages', true);
        }
    };

    $scope.uploadTourImage = function (file) {
        if (file && !file.$error) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $scope.hotelEdit.hotelAvatar = e.target.result;
                $scope.tourImgNoCloud = file;
                $scope.hasImage = true;
                $scope.$apply();
            };

            reader.readAsDataURL(file);
        }
    };


    $scope.getCurrentImageSource = function () {
        if ($scope.hotelEdit.hotelAvatar && typeof $scope.hotelEdit.hotelAvatar === 'string' && $scope.hotelEdit.hotelAvatar.startsWith('http')) {
            return $scope.hotelEdit.hotelAvatar;
        } else if ($scope.hotelEdit.hotelAvatar && typeof $scope.hotelEdit.hotelAvatar === 'string') {
            // If hotelAvatar is a data URL
            return $scope.hotelEdit.hotelAvatar;
        }
    };

    $scope.updateSelectedUtilities = function (placeUtilities) {
        $scope.hotelEdit.placeUtilities.forEach(function (item) {
            if (!placeUtilities.checked) {
                // Nếu bỏ chọn, loại bỏ khỏi mảng
                var index = $scope.selectedUtilitieses.findIndex(function (item) {
                    return item.id === placeUtilities.id;
                });

                if (index !== -1) {
                    $scope.selectedUtilitieses.splice(index, 1);
                }
            }
        });
    }

    $scope.noPlaceUtilitiesSelected = function () {
        // Kiểm tra xem có tiện ích nào được chọn không
        return !$scope.placeUtilitieses.some(function (placeUtilities) {
            return placeUtilities.checked;
        });
    };


    let user = $scope.user;
    $scope.updateHotel = function () {
        $scope.isLoading = true;

        $scope.dataHotel = {
            id: $scope.hotelEdit.id,
            hotelName: $scope.hotelEdit.hotelName,
            urlWebsite: $scope.hotelEdit.urlWebsite,
            phone: $scope.hotelEdit.phone,
            floorNumber: $scope.hotelEdit.floorNumber,
            province: $scope.hotelEdit.province,
            district: $scope.hotelEdit.district,
            ward: $scope.hotelEdit.ward,
            address: $scope.hotelEdit.address,
            hotelTypeId: $scope.hotelEdit.hotelTypeId,
            agenciesId: $scope.hotelEdit.agenciesId,
        }

        $scope.placeUtilitieses.forEach(function (item) {
            var isIdExists = $scope.selectedUtilitieses.some(function (selectedItem) {
                return selectedItem.id === item.id;
            });

            if (!isIdExists && item.checked === true) {
                $scope.selectedUtilitieses.push({id: item.id});
            }
        });

        if (user !== undefined && user !== null && user !== "") {
            AgenciesServiceAG.findByUserId(user.id).then(function successCallback(response) {
                $scope.hotelEdit.agencyId = response.data.id;

                console.log($scope.dataHotel)
                console.log($scope.selectedUtilitieses)
                console.log($scope.hotelEdit.hotelAvatarUpdated)

                // Chuyển đổi object thành mảng số nguyên
                var selectedUtilitiesArray = Object.values($scope.selectedUtilitieses);
                var selectedUtilitiesIds = selectedUtilitiesArray.map(function (utility) {
                    return utility.id;
                });

                HotelServiceAG.updateHotel($scope.dataHotel, selectedUtilitiesIds, $scope.hotelEdit.hotelAvatarUpdated)
                    .then(function successCallback(response) {
                        if (response.status === 200) {
                            $location.path('/business/hotel/home');
                            centerAlert('Thành công !', 'Thông tin khách sạn đã thêm thành công.', 'success')
                        } else if (response.status === 500) {
                            toastAlert('error', response.message);
                        }
                    }, errorCallback).finally(function () {
                    $scope.isLoading = false;
                });
            }, errorCallback).finally(function () {
            });
        }
    };
})