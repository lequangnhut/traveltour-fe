travel_app.service('TransportBrandServiceAG', function ($http) {
    let API_TRANS_BRAND = BASE_API + 'agent/transport-brand/';

    this.findAllByAgencyId = function (agencyId) {
        return $http({
            method: 'GET',
            url: API_TRANS_BRAND + 'find-all-transport-brand/' + agencyId
        })
    }

    this.findByTransportBrandId = function (brandId) {
        return $http({
            method: 'GET',
            url: API_TRANS_BRAND + 'find-by-transport-brand-id/' + brandId
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

    this.update = function (dataTrans) {
        return $http({
            method: 'PUT',
            url: API_TRANS_BRAND + 'update-transport',
            headers: {'Content-Type': undefined},
            data: dataTrans,
            transformRequest: angular.identity
        })
    }

    this.delete = function (transportBrandId) {
        return $http({
            method: 'GET',
            url: API_TRANS_BRAND + 'delete-transport/' + transportBrandId
        })
    }
})