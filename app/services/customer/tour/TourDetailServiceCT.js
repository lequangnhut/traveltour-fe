travel_app.service('TourDetailServiceCT', function ($http) {
    let API_TOUR = BASE_API + 'customer/tour/';

    this.findByTourDetailId = function (tourDetailId) {
        return $http({
            method: 'GET',
            url: API_TOUR + 'find-by-tour-detail-id/' + tourDetailId
        });
    };
});
