travel_app.service('LocationDetailCusService', function ($http) {

    let API_LOCATION_DETAIL = BASE_API + 'customer/location-detail/';

    this.findById = (id) => {
        return $http({
            method: 'GET',
            url: API_LOCATION_DETAIL + 'find-by-id/' + id
        });
    };

    this.findAllTrend = () => {
        return $http({
            method: 'GET',
            url: API_LOCATION_DETAIL + 'find-all-trend'
        });
    }

    this.findTourDestinationByLocationById = (locationId) => {
        const deferred = $q.defer();
        $http({
            method: 'GET',
            url: API_LOCATION_DETAIL + 'find-tour-destination-by-tour-detail-id/' + locationId
        }).then(deferred.resolve, deferred.reject);
        return deferred.promise;
    };

})