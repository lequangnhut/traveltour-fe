travel_app.controller("HotelInformationAddController", function ($scope, $http, $location, HotelServiceAG, PlaceUtilitiesService, HotelTypeService, AgenciesServiceAG) {
    $scope.company = {
        hotelName: null,
        phoneNumber: null,
        website: null,
        province: null,
        district: null,
        ward: null,
        address: null,
        provinceName: null,
        districtName: null,
        wardName: null,
        floorNumber: null,
        avatarHotel: null,
        hotelType: null,
        agencyId: null
    };

    function errorCallback(error) {
        toastAlert('error', "Máy chủ không tồn tại !");
    }

    $scope.hotelTypes = null
    $scope.provinces = [];
    $scope.districts = [];
    $scope.wards = [];

    $scope.selectHotelType = function () {
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
     * Băt lỗi hình ảnh đại diện khách sạn
     */
    $scope.validateAvataHotel = function () {
        var maxImages = 1;

        if ($scope.company.avatarHotel && $scope.company.avatarHotel.length > maxImages) {
            $scope.register_company.avataHotel.$setValidity('maxImages', false);
        } else {
            $scope.register_company.avataHotel.$setValidity('maxImages', true);
        }
    };


    /**
     * Danh sách các tiện ích khách sạn
     */
    PlaceUtilitiesService.getListPlaceUtilities().then(function (response) {
        $scope.checkboxes == null;

        try {
            if (response.status === 404) {
                $scope.showErrorListPlaceMessage = "Không tìm thấy dữ liệu vui lòng thử lại"
            } else if (response.status === 200) {
                $scope.checkboxes = response.data.data.map(function (item) {
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

    $scope.updateCheckboxCount = function () {
        $scope.checkboxCount = $scope.checkboxes.filter(function (checkbox) {
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
                $scope.company.agencyId = response.data.id;

                var selectedCheckboxValues = $scope.checkboxes
                    .filter(function (checkbox) {
                        return checkbox.checked;
                    })
                    .map(function (checkbox) {
                        return checkbox.id;
                    });

                HotelServiceAG.createHotel($scope.company, selectedCheckboxValues).then(function successCallback(response) {
                    if (response.status === 200) {
                        $location.path('/business/hotel/home');
                        toastAlert('success', response.data.message)
                    } else if(response.status === 500) {
                        toastAlert('error', response.data.message);
                    }
                }, errorCallback).finally(function () {
                    $scope.isLoading = false;
                });
            }, errorCallback).finally(function () {
            });
        }
    };
})