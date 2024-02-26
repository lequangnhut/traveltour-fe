travel_app.service('RoomTypeServiceCT', function ($http) {
    let API_ROOM_TYPE_CUSTOMER = BASE_API + 'customer/room-types/';

    this.findAllRoomType = function () {
        return $http({
            method: 'GET',
            url: API_ROOM_TYPE_CUSTOMER + 'findAllRoomType'
        });
    };
})