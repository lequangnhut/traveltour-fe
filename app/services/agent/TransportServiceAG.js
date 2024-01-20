travel_app.service('TransportServiceAG', function ($http) {
    let API_TRANS = BASE_API + 'agent/transport/';

    this.findByAgencyId = function (userId) {
        return $http({
            method: 'GET',
            url: API_TRANS + 'find-by-agency-id/' + userId
        })
    }

    this.registerTransport = function (dataTrans) {
        return $http({
            method: 'POST',
            url: API_TRANS + 'register-transport',
            headers: {'Content-Type': undefined},
            data: dataTrans,
            transformRequest: angular.identity
        })
    }
})