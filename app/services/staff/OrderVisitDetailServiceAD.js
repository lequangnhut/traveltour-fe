travel_app.service('OrderVisitDetailServiceAD', function ($http, $q) {
    let API_ORDER_VISIT_DETAIL = BASE_API + 'staff/order-visit-location-detail/';

    this.createOrderVisitDetail = function (data) {
        return $http({
            method: 'POST',
            url: API_ORDER_VISIT_DETAIL + 'create-order-Visit-detail',
            headers: {'Content-Type': undefined},
            data: data,
            transformRequest: angular.identity
        });
    };

});
