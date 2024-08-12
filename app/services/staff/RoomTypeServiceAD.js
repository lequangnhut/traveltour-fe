travel_app.service('RoomTypeServiceServiceAD', function ($http, $q) {
    let API_ROOM_TYPE_SERVICE = BASE_API + 'staff/room-type/';

    this.getAllOrSearchRoomTypeByHotelId = function (page, size, sortBy, sortDir, hotelId,checkIn, checkOut, searchTerm) {
        const deferred = $q.defer();
        $http({
            method: 'GET',
            url: API_ROOM_TYPE_SERVICE + 'find-room-type-by-hotelId',
            params: {
                page: page || 0,
                size: size || 10,
                sortBy: sortBy || 'id',
                sortDir: sortDir || 'asc',
                hotelId: hotelId,
                checkIn: checkIn,
                checkOut: checkOut,
                searchTerm: searchTerm || '',
            }
        }).then(deferred.resolve, deferred.reject);
        return deferred.promise;
    };

    this.findBedTypeNameByRoomTypeId = function (id) {
        const deferred = $q.defer();
        $http({
            method: 'GET',
            url: API_ROOM_TYPE_SERVICE + 'find-bed-type-name-by-roomTypeId/' + id
        }).then(deferred.resolve, deferred.reject);
        return deferred.promise;
    };
    this.findRoomUtilitiesNameByRoomTypeId = function (id) {
        const deferred = $q.defer();
        $http({
            method: 'GET',
            url: API_ROOM_TYPE_SERVICE + 'find-room-utilities-name-by-roomTypeId/' + id
        }).then(deferred.resolve, deferred.reject);
        return deferred.promise;
    };

});
