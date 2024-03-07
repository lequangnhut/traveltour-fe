travel_app.service('TransportCusService', function ($http) {
    let API_TRANSPORT = BASE_API + 'customer/transport/'

    this.findAllTransportBrandCus = function (page, size) {
        return $http({
            method: 'GET',
            url: API_TRANSPORT + 'find-all-transport-brand',
            params: {
                page: page || 0,
                size: size || 10,
            }
        });
    };

    this.findAllTransportBrandByIdCus = function (brandId) {
        return $http({
            method: 'GET',
            url: API_TRANSPORT + 'find-transport-brand-by-id/' + brandId
        });
    };
})