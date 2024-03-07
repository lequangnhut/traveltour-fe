travel_app.service('TourCusService', function ($http) {
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

    this.findAllTourType = function () {
        return $http({
            method: 'GET',
            url: API_TOUR + 'find-all-tour-type'
        });
    }
});
