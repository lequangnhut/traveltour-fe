travel_app.service('TransportBrandServiceAG', function ($http) {
    let API_TRANS_BRAND = BASE_API + 'agent/transport-brand/';

    this.findAllByAgencyId = function (agencyId) {
        return $http({
            method: 'GET',
            url: API_TRANS_BRAND + 'find-all-transport-brand/' + agencyId
        })
    }

    this.registerTransport = function (dataTrans, apiUrl) {
        return $http({
            method: 'POST',
            url: API_TRANS_BRAND + apiUrl + '-transport',
            headers: {'Content-Type': undefined},
            data: dataTrans,
            transformRequest: angular.identity
        })
    }
})