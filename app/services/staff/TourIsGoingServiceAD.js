travel_app.service('TourIsGoingServiceAD', function ($http, $q) {
    let API = BASE_API + 'staff/tour-is-going/';

    this.getAll = function (page, size, sortBy, sortDir, searchTerm) {
        const deferred = $q.defer();
        $http({
            method: 'GET',
            url: API + 'find-all-tour-is-going',
            params: {
                page: page || 0,
                size: size || 10,
                sortBy: sortBy || 'dateCreated',
                sortDir: sortDir || 'DESC',
                searchTerm: searchTerm || null
            }
        }).then(deferred.resolve, deferred.reject);
        return deferred.promise;
    };

});
