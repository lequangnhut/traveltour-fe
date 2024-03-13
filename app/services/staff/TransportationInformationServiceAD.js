travel_app.service('TransportationInformationServiceAD', function ($http, $q) {
    let API = BASE_API + 'staff/booking-tour-transportation/';

    this.getAllByInfo = function (page, size, sortBy, sortDir, tourDetailId, orderStatus, searchTerm) {
        const deferred = $q.defer();
        $http({
            method: 'GET',
            url: API + 'find-all-booking-tour-transportation',
            params: {
                page: page || 0,
                size: size || 10,
                sortBy: sortBy || 'id',
                sortDir: sortDir || 'asc',
                tourDetailId: tourDetailId || null,
                orderStatus: orderStatus || 1,
                searchTerm: searchTerm || null
            }
        }).then(deferred.resolve, deferred.reject);
        return deferred.promise;
    };

    this.deactivate = function (transportationScheduleId) {
        const deferred = $q.defer();
        $http({
            method: 'DELETE',
            url: API + `delete-order-transportation-and-transportation-schedule-by-transportation-schedule-id/${transportationScheduleId}`
        }).then(function (response) {
            deferred.resolve(response);
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    this.restore = function (transportationScheduleId) {
        const deferred = $q.defer();
        $http({
            method: 'PUT',
            url: API + `restore-order-transportation-and-transportation-schedule-by-transportation-schedule-id`,
            params: {transportationScheduleId: transportationScheduleId}
        }).then(function (response) {
            deferred.resolve(response);
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

});
