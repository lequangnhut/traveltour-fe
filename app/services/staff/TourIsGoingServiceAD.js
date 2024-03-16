travel_app.service('TourIsGoingServiceAD', function ($http, $q) {
    let API = BASE_API + 'staff/booking-tour-customer/';

    this.getAll = function (page, size, sortBy, sortDir, tourDetailId, searchTerm) {
        const deferred = $q.defer();
        $http({
            method: 'GET',
            url: API + 'find-all-booking-tour-customer',
            params: {
                page: page || 0,
                size: size || 10,
                sortBy: sortBy || 'id',
                sortDir: sortDir || 'asc',
                tourDetailId: tourDetailId || null,
                searchTerm: searchTerm || null
            }
        }).then(deferred.resolve, deferred.reject);
        return deferred.promise;
    };

});
