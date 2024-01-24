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
    };

    $scope.location = {}

    $scope.hotelTypes = null
    $scope.provinces = [];
    $scope.districts = [];
    $scope.wards = [];

    var hotelId = $routeParams.id;


    function errorCallback(error) {
        console.log(error)
        toastAlert('error', "Máy chủ không tồn tại !");
    }

    /**
     * Phương thức lây khách thông tin khách sạn dựa vào id trên đường dẫn
     */
    HotelServiceAG.getHotelByIdHotels(hotelId).then(function (response) {
        $scope.isLoading = true;
        $timeout(function () {
            if (response.data.status === '200') {
                console.log(response.data.data)
                $scope.hotelEdit = response.data.data

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
        }, 0);

    }, errorCallback).finally(function () {
        $scope.isLoading = false;
    });


    /**
     * Phương thức so sánh placeUtilities với danh sách selectPlaceUtilities
     * @param placeUtilities
     * @param selectedPlaceUtils
     * @returns {*}
     */
    $scope.comparePlaceUtilities = function (placeUtilities, selectedPlaceUtils) {
        return selectedPlaceUtils.some(function (selectedPlaceUtil) {
            return selectedPlaceUtil.id === placeUtilities.id;
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
        console.log(response.data)
        $scope.provinces = response.data;

    });

    /**
     * lấy thông tin cho thông tin tỉnh thành
     * */

    $scope.onProvinceChange = function () {
        var selectedProvince = $scope.provinces.find(p => p.Id === $scope.hotelEdit.province);
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
        var selectedDistrict = $scope.districts.find(d => d.Id === $scope.hotelEdit.district);
        if (selectedDistrict) {
            $scope.hotelEdit.districtName = selectedDistrict.Name;
        }

        $scope.wards = selectedDistrict ? selectedDistrict.Wards : [];
        $scope.hotelEdit.ward = null;
        $scope.hotelEdit.wardName = null;
        console.log($scope.hotelEdit.district)
    };

    /**
     * Lấy dữ liệu của xã nếu huyện đã được chọn
     */
    $scope.onWardChange = function () {
        var selectedWard = $scope.wards.find(w => w.Id === $scope.hotelEdit.ward);
        if (selectedWard) {
            $scope.hotelEdit.wardName = selectedWard.Name;
        }
        console.log($scope.hotelEdit.ward)
    };

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


    /**
     * Danh sách các tiện ích khách sạn
     */
    PlaceUtilitiesService.getListPlaceUtilities().then(function (response) {
        $scope.placeUtilitieses == null;

        try {
            if (response.status === 404) {
                $scope.showErrorListPlaceMessage = "Không tìm thấy dữ liệu vui lòng thử lại"
            } else if (response.status === 200) {
                $scope.placeUtilitieses = response.data.data.map(function (item) {
                    return {id: item.id, label: item.placeUtilitiesName, checked: false};
                });


            } else {
                $scope.showErrorListPlaceMessage = "Không tìm thấy dữ liệu vui lòng thử lại"
            }
        } catch (e) {
            $scope.showErrorListPlaceMessage = "Không tìm thấy dữ liệu vui lòng thử lại"
        }
    });

    $scope.checkboxCount = 0;

    $scope.updateplaceUtilitiesCount = function () {
        $scope.checkboxCount = $scope.placeUtilitieses.filter(function (checkbox) {
            return checkbox.checked;
        }).length;
    };

    /**
     * Kiểm tra nếu như chưa lựa chọn dịch vụ thì tắt nút di
     * @returns {*}
     */
    $scope.noCheckboxSelected = function () {
        return $scope.checkboxCount <= 0;
    };

    let user = $scope.user;
    $scope.createHotel = function () {
        $scope.isLoading = true;
        if (user !== undefined && user !== null && user !== "") {
            AgenciesServiceAG.findByUserId(user.id).then(function successCallback(response) {
                $scope.hotelEdit.agencyId = response.data.id;

                var selectedCheckboxValues = $scope.placeUtilitieses
                    .filter(function (checkbox) {
                        return checkbox.checked;
                    })
                    .map(function (checkbox) {
                        return checkbox.id;
                    });

                console.log($scope.hotelEdit)
                console.log($scope.hotelEdit.agencyId);

                HotelServiceAG.createHotel($scope.hotelEdit, selectedCheckboxValues).then(function successCallback(response) {
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