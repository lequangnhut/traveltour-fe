travel_app.service("RoomTypeService", function($http, $q) {
    let API_ROOM_TYPE = BASE_API + "agent/room-type/"

    /**
     * Phương thức tìm kiếm khách sạn phân trang
     * @param page trang
     * @param size kích thước
     * @param sortBy sắp sếp
     * @param sortDir điều kiện sắp xếp
     * @param searchTerm dữ liệu tìm kiếm
     * @param hotelId mã khách sạn
     * @returns {*}
     */
    this.findAllRoomTypeDetails = function (page, size, sortBy, sortDir, searchTerm, hotelId) {
        const deferred = $q.defer();
        $http({
            method: 'GET',
            url: API_ROOM_TYPE + 'get-room-type',
            params: {
                page: page || 0,
                size: size || 10,
                sortBy: sortBy || 'id',
                sortDir: sortDir || 'asc',
                searchTerm: searchTerm || '',
                hotelId: hotelId,
                isDelete: false
            }
        }).then(deferred.resolve, deferred.reject);
        return deferred.promise;
    };

    /**
     * Phương thức lấy loại phòng dựa vào id phòng
     * @param roomTypeId
     * @returns {*}
     */
    this.getRoomTypeById = function(roomTypeId) {
        const deferred = $q.defer();
        $http({
            method: 'GET',
            url: API_ROOM_TYPE + 'get-room-type-by-id',
            params: {
                roomTypeId: roomTypeId
            }
        }).then(deferred.resolve, deferred.reject);
        return deferred.promise;
    }

    /**
     * Service lưu khách sạn
     * @param roomTypes thông tin loại phòng
     * @returns {*}
     */
    this.editInfoRoomType = function (roomTypes, checkinTime, checkoutTime) {
        var formData = new FormData();

        formData.append('roomTypes', new Blob([JSON.stringify(roomTypes)], {type: "application/json"}));
        formData.append('checkinTime', checkinTime);
        formData.append('checkoutTime', checkoutTime);

        return $http({
            method: 'PUT',
            url: API_ROOM_TYPE + 'editInfoRoomType',
            headers: {'Content-Type': undefined},
            data: formData,
        });
    };

    /**
     * Service lưu khách sạn
     * @param roomTypes thông tin loại phòng
     * @param roomTypeAvatarData ảnh đại diện khách sạn
     * @param listRoomTypeImg danh sách hình ảnh khách sạn
     * @param selectedCheckboxValues danh sách dịch vụ phòng
     * @param checkinTime thời gian nhận phòng
     * @param checkoutTime thời gian trả phòng
     * @returns {*}
     */
    this.saveRoomType = function (roomTypes, roomTypeAvatarData, listRoomTypeImg, selectedCheckboxValues, checkinTime, checkoutTime) {
        var formData = new FormData();

        formData.append('roomTypes', new Blob([JSON.stringify(roomTypes)], {type: "application/json"}));
        formData.append('selectedCheckboxValues', new Blob([JSON.stringify(selectedCheckboxValues)], {type: "application/json"}));
        formData.append('checkinTime', checkinTime);
        formData.append('checkoutTime', checkoutTime);

        if (roomTypeAvatarData && roomTypeAvatarData.length > 0) {
            formData.append('roomTypeAvatarData', roomTypeAvatarData[0], roomTypeAvatarData[0].name);
        } else {
            var emptyImageBlob = new Blob([''], { type: "image/png" });
            formData.append('roomTypeAvatarData', emptyImageBlob, 'empty-image.png');
        }

        if (listRoomTypeImg && listRoomTypeImg.length > 0) {
            for (var i = 0; i < listRoomTypeImg.length; i++) {
                formData.append('listRoomTypeImg', listRoomTypeImg[i], listRoomTypeImg[i].name);
            }
        } else {
            var emptyListImageBlob = new Blob([''], { type: "image/png" });
            formData.append('listRoomTypeImg', emptyListImageBlob, 'empty-image.png');
        }

        return $http({
            method: 'POST',
            url: API_ROOM_TYPE + 'saveRoomType',
            headers: {'Content-Type': undefined},
            data: formData,
        });
    };

    /**
     * Service cập nhật ảnh khách sạn
     * @param roomTypeId mã loại phòng
     * @param roomTypeAvatarData ảnh đại diện khách sạn
     * @returns {*}
     */
    this.updateAvatarRoomType = function (roomTypeId, roomTypeAvatarData) {
        var formData = new FormData();

        formData.append('roomTypeId', roomTypeId);
        if (roomTypeAvatarData && roomTypeAvatarData.length > 0 && roomTypeAvatarData[0].name) {
            formData.append('roomTypeImg', roomTypeAvatarData[0], roomTypeAvatarData[0].name);
        }
        return $http({
            method: 'PUT',
            url: API_ROOM_TYPE + 'updateAvatarRoomType',
            headers: {'Content-Type': undefined},
            data: formData,
        });
    }

    this.findRoomTypesById = function (roomTypeId) {
        const deferred = $q.defer();
        $http({
            method: 'GET',
            url: API_ROOM_TYPE + 'findRoomTypesById',
            params: {
                roomTypeId: roomTypeId
            }
        }).then(deferred.resolve, deferred.reject);
        return deferred.promise;
    }

})