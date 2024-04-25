travel_app.service('StatisticalVisitServiceAG', function ($http) {
    let API_AGENCIES = BASE_API + 'agent/visitLocation/statistical/';

    this.statisticsClassifyingAdultAndChildTickets = (year, visitId) => {
        return $http({
            method: 'GET',
            url: API_AGENCIES + 'statisticsClassifyingAdultAndChildTickets',
            params: {year, visitId}
        })
    }

    this.statisticalBookingVisitLocation = (year, visitId) => {
        return $http({
            method: 'GET',
            url: API_AGENCIES + 'statisticalBookingVisitLocation',
            params: {year, visitId}
        })
    }

    this.getRevenueOfTouristAttractions = (year, visitId) => {
        return $http({
            method: 'GET',
            url: API_AGENCIES + 'getRevenueOfTouristAttractions',
            params: {year, visitId}
        })
    }

    this.getAllOrderVisitYear = () => {
        return $http({
            method: 'GET',
            url: API_AGENCIES + 'getAllOrderVisitYear',
        })
    }
})