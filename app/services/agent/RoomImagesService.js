travel_app.service("RoomImagesService", function ($http) {
    let API_ROOM_IMAGE = BASE_API + 'agent/room-images/';

    this.getAllImagesByRoomId = function (roomId) {
        return $http({
            method: "GET",
            url: API_ROOM_IMAGE + "getAllImagesByRoomId",
            params: {roomId: roomId}
        });
    };

    this.editImageRoomType = function ( roomTypeId, listImageDelete, listRoomTypeImg){
        var formData = new FormData();

        formData.append('roomTypeId', roomTypeId );
        formData.append('listImageDelete', new Blob([JSON.stringify(listImageDelete)], {type: "application/json"}));

        if (listRoomTypeImg && listRoomTypeImg.length > 0) {
            for (var i = 0; i < listRoomTypeImg.length; i++) {
                formData.append('listRoomTypeImg', listRoomTypeImg[i], listRoomTypeImg[i].name);
            }
        } else {
            var emptyListImageBlob = new Blob([''], {type: "image/png"});
            formData.append('listRoomTypeImg', emptyListImageBlob, 'empty-image.png');
        }

        return $http({
            method: 'PUT',
            url: API_ROOM_IMAGE + 'saveImageRoomType',
            headers: {'Content-Type': undefined},
            data: formData,
        });
    };
})