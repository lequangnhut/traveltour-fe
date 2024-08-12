travel_app.controller('RoomTypeAddController', function ($scope, $location, FormatDateService, RoomUtilitiesService, RoomTypeService, ValidationImagesService, BedTypeService, HotelServiceAG, LocalStorageService) {
    var hotelId = LocalStorageService.get("brandId")

    $scope.roomTypes = {
        id: null,
        roomTypeName: null,
        hotelId: hotelId,
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

    $scope.checkboxCount = 0;
    $scope.isImageSelected = false;
    $scope.isListImageSelected = false;

    function errorCallback(error) {
        toastAlert('error', "Máy chủ không tồn tại !");
    }

    /**
     * Phương thức bắt lỗi ảnh đại diện khách sạn
     */
    $scope.validateRoomTypeAvatar = function (file) {
        var maxImages = 1;

        if ($scope.roomTypes.roomTypeAvatar && $scope.roomTypes.roomTypeAvatar.length > maxImages) {
            $scope.addRoomTypeName.roomTypeAvatar.$setValidity('maxImages', false);
        } else {
            $scope.addRoomTypeName.roomTypeAvatar.$setValidity('maxImages', true);
        }

        if (file && !file.$error) {
            $scope.isLoading = true;
            let reader = new FileReader();

            ValidationImagesService.validationImage(file).then(function (response) {

                var validationImage = response.data

                if (0.9 > validationImage.nudity.none) {
                    $scope.hasImage = true;
                    $scope.errorMessageImage = "Phát hiện hình ảnh nhạy cảm, bạn sẽ bị khóa tài khoản nếu cố ý đăng tải"
                } else if (0.1 < validationImage.gore.prob) {
                    $scope.hasImage = true;
                    $scope.errorMessageImage = "Phát hiện hình ảnh bạo lực máu me, bạn sẽ bị khóa tài khoản nếu cố ý đăng tải"
                } else if (0.1 < validationImage.skull.prob) {
                    $scope.hasImage = true;
                    $scope.errorMessageImage = "Phát hiện hình ảnh phản cảm, bạn sẽ bị khóa tài khoản nếu cố ý đăng tải"
                } else {
                    $scope.hasImage = false;
                    $scope.errorMessageImage = ""

                    reader.onload = (e) => {
                        $scope.customer.avatar = e.target.result;
                        $scope.customerAvatarNoCloud = file;
                        $scope.hasImage = true; // Đánh dấu là đã có ảnh
                        $scope.$apply();
                    };

                    reader.readAsDataURL(file);
                }

            }).catch(function (error) {
                toastAlert("error", "Lỗi vui lòng thử lại sau");
            }).finally(function () {
                $scope.isLoading = false;
            })
        }

        $scope.isImageSelected = !!$scope.roomTypes.roomTypeAvatar;
    };

    /**
     * Phương thức bắt lỗi danh sách hình ảnh
     */
    $scope.validateListRoomTypeImg = function () {
        var maxImages = 30;

        if ($scope.roomTypes.listRoomTypeImg && $scope.roomTypes.listRoomTypeImg.length > maxImages) {
            $scope.addRoomTypeName.listRoomTypeImg.$setValidity('maxImages', false);
        } else {
            $scope.addRoomTypeName.listRoomTypeImg.$setValidity('maxImages', true);
        }
        $scope.isListImageSelected = !!$scope.roomTypes.listRoomTypeImg;
    };

    /**
     * Phương thức lấy toàn bộ khách sạn bằng mã khách sạn
     */
    HotelServiceAG.getHotelByIdHotels(hotelId).then(function (response) {
        $scope.isLoading = true;
        if (response.data.status === "200") {
            $scope.hotelName = response.data.data.hotelName
        }
    }, errorCallback).finally(function () {
        $scope.isLoading = false;
    })

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
                $scope.checkboxes = response.data.data.map(function (item) {
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


    /**
     * Upload hình ảnh và lưu vào biến business_images
     * @param file
     */
    $scope.uploadBusinessImage = function (file) {
        if (file && !file.$error) {
            $scope.agent.business_images = file;
        }
    };

    /**
     * Phương thức lưu phòng khách sạn
     */
    $scope.saveRoomType = function () {
        var successSound = new Audio('assets/admin/assets/sound/success.mp3');
        var errorSound = new Audio('assets/admin/assets/sound/error.mp3');

        $scope.isLoading = true;
        $scope.roomTypesData = {
            roomTypeName: $scope.roomTypes.roomTypeName,
            hotelId: $scope.roomTypes.hotelId,
            capacityAdults: $scope.roomTypes.capacityAdults,
            capacityChildren: $scope.roomTypes.capacityChildren,
            bedTypeId: $scope.roomTypes.bedTypeId,
            amountRoom: $scope.roomTypes.amountRoom,
            price: $scope.roomTypes.price,
            roomTypeDescription: $scope.roomTypes.roomTypeDescription,
            breakfastIncluded: $scope.roomTypes.breakfastIncluded,
            freeCancellation: $scope.roomTypes.freeCancellation,
        }

        var selectedCheckboxValues = $scope.checkboxes
            .filter(function (checkbox) {
                return checkbox.checked;
            })
            .map(function (checkbox) {
                return checkbox.id;
            });

        RoomTypeService.saveRoomType(
            $scope.roomTypesData,
            $scope.roomTypes.roomTypeAvatar,
            $scope.roomTypes.listRoomTypeImg,
            selectedCheckboxValues,
            FormatDateService.formatDate($scope.roomTypes.checkinTime),
            FormatDateService.formatDate($scope.roomTypes.checkoutTime)).then(function (response) {
            if (response.data.status === "200") {
                $location.path('/business/hotel/room-type-list');
                successSound.play();
                toastAlert('success', response.data.message)
            } else if (response.data.status === "500") {
                errorSound.play();
                toastAlert('error', response.data.message)
            }
        }, errorCallback).finally(function () {
            $scope.isLoading = false;
        });
    };

})