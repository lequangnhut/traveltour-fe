travel_app.service('OrderHotelDetailServiceAD', function ($http, $q) {
    let API_ORDER_HOTEL_DETAIL = BASE_API + 'staff/order-hotel-detail/';

    this.createOrderHotelDetail = function (data) {
        return $http({
            method: 'POST',
            url: API_ORDER_HOTEL_DETAIL + 'create-order-hotel-detail',
            headers: {'Content-Type': undefined},
            data: data,
            transformRequest: angular.identity
        });
    };

});
