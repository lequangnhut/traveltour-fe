travel_app.service('RevenueServiceAD', function ($http, $q) {

    let API_ADMIN_REVENUE = BASE_API + 'admin/revenue/';

    this.countAll = function () {
        return $http({
            method: 'GET',
            url: API_ADMIN_REVENUE + 'count-all'
        })
    };
});
