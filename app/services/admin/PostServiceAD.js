travel_app.service('PostServiceAD', function ($http, $q) {

    let API_POST = BASE_API + 'admin/post/';

    /**
     * API show list
     */
    this.findAllHotel = function (page, size, sortBy, sortDir, isAccepted, searchTerm) {
        const deferred = $q.defer();
        $http({
            method: 'GET',
            url: API_POST + 'all-hotel-post',
            params: {
                page: page || 0,
                size: size || 5,
                sortBy: sortBy || 'id',
                sortDir: sortDir || 'asc',
                searchTerm: searchTerm || '',
                isAccepted: isAccepted || true
            }
        }).then(deferred.resolve, deferred.reject);
        return deferred.promise;
    };

    this.getRoomTypes = function (page, size, sortBy, sortDir, isActive, searchTerm, hotelId) {
        const deferred = $q.defer();

        $http({
            method: 'GET',
            url: API_POST + 'find-room-by-hotelId/' + hotelId,
            params: {
                page: page || 0,
                size: size || 5,
                sortBy: sortBy || 'id',
                sortDir: sortDir || 'asc',
                searchTerm: searchTerm || '',
                isActive: isActive || 1,
                hotelId: hotelId
            }
        }).then(deferred.resolve, deferred.reject);
        return deferred.promise;
    };

    this.findAllTrans = function (page, size, sortBy, sortDir, isAccepted, searchTerm) {
        const deferred = $q.defer();
        $http({
            method: 'GET',
            url: API_POST + 'all-brand-post',
            params: {
                page: page || 0,
                size: size || 5,
                sortBy: sortBy || 'id',
                sortDir: sortDir || 'asc',
                searchTerm: searchTerm || '',
                isAccepted: isAccepted || true
            }
        }).then(deferred.resolve, deferred.reject);
        return deferred.promise;
    };

    this.getTrans = function (page, size, sortBy, sortDir, isActive, searchTerm, brandId) {
        const deferred = $q.defer();

        $http({
            method: 'GET',
            url: API_POST + 'find-trans-by-brandId/' + brandId,
            params: {
                page: page || 0,
                size: size || 5,
                sortBy: sortBy || 'id',
                sortDir: sortDir || 'asc',
                searchTerm: searchTerm || '',
                isActive: isActive || 1,
                brandId: brandId
            }
        }).then(deferred.resolve, deferred.reject);
        return deferred.promise;
    };

    this.getTrips = function (page, size, sortBy, sortDir, isActive, searchTerm, transId) {
        const deferred = $q.defer();

        $http({
            method: 'GET',
            url: API_POST + 'find-trip-by-transId/' + transId,
            params: {
                page: page || 0,
                size: size || 5,
                sortBy: sortBy || 'id',
                sortDir: sortDir || 'asc',
                searchTerm: searchTerm || '',
                isActive: isActive || 1,
                transId: transId
            }
        }).then(deferred.resolve, deferred.reject);
        return deferred.promise;
    };

    this.findAllVisit = function (page, size, sortBy, sortDir, isAccepted, searchTerm) {
        const deferred = $q.defer();
        $http({
            method: 'GET',
            url: API_POST + 'all-visit-post',
            params: {
                page: page || 0,
                size: size || 5,
                sortBy: sortBy || 'id',
                sortDir: sortDir || 'asc',
                searchTerm: searchTerm || '',
                isAccepted: isAccepted || true
            }
        }).then(deferred.resolve, deferred.reject);
        return deferred.promise;
    };

});
