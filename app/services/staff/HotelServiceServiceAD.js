travel_app.service('HotelServiceServiceAD', function ($http, $q) {
    let API_HOTEL_SERVICE = BASE_API + 'staff/hotel-service/';

    this.getAllOrSearchHotels = function (page, size, sortBy, sortDir, searchTerm,
                                          location, departureDate, arrivalDate, numAdults,
                                          numChildren, numRooms) {
        const deferred = $q.defer();
        $http({
            method: 'GET',
            url: API_HOTEL_SERVICE + 'find-all-hotel',
            params: {
                page: page || 0,
                size: size || 5,
                sortBy: sortBy || 'dateCreated',
                sortDir: sortDir || 'DESC',
                searchTerm: searchTerm || null,
                location: location || null,
                departureDate: departureDate || null,
                arrivalDate: arrivalDate || null,
                numAdults: numAdults || null,
                numChildren: numChildren || null,
                numRooms: numRooms || null
            }
        }).then(deferred.resolve, deferred.reject);
        return deferred.promise;
    };

    this.findHotelById = function (id) {
        const deferred = $q.defer();
        $http({
            method: 'GET',
            url: API_HOTEL_SERVICE + 'find-by-id/' + id
        }).then(deferred.resolve, deferred.reject);
        return deferred.promise;
    };

});
