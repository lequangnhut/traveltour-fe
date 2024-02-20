travel_app.service('HomeServiceCT', function ($http) {
    let API_HOME = BASE_API + 'customer/tour/';

    this.findAllTourDetailCustomer = function (page, size) {
        return $http({
            method: 'GET',
            url: API_HOME + 'find-tour-detail-customer',
            params: {
                page: page || 0,
                size: size || 5,
            }
        });
    };
});
