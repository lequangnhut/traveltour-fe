travel_app.service('AgenciesServiceAG', function ($http) {
    let API_AGENCIES = BASE_API + 'agent/agencies/';

    this.findByUserId = function (userId) {
        return $http({
            method: 'GET',
            url: API_AGENCIES + 'find-by-user-id/' + userId
        })
    }

    this.registerBusiness = function (dataAgencies) {
        return $http({
            method: 'PUT',
            url: API_AGENCIES + 'register-business',
            headers: {'Content-Type': undefined},
            data: dataAgencies,
            transformRequest: angular.identity
        })
    }
})