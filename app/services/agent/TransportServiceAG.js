travel_app.service('TransportServiceAG', function ($http) {
    let API_TRANS = BASE_API + 'agent/transport/';

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