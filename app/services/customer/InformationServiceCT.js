travel_app.service('CustomerInfoServiceCT', function ($http, $q) {
    let API_INFO = BASE_API + 'customer/info/';

    this.findCustomerById = function (id) {
        const deferred = $q.defer();
        $http({
            method: 'GET',
            url: API_INFO + 'find-by-id/' + id
        }).then(deferred.resolve, deferred.reject);
        return deferred.promise;
    };

    /**
     * API update tour
     */
    this.updateTour = function (id, data) {
        return $http({
            method: 'PUT',
            url: API_INFO + 'update-info/' + id,
            data: data,
            headers: {'Content-Type': undefined},
            transformRequest: angular.identity
        });
    };
});
