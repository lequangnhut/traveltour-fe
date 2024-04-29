travel_app.service('VisitInformationServiceAD', function ($http, $q) {
    let API = BASE_API + 'staff/booking-tour-visit/';

    this.getAllByInfo = function (page, size, sortBy, sortDir, tourDetailId, orderVisitStatus, searchTerm) {
        const deferred = $q.defer();
        $http({
            method: 'GET',
            url: API + 'find-all-booking-tour-visit',
            params: {
                page: page || 0,
                size: size || 10,
                sortBy: sortBy || 'id',
                sortDir: sortDir || 'desc',
                tourDetailId: tourDetailId || null,
                orderVisitStatus: orderVisitStatus || null,
                searchTerm: searchTerm || null
            }
        }).then(deferred.resolve, deferred.reject);
        return deferred.promise;
    };

    this.getAllByTourDetailIdAndVisitId = function (tourDetailId, visitId, orderVisitStatus) {
        const deferred = $q.defer();
        $http({
            method: 'GET',
            url: API + 'find-all-booking-tour-visit-by-tour-detail-id-and-visit-id',
            params: {
                tourDetailId: tourDetailId || null,
                visitId: visitId || null,
                orderVisitStatus: orderVisitStatus || null,
            }
        }).then(deferred.resolve, deferred.reject);
        return deferred.promise;
    };

    this.deactivate = function (tourDetailId, visitId, orderVisitStatus) {
        const deferred = $q.defer();
        $http({
            method: 'DELETE',
            url: API + `delete-booking-tour-visit-by-tour-detail-id-and-visit-id/${tourDetailId}/${visitId}/${orderVisitStatus}`
        }).then(function (response) {
            deferred.resolve(response);
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    this.pay = function (tourDetailId, visitId, orderVisitStatus, payment) {
        const deferred = $q.defer();
        $http({
            method: 'PUT',
            url: API + `pay-booking-tour-visit-by-tour-detail-id-and-visit-id`,
            params:
                {
                    tourDetailId: tourDetailId,
                    visitId: visitId,
                    orderVisitStatus: orderVisitStatus,
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
