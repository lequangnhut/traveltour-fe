travel_app.service('CustomersGoOnTourServiceAD', function ($http, $q) {
    let API = BASE_API + 'staff/booking-tour-customer/';

    this.getAll = (page, size, sortBy, sortDir, tourDetailId, searchTerm) => {
        const deferred = $q.defer();
        $http({
            method: 'GET',
            url: API + 'find-all-booking-tour-customer-by-tour-details-id',
            params: {
                page: page || 0,
                size: size || 10,
                sortBy: sortBy || 'id',
                sortDir: sortDir || 'DESC',
                tourDetailId: tourDetailId || null,
                searchTerm: searchTerm || null
            }
        }).then(deferred.resolve, deferred.reject);
        return deferred.promise;
    };

    this.findById = (id) => {
        const deferred = $q.defer();
        $http({
            method: 'GET',
            url: API + 'find-by-id/' + id
        }).then(deferred.resolve, deferred.reject);
        return deferred.promise;
    };

    this.createCustomer = (data) => {
        return $http({
            method: 'POST',
            url: API + 'create-booking-tour-customer',
            headers: {'Content-Type': undefined},
            data: data,
            transformRequest: angular.identity
        });
    };

    this.updateCustomer = (id, data) => {
        const deferred = $q.defer();
        $http({
            method: 'PUT',
            url: API + 'update-booking-tour-customer/' + id,
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

    this.deactivateCustomer = (id) => {
        const deferred = $q.defer();
        $http({
            method: 'DELETE',
            url: API + 'delete-booking-tour-customer/' + id
        }).then(function (response) {
            deferred.resolve(response);
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    this.checkExistPhone = (phone) => {
        return $http({
            method: 'GET',
            url: API + 'check-duplicate-phone/' + phone,
            param: 'phone' + phone
        })
    }

    this.updatePhone = (id, phone) => {
        return $http({
            method: 'PUT',
            url: API + 'update-booking-tour-customer-phone/' + id + '&' + phone
        })
    };

});
