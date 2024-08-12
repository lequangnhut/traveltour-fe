travel_app.controller("HotelInformationEditController", function ($scope, $http, $timeout, $location, $routeParams, HotelServiceAG, PlaceUtilitiesService, HotelTypeService, AgenciesServiceAG) {

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
        longitude: null,
        latitude: null,
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
    $scope.initialLocation = {lat: $scope.hotelEdit.latitude, lng: null};
    var currentMarker = null;
    $scope.newLocation = null

    $scope.init();

    function errorCallback(error) {
        toastAlert('error', "Máy chủ không tồn tại !");
    }

    mapboxgl.accessToken = 'pk.eyJ1IjoicW5odXQxNyIsImEiOiJjbHN5aXk2czMwY2RxMmtwMjMxcGE1NXg4In0.iUd6-sHYnKnhsvvFuuB_bA';

    $scope.map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [105.8342, 21.0278], // Hoặc bất kỳ vị trí nào bạn muốn hiển thị khi bắt đầu
        zoom: 12
    });

    $scope.map.on('load', function() {
        // Giờ đây bạn có thể an toàn thêm sự kiện click vào bản đồ
        $scope.map.on('click', function(e) {
            $scope.newLocation = {
                lat: e.lngLat.lat,
                lng: e.lngLat.lng
            };
            addMarker($scope.newLocation);
            console.log('New location:', $scope.newLocation);
        });
    });

    /**
     * Phương thức lây khách thông tin khách sạn dựa vào id trên đường dẫn
     */
    HotelServiceAG.getHotelByIdHotels(hotelId).then(function (response) {
        $timeout(function () {
            if (response.data.status === '200') {
                $scope.hotelEdit = response.data.data
                $scope.initialLocation.lat = $scope.hotelEdit.latitude;
                $scope.initialLocation.lng = $scope.hotelEdit.longitude;
                $scope.map.flyTo({center: [$scope.initialLocation.lng, $scope.initialLocation.lat]});
                $scope.initialLocation = new mapboxgl.Marker()
                    .setLngLat([$scope.initialLocation.lng, $scope.initialLocation.lat])
                    .addTo($scope.map);
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

        try {

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
        } catch (e) {
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

    /**
     * Phương thức tải hình ảnh lên
     * @param file
     */
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


    /**
     * Phương thức lấy hình ảnh hiện tại
     * @returns {string}
     */
    $scope.getCurrentImageSource = function () {
        if ($scope.hotelEdit.hotelAvatar && typeof $scope.hotelEdit.hotelAvatar === 'string' && $scope.hotelEdit.hotelAvatar.startsWith('http')) {
            return $scope.hotelEdit.hotelAvatar;
        } else if ($scope.hotelEdit.hotelAvatar && typeof $scope.hotelEdit.hotelAvatar === 'string') {
            // If hotelAvatar is a data URL
            return $scope.hotelEdit.hotelAvatar;
        }
    };

    /**
     * Phương thức cập nhật dịch vụ đã chọn
     * @returns {string}
     */
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

    /**
     * Kiểm tra nếu như chưa lựa chọn dịch vụ thì tắt nút di
     * @returns {string}
     */
    $scope.noPlaceUtilitiesSelected = function () {
        // Kiểm tra xem có tiện ích nào được chọn không
        return !$scope.placeUtilitieses.some(function (placeUtilities) {
            return placeUtilities.checked;
        });
    };

    function addMarker(location) {
        if (currentMarker) {
            currentMarker.setLngLat([location.lng, location.lat]);
        } else {
            currentMarker = new mapboxgl.Marker()
                .setLngLat([location.lng, location.lat])
                .addTo($scope.map);
        }
    }

    /**
     * Phương thức cập nhật khách sạn
     * @returns {string}
     */
    let user = $scope.user;
    $scope.updateHotel = function () {
        var successSound = new Audio('assets/admin/assets/sound/success.mp3');
        var errorSound = new Audio('assets/admin/assets/sound/error.mp3');
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
            longitude: $scope.hotelEdit.longitude,
            latitude: $scope.hotelEdit.latitude
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

                // Chuyển đổi object thành mảng số nguyên
                var selectedUtilitiesArray = Object.values($scope.selectedUtilitieses);
                var selectedUtilitiesIds = selectedUtilitiesArray.map(function (utility) {
                    return utility.id;
                });

                HotelServiceAG.updateHotel($scope.dataHotel, selectedUtilitiesIds, $scope.hotelEdit.hotelAvatarUpdated, $scope.newLocation.lng, $scope.newLocation.lat,)
                    .then(function successCallback(response) {
                        if (response.status === 200) {
                            $location.path('/business/hotel/home');
                            successSound.play()
                            toastAlert('success', response.data.message);
                        } else if (response.status === 500) {
                            errorSound.play()
                            toastAlert('error', response.message);
                        }
                    }, errorCallback).finally(function () {
                    $scope.isLoading = false;
                });
            }, errorCallback).finally(function () {

            });
        }
    };


    $scope.confirmDelete = function () {
        Swal.fire({
            title: 'Bạn có chắc muốn xóa khách sạn?',
            text: "Hành động này sẽ xóa thông tin khách sạn khỏi hệ thống!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Có, xóa!',
            cancelButtonText: 'Hủy bỏ'
        }).then(function (result) {
            var successSound = new Audio('assets/admin/assets/sound/success.mp3');
            var errorSound = new Audio('assets/admin/assets/sound/error.mp3');
            if (result.isConfirmed) {
                HotelServiceAG.deleteHotel(hotelId).then(function (response) {
                    if (response.status === 200) {
                        $location.path('/business/hotel/home');
                        toastAlert('success', response.data.message);
                        successSound.play()
                    } else {
                        errorSound.play()
                        toastAlert('error', response.message);
                    }
                });
            }
        });
    };
})