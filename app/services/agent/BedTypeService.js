travel_app.service("BedTypeService", function($http, $q) {
    let API_BED_TYPE = BASE_API + "agent/bed-type/"

    this.getAllBedTypes = function() {
        const deferred = $q.defer();
        $http({
            method: 'GET',
            url: API_BED_TYPE + 'getAllBedTypes',
        }).then(deferred.resolve, deferred.reject);
        return deferred.promise;
    }

    this.getBedTypeById = function (roomBedId) {
        const deferred = $q.defer();
        $http({
            method: 'GET',
            url: API_BED_TYPE + 'getIdBedTypeById',
            params: {
                roomBedId: roomBedId
            }
        }).then(deferred.resolve, deferred.reject);
        return deferred.promise;
    }
})