travel_app.service('OrderVisitServiceAD', function ($http, $q) {
    let API_ORDER_VISIT = BASE_API + 'staff/order-visit-location/';

    this.createOrderVisit = function (data) {
        return $http({
            method: 'POST',
            url: API_ORDER_VISIT + 'create-order-visit-location',
            headers: {'Content-Type': undefined},
            data: data,
            transformRequest: angular.identity
        });
    };

});
