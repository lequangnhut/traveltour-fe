travel_app.service('PostServiceAD', function ($http, $q) {

    let API_POST = BASE_API + 'admin/post/';

    /** HOTEL*/
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
                isAccepted: isAccepted || truef
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

    this.deniedHotel = function (id) {
        return $http({
            method: 'PUT',
            url: API_POST + 'denied-hotel-post/' + id
        })
    };

    this.acceptHotel = function (id) {
        return $http({
            method: 'PUT',
            url: API_POST + 'accepted-hotel-post/' + id
        })
    };

    this.deniedRoom = function (id) {
        return $http({
            method: 'PUT',
            url: API_POST + 'denied-room-post/' + id
        })
    };

    this.acceptRoom = function (id) {
        return $http({
            method: 'PUT',
            url: API_POST + 'accepted-room-post/' + id
        })
    };

    /** TRANSPORTATION*/
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

    this.deniedBrand = function (id) {
        return $http({
            method: 'PUT',
            url: API_POST + 'denied-brand-post/' + id
        })
    };

    this.acceptBrand = function (id) {
        return $http({
            method: 'PUT',
            url: API_POST + 'accepted-brand-post/' + id
        })
    };

    this.deniedTrans = function (id) {
        return $http({
            method: 'PUT',
            url: API_POST + 'denied-trans-post/' + id
        })
    };

    this.acceptTrans = function (id) {
        return $http({
            method: 'PUT',
            url: API_POST + 'accepted-trans-post/' + id
        })
    };

    this.deniedSchedules = function (id) {
        return $http({
            method: 'PUT',
            url: API_POST + 'denied-schedule-post/' + id
        })
    };

    this.acceptSchedules = function (id) {
        return $http({
            method: 'PUT',
            url: API_POST + 'accepted-schedule-post/' + id
        })
    };

    /**VISIT*/
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

    this.deniedVisit = function (id) {
        return $http({
            method: 'PUT',
            url: API_POST + 'denied-visit-post/' + id
        })
    };

    this.acceptVisit = function (id) {
        return $http({
            method: 'PUT',
            url: API_POST + 'accepted-visit-post/' + id
        })
    };

    this.transUtility = function (id) {
        return $http({
            method: 'GET',
            url: API_POST + 'find-trans-utility/' + id
        })
    };


});
