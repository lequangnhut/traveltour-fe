travel_app.service('TourDetailCusService', function ($http) {
    let API_TOUR = BASE_API + 'customer/tour/';

    this.findAllTourTrend = function () {
        return $http({
            method: 'GET',
            url: API_TOUR + 'find-all-tour-trend'
        });
    }

    this.findByTourDetailId = function (tourDetailId) {
        return $http({
            method: 'GET',
            url: API_TOUR + 'find-by-tour-detail-id/' + tourDetailId
        });
    };
});
