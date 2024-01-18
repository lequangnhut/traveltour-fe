travel_app.service('ToursTypeServiceAD', function ($http, $q) {
    let API_TOUR_TYPE = BASE_API + 'staff/tourType/';

    this.findTourTypeById = function (id) {
        const deferred = $q.defer();
        $http({
            method: 'GET',
            url: API_TOUR_TYPE + 'find-by-id/' + id
        }).then(deferred.resolve, deferred.reject);
        return deferred.promise;
    };

});