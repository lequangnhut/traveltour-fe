travel_app.service('VisitLocationServiceAD', function ($http, $q) {
    let API_VISIT_LOCATION = BASE_API + 'staff/visit-location-service/';
    this.getAllOrSearchVisitLocation = function (page, size, sortBy, sortDir, searchTerm, location) {
        const deferred = $q.defer();
        $http({
            method: 'GET',
            url: API_VISIT_LOCATION + 'find-all-visit-location',
            params: {
                page: page || 0,
                size: size || 10,
                sortBy: sortBy || 'id',
                sortDir: sortDir || 'asc',
                searchTerm: searchTerm || '',
                location: location || null
            }
        }).then(deferred.resolve, deferred.reject);
        return deferred.promise;
    };

    this.findVisitLocationById = function (id) {
        const deferred = $q.defer();
        $http({
            method: 'GET',
            url: API_VISIT_LOCATION + 'find-by-id/' + id
        }).then(deferred.resolve, deferred.reject);
        return deferred.promise;
    };

});
