travel_app.controller("RoomTypeImageController", function ($scope, $location, $routeParams, RoomImagesService) {
    $scope.id = $routeParams.id;

    $scope.editImageRoom = {
        id: null,
        roomTypeId: null,
        roomTypeImg: null,
    }
    $scope.deletedImages = [];

    function errorCallback(error) {
        toastAlert('error', "Máy chủ không tồn tại !");
    }

    /**
     * Phương thức lấy toàn bộ danh sách hình ảnh của khách sạn
     */
    RoomImagesService.getAllImagesByRoomId($scope.id).then(function (response) {
        $scope.isLoading = true;
        if (response.data.status === "200") {
            $scope.editImageRoom = response.data.data;
            $scope.checkCountImage = $scope.editImageRoom.length;
        } else if (response.data.status === "404") {
            $scope.inValidImage = response.data.message;
        }
    }, errorCallback).finally(function () {
        $scope.isLoading = false;
    });



    $scope.deleteImage = function (imageId) {
        var index = -1;
        for (var i = 0; i < $scope.editImageRoom.length; i++) {
            if ($scope.editImageRoom[i].id === imageId) {
                index = i;
                break;
            }
        }
        if (index > -1) {
            $scope.deletedImages.push(imageId);
            $scope.editImageRoom.splice(index, 1);
            $scope.checkCountImage = $scope.editImageRoom.length;
            $scope.validateRoomTypeImg();
        }
    };

    $scope.validateRoomTypeImg = function () {
        var maxImages = 30;

        if ($scope.editImageRoom.roomTypeImg && 
            $scope.editImageRoom.roomTypeImg.length > maxImages ||
            $scope.editImageRoom.roomTypeImg.length + $scope.checkCountImage > maxImages)
        {
            $scope.editImageRoomForm.roomTypeImg.$setValidity('maxImages', false);
        } else {
            $scope.editImageRoomForm.roomTypeImg.$setValidity('maxImages', true);
        }
        $scope.isListImageSelected = !!$scope.editImageRoom.roomTypeImg;
    };

    $scope.editImgRoomType = function () {
        var successSound = new Audio('assets/admin/assets/sound/success.mp3');
        var errorSound = new Audio('assets/admin/assets/sound/error.mp3');
        $scope.isLoading = true;
        console.log($scope.id)
        RoomImagesService.editImageRoomType($scope.id, $scope.deletedImages, $scope.editImageRoom.roomTypeImg)
            .then(function (response)
        {
            $scope.isLoading = true;
            if (response.data.status === "200") {
                $location.path('/business/hotel/room-type-list');
                successSound.play();
                toastAlert('success', response.data.message)
            } else if (response.data.status === "500") {
                toastAlert('error', response.data.message)
                errorSound.play();
            } else {
                toastAlert('error', response.data.message)
                errorSound.play();
            }
        }, errorCallback).finally(function () {
            $scope.isLoading = false;
        })
    }
})