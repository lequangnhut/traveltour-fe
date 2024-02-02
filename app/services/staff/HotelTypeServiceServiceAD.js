travel_app.service('HotelTypeServiceServiceAD', function ($http, $q) {
    let API_HOTEL_TYPE_SERVICE = BASE_API + 'staff/hotel-type-service/';

    this.findById = function (id) {
        const deferred = $q.defer();
        $http({
            method: 'GET',
            url: API_HOTEL_TYPE_SERVICE + 'find-by-id/' + id
        }).then(deferred.resolve, deferred.reject);
        return deferred.promise;
    };

});
