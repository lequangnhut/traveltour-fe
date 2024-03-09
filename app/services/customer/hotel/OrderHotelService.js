travel_app.service('OrderHotelService', function($http, $q) {
    let API_HOTEL_CUSTOMER = BASE_API + 'customer/order-hotel/';

    this.createOrderHotel = function(orderHotel, orderDetailsHotel) {
        var formData = new FormData();
        formData.append('orderHotel', new Blob([JSON.stringify(orderHotel)], {type: "application/json"}));
        formData.append('orderDetailsHotel', new Blob([JSON.stringify(orderDetailsHotel)], {type: "application/json"}));

         return $http({
                method: 'POST',
                url: API_HOTEL_CUSTOMER + 'createOrderHotel',
                data: formData,
                headers: {'Content-Type': undefined},
          });
    };

    this.createOrderHotelWithVNPay = function(orderHotel, orderDetailsHotel) {
        var formData = new FormData();
        formData.append('orderHotel', new Blob([JSON.stringify(orderHotel)], {type: "application/json"}));
        formData.append('orderDetailsHotel', new Blob([JSON.stringify(orderDetailsHotel)], {type: "application/json"}));

        return $http({
            method: 'POST',
            url: API_HOTEL_CUSTOMER + 'createOrderHotelWithVNPay',
            data: formData,
            headers: {'Content-Type': undefined},
        });
    };
})