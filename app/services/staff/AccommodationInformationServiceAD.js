travel_app.service('AccommodationInformationServiceAD', function ($http, $q) {
    let API = BASE_API + 'staff/booking-tour-hotel/';

    this.getAllByInfo = function (page, size, sortBy, sortDir, tourDetailId, orderHotelStatus, searchTerm) {
        const deferred = $q.defer();
        $http({
            method: 'GET',
            url: API + 'find-all-booking-tour-hotel',
            params: {
                page: page || 0,
                size: size || 10,
                sortBy: sortBy || 'dateCreated',
                sortDir: sortDir || 'DESC',
                tourDetailId: tourDetailId || null,
                orderHotelStatus: orderHotelStatus || 1,
                searchTerm: searchTerm || null
            }
        }).then(deferred.resolve, deferred.reject);
        return deferred.promise;
    };

    this.getAllByTourDetailIdAndHotelId = function (tourDetailId, hotelId) {
        const deferred = $q.defer();
        $http({
            method: 'GET',
            url: API + 'find-all-booking-tour-hotel-by-tour-detail-id-and-hotel-id',
            params: {
                tourDetailId: tourDetailId || null,
                hotelId: hotelId || null,
            }
        }).then(deferred.resolve, deferred.reject);
        return deferred.promise;
    };

    this.deactivate = function (tourDetailId, hotelId) {
        const deferred = $q.defer();
        $http({
            method: 'DELETE',
            url: API + `delete-booking-tour-hotel-by-tour-detail-id-and-hotel-id/${tourDetailId}/${hotelId}`
        }).then(function (response) {
            deferred.resolve(response);
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    this.pay = function (tourDetailId, hotelId, payment) {
        const deferred = $q.defer();
        $http({
            method: 'PUT',
            url: API + `pay-booking-tour-hotel-by-tour-detail-id-and-hotel-id`,
            params:
                {
                    tourDetailId: tourDetailId,
                    hotelId: hotelId,
                    payment: payment
                }
        }).then(function (response) {
            deferred.resolve(response);
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

});
