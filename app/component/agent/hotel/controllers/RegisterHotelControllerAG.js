travel_app.controller("RegisterHotelControllerAG", function (
    $scope, $http, $location,
    AuthService, HotelTypeService, RoomUtilitiesService, PlaceUtilitiesService,
    HotelServiceAG, AgenciesServiceAG, BedTypeService, FormatDateService) {
    let user = $scope.user;
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

    $scope.hotels = {
        hotelName: null,
        phone: null,
        urlWebsite: null,
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

    $scope.hotelTypes = null
    $scope.provinces = [];
    $scope.districts = [];
    $scope.wards = [];
    $scope.checkboxCountHotels = 1;
    $scope.checkboxHotel = []

    $scope.roomTypes = {
        id: null,
        roomTypeName: null,
        hotelId: null,
        capacityAdults: null,
        capacityChildren: null,
        bedTypeId: null,
        amountRoom: null,
        price: null,
        isActive: null,
        isDeleted: null,
        breakfastIncluded: false,
        freeCancellation: false,
        checkinTime: null,
        checkoutTime: null,
        roomTypeAvatar: null,
        roomTypeDescription: null,
        roomImagesById: [],
        roomUtilities: [],
        roomBedsById: [],
        listRoomTypeImg: []
    }

    $scope.checkboxCountRoomType = 1;
    $scope.isImageSelected = false;
    $scope.isListImageSelected = false;
    $scope.checkboxRoomType = []


    function errorCallback(error) {
        toastAlert('error', "Máy chủ không tồn tại !");
    }

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
        var selectedProvince = $scope.provinces.find(p => p.Id === $scope.hotels.province);
        if (selectedProvince) {
            $scope.hotels.provinceName = selectedProvince.Name;
        }

        $scope.districts = selectedProvince ? selectedProvince.Districts : [];
        $scope.hotels.district = null;
        $scope.hotels.ward = null;
    };

    /**
     * Lấy thông tin huyện nếu tỉnh đã được chọn
     */
    $scope.onDistrictChange = function () {
        var selectedDistrict = $scope.districts.find(d => d.Id === $scope.hotels.district);
        if (selectedDistrict) {
            $scope.hotels.districtName = selectedDistrict.Name;
        }

        $scope.wards = selectedDistrict ? selectedDistrict.Wards : [];
        $scope.hotels.ward = null;
        $scope.hotels.wardName = null;
    };

    /**
     * Lấy dữ liệu của xã nếu huyện đã được chọn
     */
    $scope.onWardChange = function () {
        var selectedWard = $scope.wards.find(w => w.Id === $scope.hotels.ward);
        if (selectedWard) {
            $scope.hotels.wardName = selectedWard.Name;
        }

    };

    /**
     * Băt lỗi hình ảnh đại diện khách sạn
     */
    $scope.validateAvataHotel = function (file) {
        var maxImages = 1;

        if ($scope.hotels.avatarHotel && $scope.hotels.avatarHotel.length > maxImages) {
            $scope.register_hotels.avataHotel.$setValidity('maxImages', false);
        } else {
            $scope.register_hotels.avataHotel.$setValidity('maxImages', true);
        }

        if (file.size > 10 * 1024 * 1024) { // Chuyển đổi kích thước từ MB sang byte và kiểm tra
            $scope.register_hotels.avataHotel.$error.maxSize = true;
        } else {
            delete $scope.register_hotels.avataHotel.$error.maxSize;
        }

    };

    /**
     * Phương thức kiểm tra xem đã chọn vị trí trên bản đồ chưa
     * @returns {boolean}
     */
    $scope.isLocationSelected = function () {
        return !($scope.longitude && $scope.latitude);
    };

    /**
     * Danh sách các tiện ích khách sạn
     */
    PlaceUtilitiesService.getListPlaceUtilities().then(function (response) {
        $scope.checkboxHotel == null;

        try {
            if (response.status === 404) {
                $scope.showErrorListPlaceMessage = "Không tìm thấy dữ liệu vui lòng thử lại"
            } else if (response.status === 200) {
                $scope.checkboxHotel = response.data.data.map(function (item) {
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
     * Cập nhật số lượng checkbox
     */
    $scope.updateCheckboxCountHotel = function () {
        $scope.checkboxCountHotels = $scope.checkboxHotel.filter(function (checkbox) {
            return checkbox.checked;
        }).length;
    };

    /**
     * Kiểm tra nếu như chưa lựa chọn dịch vụ thì tắt nút di
     * @returns {*}
     */
    $scope.noCheckboxSelectedHotel = function () {
        return $scope.checkboxCountHotels <= 0;
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
    $scope.map.on('load', function () {
        $scope.map.on('click', function (e) {
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

    AgenciesServiceAG.findByUserId(user.id).then(function successCallback(response) {
        $scope.hotels.agencyId = response.data.id;
    })

    /**
     * Phương thức bắt lỗi ảnh đại diện khách sạn
     */
    $scope.validateRoomTypeAvatar = function () {
        var maxImages = 1;

        if ($scope.roomTypes.roomTypeAvatar && $scope.roomTypes.roomTypeAvatar.length > maxImages) {
            $scope.register_roomType.roomTypeAvatar.$setValidity('maxImages', false);
        } else {
            $scope.register_roomType.roomTypeAvatar.$setValidity('maxImages', true);
        }
        $scope.isImageSelected = !!$scope.roomTypes.roomTypeAvatar;
    };

    /**
     * Phương thức bắt lỗi danh sách hình ảnh
     */
    $scope.validateListRoomTypeImg = function () {
        var maxImages = 30;

        if ($scope.roomTypes.listRoomTypeImg && $scope.roomTypes.listRoomTypeImg.length > maxImages) {
            $scope.register_roomType.listRoomTypeImg.$setValidity('maxImages', false);
        } else {
            $scope.register_roomType.listRoomTypeImg.$setValidity('maxImages', true);
        }
        $scope.isListImageSelected = !!$scope.roomTypes.listRoomTypeImg;
    };

    /**
     * Danh sách các tiện ích phòng khách sạn
     */
    RoomUtilitiesService.getAllRoomUtilities().then(function (response) {
        $scope.isLoading = true;
        $scope.checkboxes == null;
        try {
            if (response.status === 404) {
                $scope.showErrorListPlaceMessage = "Không tìm thấy dữ liệu vui lòng thử lại"
            } else if (response.status === 200) {
                $scope.checkboxRoomType = response.data.data.map(function (item) {
                    return {id: item.id, label: item.roomUtilitiesName, checked: false};
                });


            } else {
                $scope.showErrorListPlaceMessage = "Không tìm thấy dữ liệu vui lòng thử lại"
            }
        } catch (e) {
            $scope.showErrorListPlaceMessage = "Không tìm thấy dữ liệu vui lòng thử lại"
        }
    }, errorCallback).finally(function () {
        $scope.isLoading = false;
    });

    /**
     * Phương thức lấy toàn bộ danh sách loại giường khách sạn
     */
    BedTypeService.getAllBedTypes().then(function (response) {
        $scope.isLoading = true;
        if (response.data.status === "200") {
            $scope.bedTypeList = response.data.data
        } else if (response.data.status === "404") {
            $scope.errorBedTypeList = response.data.message
        }
    }, errorCallback).finally(function () {
        $scope.isLoading = false;
    });

    /**
     * Phương thức kiểm tra số lượng checkbox
     */
    $scope.updateCheckboxCountRoomType = function () {
        $scope.checkboxCountRoomType = $scope.checkboxRoomType.filter(function (checkbox) {
            return checkbox.checked;
        }).length;
    };

    /**
     * Kiểm tra nếu như chưa lựa chọn dịch vụ thì tắt nút di
     * @returns {*}
     */
    $scope.noCheckboxSelectedRoomType = function () {
        return $scope.checkboxCountRoomType <= 0;
    };


    /**
     * Upload hình ảnh và lưu vào biến business_images
     * @param file
     */
    $scope.uploadBusinessImage = function (file) {
        if (file && !file.$error) {
            $scope.agent.business_images = file;
        }
    };

    $scope.registerHotel = function () {
        $scope.isLoading = true;
        var selectedPlaceUtilitiesHotel = $scope.checkboxHotel
            .filter(function (checkbox) {
                return checkbox.checked;
            })
            .map(function (checkbox) {
                return checkbox.id;
            });

        var selectedRoomTypeUtilities = $scope.checkboxRoomType
            .filter(function (checkbox) {
                return checkbox.checked;
            })
            .map(function (checkbox) {
                return checkbox.id;
            });

        console.log($scope.hotels)
        console.log($scope.roomTypes)
        console.log(selectedPlaceUtilitiesHotel)
        console.log(selectedRoomTypeUtilities)
        console.log(FormatDateService.formatDate($scope.roomTypes.checkinTime))
        console.log(FormatDateService.formatDate($scope.roomTypes.checkoutTime))
        console.log($scope.roomTypes.bedTypeId)

        HotelServiceAG.registerHotels(
            $scope.hotels,
            $scope.roomTypes,
            selectedPlaceUtilitiesHotel,
            selectedRoomTypeUtilities,
            FormatDateService.formatDate($scope.roomTypes.checkinTime),
            FormatDateService.formatDate($scope.roomTypes.checkoutTime),
            $scope.roomTypes.bedTypeId,
            $scope.hotels.avatarHotel,
            $scope.roomTypes.roomTypeAvatar,
            $scope.roomTypes.listRoomTypeImg
        ).then(function (response) {
            if (response.status === 200) {
                toastAlert('success', "Đăng ký khách sạn thành công !");
                $location.path('/business/hotel/home')
            } else {
                toastAlert('error', "Đăng ký khách sạn thất bại !");
            }
        }).finally(function () {
            $scope.isLoading = false;
        })
    }

    $scope.init();

})