travel_app.service('TransportBrandServiceAG', function ($http) {
    let API_TRANS_BRAND = BASE_API + 'agent/transport-brand/';

    this.findByAgencyId = function (userId) {
        return $http({
            method: 'GET',
            url: API_TRANS_BRAND + 'find-by-agency-id/' + userId
        })
    }

    this.registerTransport = function (dataTrans) {
        return $http({
            method: 'POST',
            url: API_TRANS_BRAND + 'register-transport',
            headers: {'Content-Type': undefined},
            data: dataTrans,
            transformRequest: angular.identity
        })
    }
})