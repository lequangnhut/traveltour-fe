travel_app.service('BookingTourServiceAD', function ($http, $q) {
    let API = BASE_API + 'staff/booking-tour/';

    this.getAll = function (page, size, sortBy, sortDir, dateSort, orderStatus, searchTerm) {
        const deferred = $q.defer();
        $http({
            method: 'GET',
            url: API + 'find-all-booking-tour',
            params: {
                page: page || 0,
                size: size || 10,
                sortBy: sortBy || 'id',
                sortDir: sortDir || 'desc',
                dateSort: dateSort || null,
                orderStatus: orderStatus || 0,
                searchTerm: searchTerm || null
            }
        }).then(deferred.resolve, deferred.reject);
        return deferred.promise;
    };

    this.updateStatus = function (id) {
        const deferred = $q.defer();
        $http({
            method: 'PUT',
            url: API + 'update-booking-tour/' + id
        }).then(function (response) {
            deferred.resolve(response);
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    this.deactivate = function (bookingTourId, orderNoted, whoCancelled) {
        const deferred = $q.defer();
        $http({
            method: 'DELETE',
            url: API + 'delete-booking-tour',
            params: {
                bookingTourId: bookingTourId,
                orderNoted: orderNoted,
                whoCancelled: whoCancelled
            }
        }).then(function (response) {
            deferred.resolve(response);
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };
});
