travel_app.service('VisitLocationServiceAG', function ($http) {
    let API_VISIT = BASE_API + 'agent/visit/';

    this.findAllVisitType = function () {
        return $http({
            method: 'GET',
            url: API_VISIT + 'find-visit-type-for-register-agency'
        })
    }

    this.findAllByAgencyId = function (agencyId) {
        return $http({
            method: 'GET',
            url: API_VISIT + 'find-all-by-agency-id/' + agencyId
        })
    }

    this.findByVisitLocationId = function (visitLocationId) {
        return $http({
            method: 'GET',
            url: API_VISIT + 'find-by-visit-location-id/' + visitLocationId
        })
    }

    this.registerVisit = function (dataVisit, apiUrl) {
        return $http({
            method: 'POST',
            url: API_VISIT + apiUrl + '-visit-location',
            headers: {
                'Content-Type': undefined
            },
            data: dataVisit,
            transformRequest: angular.identity
        })
    }

    this.update = function (dataVisit) {
        return $http({
            method: 'PUT',
            url: API_VISIT + 'update-visit-location',
            headers: {
                'Content-Type': undefined
            },
            data: dataVisit,
            transformRequest: angular.identity
        })
    }

    this.delete = function (visitLocationId) {
        return $http({
            method: 'GET',
            url: API_VISIT + 'delete-visit-location/' + visitLocationId
        })
    }
})