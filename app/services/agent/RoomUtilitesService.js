travel_app.service("RoomUtilitiesService", function($http, $q) {
    let API_ROOM_UTILITES = BASE_API + "agent/room-utilities/"

    /**
     * Phương thức lấy tất cả dịch vụ phòng
     * @returns {*}
     */
    this.getAllRoomUtilities = function() {
        const deferred = $q.defer();
        $http({
            method: 'GET',
            url: API_ROOM_UTILITES + 'get-all-room-utilities',
        }).then(deferred.resolve, deferred.reject);
        return deferred.promise;
    }
})