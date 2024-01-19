travel_app.service('VisitLocationServiceAG', function ($http) {
    let API_VISIT = BASE_API + 'agent/visit/';

    this.findAllVisitType = function () {
        return $http({
            method: 'GET',
            url: API_VISIT + 'find-visit-type-for-register-agency'
        })
    }

    this.findByAgencyId = function (userId) {
        return $http({
            method: 'GET',
            url: API_VISIT + 'find-by-agency-id/' + userId
        })
    }

    this.registerVisit = function (dataVisit) {
        return $http({
            method: 'POST',
            url: API_VISIT + 'register-visit-location',
            headers: {
                'Content-Type': undefined
            },
            data: dataVisit,
            transformRequest: angular.identity
        })
    }
})