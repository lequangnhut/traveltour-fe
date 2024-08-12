travel_app.service('GuideService', function ($http, $q) {
    let API_GUIDE = BASE_API + 'guide/';

    /**
     * API show list bên doanh nghiệp đã được duyệt
     */
    this.findAllTour = function (guideId, tourStatus, page, size, sortBy, sortDir, searchTerm) {
        const deferred = $q.defer();
        $http({
            method: 'GET',
            url: API_GUIDE + 'tour-of-guide',
            params: {
                guideId: guideId,
                tourStatus: tourStatus,
                page: page || 0,
                size: size || 6,
                sortBy: sortBy || 'id',
                sortDir: sortDir || 'desc',
                searchTerm: searchTerm || null
            }
        }).then(deferred.resolve, deferred.reject);
        return deferred.promise;
    };

    this.findInfoById = function (tourTypeId, tourDetailId) {
        return $http({
            method: 'GET',
            url: API_GUIDE + 'find-by-id',
            params: {
                tourTypeId: tourTypeId,
                tourDetailId: tourDetailId
            }
        })
    };

    this.getAllHotelForGuide = function (page, size, sortBy, sortDir, tourDetailId, searchTerm) {
        const deferred = $q.defer();
        $http({
            method: 'GET',
            url: API_GUIDE + 'find-all-order-hotel-for-tour',
            params: {
                page: page || 0,
                size: size || 10,
                sortBy: sortBy || 'dateCreated',
                sortDir: sortDir || 'DESC',
                tourDetailId: tourDetailId || null,
                searchTerm: searchTerm || null
            }
        }).then(deferred.resolve, deferred.reject);
        return deferred.promise;
    };

    this.getAllTransForGuide = function (page, size, sortBy, sortDir, tourDetailId, searchTerm) {
        const deferred = $q.defer();
        $http({
            method: 'GET',
            url: API_GUIDE + 'find-all-order-transportation-for-tour',
            params: {
                page: page || 0,
                size: size || 10,
                sortBy: sortBy || 'dateCreated',
                sortDir: sortDir || 'DESC',
                tourDetailId: tourDetailId || null,
                searchTerm: searchTerm || null
            }
        }).then(deferred.resolve, deferred.reject);
        return deferred.promise;
    };

    this.getAllVisitByInfo = function (page, size, sortBy, sortDir, tourDetailId, searchTerm) {
        const deferred = $q.defer();
        $http({
            method: 'GET',
            url: API_GUIDE + 'find-all-order-visit-for-tour',
            params: {
                page: page || 0,
                size: size || 10,
                sortBy: sortBy || 'dateCreated',
                sortDir: sortDir || 'DESC',
                tourDetailId: tourDetailId || null,
                searchTerm: searchTerm || null
            }
        }).then(deferred.resolve, deferred.reject);
        return deferred.promise;
    };

    this.getAllVisitByTourDetailIdAndVisitId = function (tourDetailId, visitId) {
        const deferred = $q.defer();
        $http({
            method: 'GET',
            url: API_GUIDE + 'find-all-booking-tour-visit-by-tour-detail-id-and-visit-id-for-guide',
            params: {
                tourDetailId: tourDetailId || null,
                visitId: visitId || null
            }
        }).then(deferred.resolve, deferred.reject);
        return deferred.promise;
    };
});
