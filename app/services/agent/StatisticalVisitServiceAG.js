travel_app.service('StatisticalVisitServiceAG', function ($http) {
    let API_AGENCIES = BASE_API + 'agent/agencies/';

    this.findByUserId = function (userId) {
        return $http({
            method: 'GET',
            url: API_AGENCIES + 'find-by-user-id/' + userId
        })
    }

})