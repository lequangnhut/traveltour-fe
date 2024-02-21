travel_app.controller("RoomTypeInfoRoomEditController", function($scope, $location, $routeParams, RoomTypeService, BedTypeService) {
    $scope.editInfoRoom = {
        id: null,
        roomTypeName: null,
        hotelId: null,
        capacityAdults: null,
        capacityChildren: null,
        amountRoom: null,
        price: null,
        isDeleted: null,
        roomTypeDescription: null,
        bedTypeId: null
    }

    $scope.id = $routeParams.id;

    function errorCallback(error) {
        toastAlert('error', "Máy chủ không tồn tại !");
    }

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
     * Phương thức lấy thông tin loại phòng theo mã loại phòng
     */
    RoomTypeService.getRoomTypeById($scope.id).then(function(response) {
        $scope.isLoading = true;
        if(response.data.status === "200"){
            $scope.editInfoRoom = response.data.data;
        }else if(response.data.status === "404") {
            $scope.inValidRoom = response.data.message;
        }
    }, errorCallback).finally(function () {
        $scope.isLoading = false;
    });


    /**
     * Phương thức lưu thông tin loại phòng
     */
    $scope.editInfoRoomType = function () {
        var successSound = new Audio('assets/admin/assets/sound/success.mp3');
        var errorSound = new Audio('assets/admin/assets/sound/error.mp3');

        $scope.editRoomTypeData = {
            id: $scope.editInfoRoom.id,
            roomTypeName: $scope.editInfoRoom.roomTypeName,
            hotelId: $scope.editInfoRoom.hotelId,
            capacityAdults: $scope.editInfoRoom.capacityAdults,
            capacityChildren: $scope.editInfoRoom.capacityChildren,
            amountRoom: $scope.editInfoRoom.amountRoom,
            price: $scope.editInfoRoom.price,
            isDeleted: $scope.editInfoRoom.isDeleted,
            roomTypeDescription: $scope.editInfoRoom.roomTypeDescription,
            bedTypeId: $scope.editInfoRoom.roomBedsById[0].bedTypeId,
        }
        RoomTypeService.editInfoRoomType($scope.editRoomTypeData).then(function(response) {
            $scope.isLoading = true;
            if(response.data.status === "200"){
                $location.path('/business/hotel/room-type-list');
                successSound.play();
                toastAlert('success', response.data.message)
            } else if(response.data.status === "500"){
                errorSound.play();
                toastAlert('error', response.data.message)
            } else {
                errorSound.play();
                toastAlert('error', response.data.message)
            }
        },errorCallback).finally(function () {
          $scope.isLoading = false;
        })
    }
})