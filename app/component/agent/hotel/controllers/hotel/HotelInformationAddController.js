travel_app.controller("HotelInformationAddController", function ($scope, $http, $location,  $window, HotelServiceAG, PlaceUtilitiesService, HotelTypeService, AgenciesServiceAG) {
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
    $scope.checkboxCount = 0;

    $scope.selectHotelType = function () {
    };

    $scope.currentMarker = null;
    $scope.longitude = null;
    $scope.latitude = null;

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
     * Phương thức kiểm tra xem đã chọn vị trí trên bản đồ chưa
     * @returns {boolean}
     */
    $scope.isLocationSelected = function() {
        return !($scope.longitude && $scope.latitude);
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

    /**
     * Kiểm tra nếu như chưa lựa chọn dịch vụ thì tắt nút di
     * @returns {*}
     */
    $scope.noCheckboxSelected = function () {
        return $scope.checkboxCount <= 0;
    };

    mapboxgl.accessToken = 'pk.eyJ1IjoicW5odXQxNyIsImEiOiJjbHN5aXk2czMwY2RxMmtwMjMxcGE1NXg4In0.iUd6-sHYnKnhsvvFuuB_bA';

    /**
     * Tạo bản đồ
     */
    $scope.map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [105.8342, 21.0278],
        zoom: 5
    });

    /**
     * Xử lí sự kiện chọn vị trí trên bản đồ
     */
    $scope.map.on('load', function() {
        $scope.map.on('click', function(e) {
            $scope.longitude = e.lngLat.lng;
            $scope.latitude = e.lngLat.lat;

            if ($scope.currentMarker) {
                $scope.currentMarker.remove();
            }

            $scope.currentMarker = new mapboxgl.Marker()
                .setLngLat([$scope.longitude, $scope.latitude])
                .addTo($scope.map);
        });
    });

    /**
     * Cập nhật số lượng checkbox
     */
    $scope.updateCheckboxCount = function () {
        $scope.checkboxCount = $scope.checkboxes.filter(function (checkbox) {
            return checkbox.checked;
        }).length;
    };

    let user = $scope.user;
    $scope.createHotel = function () {
        var successSound = new Audio('assets/admin/assets/sound/success.mp3');
        var errorSound = new Audio('assets/admin/assets/sound/error.mp3');

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

                HotelServiceAG.createHotel($scope.company, selectedCheckboxValues, $scope.longitude, $scope.latitude).then(function successCallback(response) {
                    if (response.status === 200) {
                        $location.path('/business/hotel/home');
                        successSound.play()
                        toastAlert('success', response.data.message)
                    } else if(response.status === 500) {
                        errorSound.play()
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