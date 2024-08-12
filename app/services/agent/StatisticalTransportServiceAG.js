travel_app.service('StatisticalTransportServiceAG', function ($http) {
    let API_AGENCIES = BASE_API + 'agent/transport/statistical/';

    this.findStatisticalBookingTransport = (year, transportId) => {
        return $http({
            method: 'GET',
            url: API_AGENCIES + 'findStatisticalBookingTransport',
            params: {year, transportId}
        })
    }

    this.statisticalTransportBrand = (year, transportId) => {
        return $http({
            method: 'GET',
            url: API_AGENCIES + 'statisticalTransportBrand',
            params: {year, transportId}
        })
    }

    this.findTransportRevenueStatistics = (year, transportId) => {
        return $http({
            method: 'GET',
            url: API_AGENCIES + 'findTransportRevenueStatistics',
            params: {year, transportId}
        })
    }

        this.findAllOrderTransportYear = () => {
        return $http({
            method: 'GET',
            url: API_AGENCIES + 'findAllOrderTransportYear',
        })
    }

})