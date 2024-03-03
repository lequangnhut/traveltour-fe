travel_app.service('VisitLocationTicketServiceAD', function ($http, $q) {
    let API_VISIT_LOCATION_TICKET = BASE_API + 'staff/visit-location-ticket-service/';
    this.getAllOrSearchVisitLocation = function (page, size, sortBy, sortDir, searchTerm, location, departureDate, arrivalDate, numAdults, numChildren, numRooms) {
        const deferred = $q.defer();
        $http({
            method: 'GET',
            url: API_VISIT_LOCATION_TICKET + 'find-all-visit-location-ticket',
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
            url: API_VISIT_LOCATION_TICKET + 'find-by-id/' + id
        }).then(deferred.resolve, deferred.reject);
        return deferred.promise;
    };

});
