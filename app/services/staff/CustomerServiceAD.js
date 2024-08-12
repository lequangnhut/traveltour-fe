travel_app.service('CustomerServiceAD', function ($http, $q) {
    let API_CUSTOMER = BASE_API + 'super-admin/account-customer/';

    this.getAllCustomer = function (page, size, sortBy, sortDir, searchTerm) {
        const deferred = $q.defer();
        $http({
            method: 'GET',
            url: API_CUSTOMER + 'find-role-customer',
            params: {
                page: page || 0,
                size: size || 10,
                sortBy: sortBy || 'dateCreated',
                sortDir: sortDir || 'DESC',
                searchTerm: searchTerm || ''
            }
        }).then(deferred.resolve, deferred.reject);
        return deferred.promise;
    };

    this.findCustomerById = function (id) {
        const deferred = $q.defer();
        $http({
            method: 'GET',
            url: API_CUSTOMER + 'find-by-id/' + id
        }).then(deferred.resolve, deferred.reject);
        return deferred.promise;
    };

    this.createCustomer = function (data) {
        return $http({
            method: 'POST',
            url: API_CUSTOMER + 'create-account-customer',
            headers: {'Content-Type': undefined},
            data: data,
            transformRequest: angular.identity
        });
    };

    this.updateCustomer = function (id, data) {
        const deferred = $q.defer();
        $http({
            method: 'PUT',
            url: API_CUSTOMER + 'update-account-customer/' + id,
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

    this.deactivateCustomer = function (id) {
        const deferred = $q.defer();
        $http({
            method: 'DELETE',
            url: API_CUSTOMER + 'delete-account-customer/' + id
        }).then(function (response) {
            deferred.resolve(response);
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    /** Từ đây của thuynhdpc04763 */
    this.updatePhone = function (id, phone) {
        return $http({
            method: 'PUT',
            url: API_CUSTOMER + 'update-customer-phone/' + id + '&' + phone
        })
    };

    this.checkCorrectCurrentPass = function (id, currentPass) {
        return $http({
            method: 'GET',
            url: API_CUSTOMER + 'check-current-password/' + id + '&' + currentPass,
            param: 'currentPass' + currentPass
        })
    }

    this.updatePass = function (id, data) {
        return $http({
            method: 'PUT',
            url: API_CUSTOMER + 'update-pass/' + id ,
            data: data
        })
    };
});
