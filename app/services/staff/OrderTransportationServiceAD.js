travel_app.service('OrderTransportationServiceAD', function ($http, $q) {
    let API = BASE_API + 'staff/order-transportation/';

    this.createOrderTransportation = function (data) {
        return $http({
            method: 'POST',
            url: API + 'create-order-transportation',
            headers: {'Content-Type': undefined},
            data: data,
            transformRequest: angular.identity
        });
    };

});
