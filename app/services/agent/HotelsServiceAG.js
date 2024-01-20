travel_app.service('HotelServiceAG', function ($http) {
    let API_HOTELS = BASE_API + 'agent/hotels/';

    this.findByAgencyId = function (userId) {
        return $http({
            method: 'GET',
            url: API_HOTELS + 'find-by-agency-id/' + userId
        })
    }
})