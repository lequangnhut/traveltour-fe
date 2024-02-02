travel_app.service('TourTripsServiceAD', function ($http, $q) {
    let API_TOUR_TRIPS = BASE_API + 'staff/tour-trips/';

    this.getAllTrips = function (page, size, sortBy, sortDir, tourId) {
        const deferred = $q.defer();
        $http({
            method: 'GET',
            url: API_TOUR_TRIPS + 'find-all-tourTrips/' + tourId,
            params: {
                page: page || 0,
                size: size || 10,
                sortBy: sortBy || 'id',
                sortDir: sortDir || 'asc',
                tourId: tourId || 'null'
            }
        }).then(deferred.resolve, deferred.reject);
        return deferred.promise;
    };

    this.getTripsByTourId = function (tourId) {
        const deferred = $q.defer();
        $http({
            method: 'GET',
            url: API_TOUR_TRIPS + 'find-tourTrips-by-tourId/' + tourId,
            params: {tourId: tourId || 'null'}

        }).then(deferred.resolve, deferred.reject);
        return deferred.promise;
    };

    this.findTripsById = function (id) {
        const deferred = $q.defer();
        $http({
            method: 'GET',
            url: API_TOUR_TRIPS + 'find-by-id/' + id
        }).then(deferred.resolve, deferred.reject);
        return deferred.promise;
    };

    this.createTrips = function (data) {
        return $http({
            method: 'POST',
            url: API_TOUR_TRIPS + 'create-tourTrips',
            headers: {'Content-Type': undefined},
            data: data,
            transformRequest: angular.identity
        });
    };

    this.updateTrips = function (id, data) {
        const deferred = $q.defer();
        $http({
            method: 'PUT',
            url: API_TOUR_TRIPS + 'update-tourTrips/' + id,
            data: data,
            headers: {'Content-Type': undefined},
            transformRequest: angular.identity
        }).then(function (response) {
            deferred.resolve(response);
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    this.deactivateTrips = function (id) {
        const deferred = $q.defer();
        $http({
            method: 'DELETE',
            url: API_TOUR_TRIPS + 'delete-tourTrips/' + id
        }).then(function (response) {
            deferred.resolve(response);
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };
});
