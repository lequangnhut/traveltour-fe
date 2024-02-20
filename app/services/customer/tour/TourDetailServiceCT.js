travel_app.service('TourDetailServiceCT', function ($http) {
    let API_HOME = BASE_API + 'customer/tour/';

    this.findByTourDetailId = function (tourDetailId) {
        return $http({
            method: 'GET',
            url: API_HOME + 'find-by-tour-detail-id/' + tourDetailId
        });
    };
});
