travel_app.service('StatisticalServiceAD', function ($http, $q) {

    let API_STATISTICAL = BASE_API + 'admin/statistical/';

    this.compareAmountUser = function () {
        return $http({
            method: 'GET',
            url: API_STATISTICAL + 'compare-amount-user'
        })
    };

    this.compareAmountAgent = function () {
        return $http({
            method: 'GET',
            url: API_STATISTICAL + 'compare-amount-agent'
        })
    };

    this.listFiveAgent = function () {
        return $http({
            method: 'GET',
            url: API_STATISTICAL + 'list-five-agencies'
        })
    };

    this.topThreeHotel = function () {
        return $http({
            method: 'GET',
            url: API_STATISTICAL + 'top-three-hotel'
        })
    };

    this.topThreeVehicle = function () {
        return $http({
            method: 'GET',
            url: API_STATISTICAL + 'top-three-vehicle'
        })
    };

    this.topThreeVisit = function () {
        return $http({
            method: 'GET',
            url: API_STATISTICAL + 'top-three-visit'
        })
    };

});
