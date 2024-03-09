travel_app.service('RoomTypeServiceCT', function ($http) {
    let API_ROOM_TYPE_CUSTOMER = BASE_API + 'customer/room-types/';

    this.findAllRoomType = function () {
        return $http({
            method: 'GET',
            url: API_ROOM_TYPE_CUSTOMER + 'findAllRoomType'
        });
    };


    this.findAllRoomTypesByEncryptedData = function (encryptedData) {
        return $http({
            method: 'GET',
            url: API_ROOM_TYPE_CUSTOMER + 'findAllRoomTypesByEncryptedData',
            params: {
                encryptedData: encryptedData
            }
        });
    }

    this.findRoomTypeByIdCustomer = function (ids) {
        return $http({
            method: 'GET',
            url: API_ROOM_TYPE_CUSTOMER + 'findRoomTypeByIdCustomer',
            params: {
                ids: ids
            }
        });
    }
})