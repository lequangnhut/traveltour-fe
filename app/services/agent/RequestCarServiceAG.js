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

    this.findAllHistoryRequestCarServiceAgent = function (transportBrandId, acceptedRequest, page, size, sortBy, sortDir) {
        return $http({
            method: 'GET',
            url: API_REQUEST_CAR + 'find-all-history-request-car',
            params: {
                transportBrandId: transportBrandId,
                acceptedRequest: acceptedRequest,
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

    this.findCarIsSubmittedServiceAgent = function (transportationScheduleId) {
        return $http({
            method: 'GET',
            url: API_REQUEST_CAR + 'find-car-is-submitted',
            params: {
                transportationScheduleId: transportationScheduleId
            }
        });
    }

    this.findAllTransportScheduleServiceByBrandId = function (transportBrandId) {
        return $http({
            method: 'GET',
            url: API_REQUEST_CAR + 'find-all-transport-schedule-by-transport-brand-id/' + transportBrandId
        })
    }

    this.submitRequestCarDetail = function (requestCarDetailDto) {
        return $http({
            method: 'POST',
            url: API_REQUEST_CAR + 'submit-request-car-to-staff',
            data: requestCarDetailDto
        })
    }

    this.cancelRequestCarDetail = function (requestCarDetailId, transportationScheduleId) {
        return $http({
            method: 'POST',
            url: API_REQUEST_CAR + 'cancel-request-car-to-staff',
            params: {
                requestCarDetailId: requestCarDetailId,
                transportationScheduleId: transportationScheduleId
            }
        })
    }
})