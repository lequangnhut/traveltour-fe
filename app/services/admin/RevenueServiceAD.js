travel_app.service('RevenueServiceAD', function ($http, $q) {

    let API_ADMIN_REVENUE = BASE_API + 'admin/revenue/';

    this.countAll = function () {
        return $http({
            method: 'GET',
            url: API_ADMIN_REVENUE + 'count-all'
        })
    };

    this.revenueOf12MonthsOfTheYearFromTourBooking = function (year) {
        return $http({
            method: 'GET',
            url: API_ADMIN_REVENUE + '12-month-of-year',
            params: {year: year}
        })
    };

    this.getAllYear = () => {
        const deferred = $q.defer();
        $http({
            method: 'GET',
            url: API_ADMIN_REVENUE + `get-all-year`,
        }).then(function (response) {
            deferred.resolve(response);
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };
});
