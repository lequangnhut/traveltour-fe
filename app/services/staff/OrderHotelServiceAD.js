travel_app.service('OrderHotelServiceAD', function ($http, $q) {
    let API_ORDER_HOTEL = BASE_API + 'staff/order-hotel/';

    this.createOrderHotel = function (data) {
        return $http({
            method: 'POST',
            url: API_ORDER_HOTEL + 'create-order-hotel',
            headers: {'Content-Type': undefined},
            data: data,
            transformRequest: angular.identity
        });
    };

});
