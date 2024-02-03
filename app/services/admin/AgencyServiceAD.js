travel_app.service('AgencyServiceAD', function ($http, $q) {

    let API_TYPE = BASE_API + 'admin/agency/';

    /**
     * API show list
     */
    this.findAllType = function (page, size, sortBy, sortDir, searchTerm) {
        const deferred = $q.defer();
        $http({
            method: 'GET',
            url: API_TYPE + 'find-all-agency-accepted',
            params: {
                page: page || 0,
                size: size || 5,
                sortBy: sortBy || 'id',
                sortDir: sortDir || 'asc',
                searchTerm: searchTerm || ''
            }
        }).then(deferred.resolve, deferred.reject);
        return deferred.promise;
    };

    this.findAllTypeWaiting = function (page, size, sortBy, sortDir, searchTerm) {
        const deferred = $q.defer();
        $http({
            method: 'GET',
            url: API_TYPE + 'find-all-agency-waiting',
            params: {
                page: page || 0,
                size: size || 5,
                sortBy: sortBy || 'id',
                sortDir: sortDir || 'asc',
                searchTerm: searchTerm || ''
            }
        }).then(deferred.resolve, deferred.reject);
        return deferred.promise;
    };

    this.findAllTypeDenied = function (page, size, sortBy, sortDir, searchTerm) {
        const deferred = $q.defer();
        $http({
            method: 'GET',
            url: API_TYPE + 'find-all-agency-denied',
            params: {
                page: page || 0,
                size: size || 5,
                sortBy: sortBy || 'id',
                sortDir: sortDir || 'asc',
                searchTerm: searchTerm || ''
            }
        }).then(deferred.resolve, deferred.reject);
        return deferred.promise;
    };

    this.findAllTypeInactive = function (page, size, sortBy, sortDir, searchTerm) {
        const deferred = $q.defer();
        $http({
            method: 'GET',
            url: API_TYPE + 'find-all-agency-accepted-false',
            params: {
                page: page || 0,
                size: size || 5,
                sortBy: sortBy || 'id',
                sortDir: sortDir || 'asc',
                searchTerm: searchTerm || ''
            }
        }).then(deferred.resolve, deferred.reject);
        return deferred.promise;
    };

    this.findAgencieById = function (id) {
        return $http({
            method: 'GET',
            url: API_TYPE + 'find-by-id/' + id
        })
    };

    this.countAllWaiting = function () {
        const deferred = $q.defer();
        $http({
            method: 'GET',
            url: API_TYPE + 'count-all-agency-waiting'
        }).then(deferred.resolve, deferred.reject);
        return deferred.promise;
    };

    /**
     * API update loại
     */
    this.updateAgency = function (id, tourData) {
        const deferred = $q.defer();
        $http({
            method: 'PUT',
            url: API_TYPE + 'update-agency/' + id,
            data: tourData,
            headers: {'Content-Type': undefined},
            transformRequest: angular.identity
        }).then(function (response) {
            deferred.resolve(response);
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    /**
     * API delete loại
     */
    this.deleteAgency = function (id) {
        const deferred = $q.defer();
        $http({
            method: 'DELETE',
            url: API_TYPE + 'delete-agency/' + id
        }).then(function (response) {
            deferred.resolve(response);
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    /**
     * API khôi phục bằng id
     */
    this.restoreAgency = function (id) {
        const deferred = $q.defer();
        $http({
            method: 'PUT',
            url: API_TYPE + 'restore-agency/' + id
        }).then(function (response) {
            deferred.resolve(response);
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    /**
     * API tìm bằng id
     */
    this.findById = function (id) {
        return $http({
            method: 'GET',
            url: API_TYPE + 'find-agency-by-id/' + id
        })
    };

    this.checkTypeIsWorking = function (id) {
        return $http({
            method: 'GET',
            url: API_TYPE + 'check-bed-type-working/' + id,
            param: 'id' + id
        })
    }

    this.checkExistPhone = function (phone) {
        return $http({
            method: 'GET',
            url: API_TYPE + 'check-duplicate-phone/' + phone,
            param: 'phone' + phone
        })
    }

    this.checkExistTax = function (tax) {
        return $http({
            method: 'GET',
            url: API_TYPE + 'check-duplicate-tax/' + tax,
            param: 'tax' + tax
        })
    }

    this.acceptAgency = function (id) {
        const deferred = $q.defer();
        $http({
            method: 'PUT',
            url: API_TYPE + 'accepted-agency/' +  id,
        }).then(function (response) {
            deferred.resolve(response);
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    this.deniedAgency = function (id) {
        const deferred = $q.defer();
        $http({
            method: 'PUT',
            url: API_TYPE + 'denied-agency/' +  id,
        }).then(function (response) {
            deferred.resolve(response);
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };
});
