travel_app.service('StatisticalHotelServiceAG', function ($http) {
    let API_AGENCIES = BASE_API + 'agent/hotel/';

    this.statisticalBookingHotel = (year, hotelId) => {
        return $http({
            method: 'GET',
            url: API_AGENCIES + 'statistical/statisticalBookingHotel',
            params: {year, hotelId}
        })
    }
    this.statisticalRoomTypeHotel = (year, hotelId) => {
        return $http({
            method: 'GET',
            url: API_AGENCIES + 'statistical/statisticalRoomTypeHotel',
            params: {year, hotelId}
        })
    }
    this.getHotelRevenueStatistics = (year, hotelId) => {
        return $http({
            method: 'GET',
            url: API_AGENCIES + 'statistical/hotelRevenueStatistics',
            params: {year, hotelId}
        })
    }

    this.getAllOrderYear = () => {
        return $http({
            method: 'GET',
            url: API_AGENCIES + 'statistical/getAllHotelYearPie',
        })
    }

})