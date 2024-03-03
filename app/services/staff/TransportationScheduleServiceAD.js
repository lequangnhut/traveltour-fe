travel_app.service('TransportationScheduleServiceAD', function ($http, $q) {
    let API = BASE_API + 'staff/transportation-schedule-service/';
    this.getAllTransportationSchedules = function (page, size, sortBy, sortDir, transportationSearch, filters) {
        const deferred = $q.defer();
        $http({
            method: 'GET',
            url: API + 'find-all-transportation-schedule',
            params: {
                page: page || 0,
                size: size || 10,
                sortBy: sortBy || 'id',
                sortDir: sortDir || 'asc',
                transportationSearch: JSON.stringify(transportationSearch),
                filters: JSON.stringify(filters)
            }
        }).then(deferred.resolve, deferred.reject);
        return deferred.promise;
    };


    this.findById = function (id) {
        const deferred = $q.defer();
        $http({
            method: 'GET', url: API + 'find-by-id/' + id,
        }).then(deferred.resolve, deferred.reject);
        return deferred.promise;
    };
});
