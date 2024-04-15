travel_app.service('AgencyServiceAD', function ($http, $q) {
    let API_AGENCIES_AD = BASE_API + 'admin/agency/';

    /**
     * API show list bên doanh nghiệp đã được duyệt
     */
    this.findAllAgenciesByIsAcceptedAD = function (isActive, page, size, sortBy, sortDir, searchTerm) {
        const deferred = $q.defer();
        $http({
            method: 'GET',
            url: API_AGENCIES_AD + 'find-all-agency-accepted',
            params: {
                isActive: isActive,
                page: page || 0,
                size: size || 5,
                sortBy: sortBy || 'id',
                sortDir: sortDir || 'desc',
                searchTerm: searchTerm || ''
            }
        }).then(deferred.resolve, deferred.reject);
        return deferred.promise;
    };

    /**
     * API show list bên doanh nghiệp chờ được duyệt
     */
    this.findAllAgenciesByIsAcceptedWaitingAD = function (isAccepted, page, size, sortBy, sortDir, searchTerm) {
        const deferred = $q.defer();
        $http({
            method: 'GET',
            url: API_AGENCIES_AD + 'find-all-agency-waiting',
            params: {
                isAccepted: isAccepted,
                page: page || 0,
                size: size || 5,
                sortBy: sortBy || 'id',
                sortDir: sortDir || 'desc',
                searchTerm: searchTerm || ''
            }
        }).then(deferred.resolve, deferred.reject);
        return deferred.promise;
    };

    this.findAgenciesById = function (agenciesId) {
        return $http({
            method: 'GET',
            url: API_AGENCIES_AD + 'find-by-id/' + agenciesId
        })
    };

    this.countAllWaiting = function () {
        const deferred = $q.defer();
        $http({
            method: 'GET',
            url: API_AGENCIES_AD + 'count-all-agency-waiting'
        }).then(deferred.resolve, deferred.reject);
        return deferred.promise;
    };

    /**
     * API update loại
     */
    this.updateAgency = function (agenciesId, agenciesDto) {
        const deferred = $q.defer();
        $http({
            method: 'PUT',
            url: API_AGENCIES_AD + 'update-agency/' + agenciesId,
            data: agenciesDto,
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
    this.deleteAgency = function (agenciesId, noted) {
        const deferred = $q.defer();
        $http({
            method: 'DELETE',
            url: API_AGENCIES_AD + 'delete-agency/' + agenciesId,
            params: {
                noted: noted
            }
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
    this.restoreAgency = function (agenciesId) {
        const deferred = $q.defer();
        $http({
            method: 'PUT',
            url: API_AGENCIES_AD + 'restore-agency/' + agenciesId
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
    this.findById = function (agenciesId) {
        return $http({
            method: 'GET',
            url: API_AGENCIES_AD + 'find-agency-by-id/' + agenciesId
        })
    };

    this.acceptAgency = function (agenciesId) {
        const deferred = $q.defer();
        $http({
            method: 'PUT',
            url: API_AGENCIES_AD + 'accepted-agency/' + agenciesId
        }).then(function (response) {
            deferred.resolve(response);
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    this.deniedAgency = function (agenciesId, noted) {
        const deferred = $q.defer();
        $http({
            method: 'PUT',
            url: API_AGENCIES_AD + 'denied-agency/' + agenciesId,
            params: {
                noted: noted
            }
        }).then(function (response) {
            deferred.resolve(response);
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    this.checkExistPhone = function (phone) {
        return $http({
            method: 'GET',
            url: API_AGENCIES_AD + 'check-duplicate-phone/' + phone,
            param: 'phone' + phone
        })
    }

    this.checkExistTax = function (tax) {
        return $http({
            method: 'GET',
            url: API_AGENCIES_AD + 'check-duplicate-tax/' + tax,
            param: 'tax' + tax
        })
    }
});
