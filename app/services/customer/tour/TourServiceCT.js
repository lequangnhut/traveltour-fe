travel_app.service('TourServiceCT', function ($http) {
    let API_TOUR = BASE_API + 'customer/tour/';

    this.findAllTourDetailCustomer = function (page, size) {
        return $http({
            method: 'GET',
            url: API_TOUR + 'find-tour-detail-customer',
            params: {
                page: page || 0,
                size: size || 5,
            }
        });
    };
});
