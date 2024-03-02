travel_app.service('TransportationTypeServiceAD', function ($http, $q) {
    let API = BASE_API + 'staff/transportation-type-service/';
    this.getAllTransportationTypes = function () {
        const deferred = $q.defer();
        $http({
            method: 'GET',
            url: API + 'find-all-transportation-type',
        }).then(deferred.resolve, deferred.reject);
        return deferred.promise;
    };

});
