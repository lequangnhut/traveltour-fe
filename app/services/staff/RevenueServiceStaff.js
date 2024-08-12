travel_app.service('RevenueServiceStaff', function ($http, $q) {
    let API = BASE_API + 'staff/revenue/';

    this.getAllRevenueYear4 = () => {
        const deferred = $q.defer();
        $http({
            method: 'GET',
            url: API + 'find-all-revenue',
        }).then(deferred.resolve, deferred.reject);
        return deferred.promise;
    };

    this.getAllRevenueByTourTypeIdAndYear = (tourTypeId, year) => {
        const deferred = $q.defer();
        $http({
            method: 'GET',
            url: API + `find-all-revenue-by-tourTypeId-and-year`,
            params: {tourTypeId: tourTypeId, year: year}
        }).then(function (response) {
            deferred.resolve(response);
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    this.getAllYear = () => {
        const deferred = $q.defer();
        $http({
            method: 'GET',
            url: API + `get-all-year`,
        }).then(function (response) {
            deferred.resolve(response);
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

});
