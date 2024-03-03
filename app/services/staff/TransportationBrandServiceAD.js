travel_app.service('TransportationBrandServiceAD', function ($http, $q) {
    let API = BASE_API + 'staff/transportation-brand-service/';
    this.getAllTransportationBrands = function () {
        const deferred = $q.defer();
        $http({
            method: 'GET',
            url: API + 'find-all-transportation-brand',
        }).then(deferred.resolve, deferred.reject);
        return deferred.promise;
    };

});
