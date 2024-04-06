travel_app.service('RequestCarServiceAG', function ($http) {
    let API_REQUEST_CAR = BASE_API + 'agent/request-car/';

    this.findAllRequestCarServiceAgent = function (page, size, sortBy, sortDir) {
        return $http({
            method: 'GET',
            url: API_REQUEST_CAR + 'find-all-request-car',
            params: {
                page: page || 0,
                size: size || 10,
                sortBy: sortBy || 'id',
                sortDir: sortDir || 'desc',
            }
        })
    }

    this.findRequestCarByIdServiceAgent = function (requestCarId) {
        return $http({
            method: 'GET',
            url: API_REQUEST_CAR + 'find-request-car-by-id/' + requestCarId
        })
    }

    this.findRequestCarSubmittedServiceAgent = function (requestCarId, transportBrandId) {
        return $http({
            method: 'GET',
            url: API_REQUEST_CAR + 'find-request-car-submitted',
            params: {
                requestCarId: requestCarId,
                transportBrandId: transportBrandId
            }
        });
    }

    this.findAllTransportServiceByBrandId = function (transportBrandId) {
        return $http({
            method: 'GET',
            url: API_REQUEST_CAR + 'find-all-transport-by-transport-brand-id/' + transportBrandId
        })
    }

    this.submitRequestCarDetail = function (requestCarDetailDto) {
        return $http({
            method: 'POST',
            url: API_REQUEST_CAR + 'submit-request-car-to-staff',
            data: requestCarDetailDto
        })
    }
})