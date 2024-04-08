travel_app.service('RequestCarServiceAD', function ($http) {
    let API_REQUEST_CAR = BASE_API + 'staff/request-car/';

    this.findAllRequestCarService = function (page, size, sortBy, sortDir) {
        return $http({
            method: 'GET',
            url: API_REQUEST_CAR + 'find-all-request-car',
            params: {
                page: page || 0,
                size: size || 10,
                sortBy: sortBy || 'id',
                sortDir: sortDir || 'desc',
            }
        });
    };

    this.findAllRequestCarDetailService = function (requestCarId, page, size, sortBy, sortDir) {
        return $http({
            method: 'GET',
            url: API_REQUEST_CAR + 'find-all-request-car-detail',
            params: {
                requestCarId: requestCarId,
                page: page || 0,
                size: size || 10,
                sortBy: sortBy || 'id',
                sortDir: sortDir || 'desc',
            }
        });
    };

    this.findAllTourDetailUseRequestCarService = function () {
        return $http({
            method: 'GET',
            url: API_REQUEST_CAR + 'find-all-tour-detail-use-request-car'
        });
    };

    this.findRequestCarById = function (requestCarId) {
        return $http({
            method: 'GET',
            url: API_REQUEST_CAR + 'find-request-car-by-id/' + requestCarId
        });
    }

    this.createRequestCarService = function (requestCarDto) {
        return $http({
            method: 'POST',
            url: API_REQUEST_CAR + 'create-request-car',
            data: requestCarDto
        });
    };

    this.updateRequestCarService = function (requestCarDto) {
        return $http({
            method: 'PUT',
            url: API_REQUEST_CAR + 'update-request-car',
            data: requestCarDto
        });
    };

    this.acceptRequestCarService = function (formData) {
        return $http({
            method: 'POST',
            url: API_REQUEST_CAR + 'accept-request-car',
            headers: {'Content-Type': undefined},
            data: formData
        });
    };
})