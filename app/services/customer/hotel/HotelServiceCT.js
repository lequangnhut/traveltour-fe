travel_app.service('HotelServiceCT', function ($http) {
    let API_HOTEL_CUSTOMER = BASE_API + 'customer/hotels/';

    this.findAllHotel = function () {
        return $http({
            method: 'GET',
            url: API_HOTEL_CUSTOMER + 'findAllHotel'
        });
    };

    this.findAllHotelType = function () {
        return $http({
            method: 'GET',
            url: API_HOTEL_CUSTOMER + 'findAllHotelType'
        });
    }

    this.findAllHotelUtilities = function () {
        return $http({
            method: 'GET',
            url: API_HOTEL_CUSTOMER + 'findAllPlaceUtilities'
        });
    }

    this.findAllRoomBedType = function () {
        return $http({
            method: 'GET',
            url: API_HOTEL_CUSTOMER + 'findAllRoomBedType'
        });
    }

    this.findAllRoomUtilities = function () {
        return $http({
            method: 'GET',
            url: API_HOTEL_CUSTOMER + 'findAllRoomUtilities'
        });
    }

    this.findAllRoomTypesByFillter = function (filter) {
        return $http({
            method: 'GET',
            url: API_HOTEL_CUSTOMER + 'findAllRoomTypesByFillter',
            params: filter
        });
    }
})