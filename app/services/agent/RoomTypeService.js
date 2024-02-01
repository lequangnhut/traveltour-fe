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
    this.editInfoRoomType = function (roomTypes) {
        var formData = new FormData();

        formData.append('roomTypes', new Blob([JSON.stringify(roomTypes)], {type: "application/json"}));

        return $http({
            method: 'POST',
            url: API_ROOM_TYPE + 'editInfoRoomType',
            headers: {'Content-Type': undefined},
            data: formData,
        });
    };

})