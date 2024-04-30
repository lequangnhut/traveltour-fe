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

    this.findAllRequestCarFilters = function (page, size, sortBy, sortDir, filters) {
        return $http({
            method: 'GET',
            url: API_REQUEST_CAR + 'find-all-request-car-filters',
            params: {
                page: page || 0,
                size: size || 10,
                sortBy: sortBy || 'id',
                sortDir: sortDir || 'desc',
                fromLocation: filters.fromLocation || null,
                toLocation: filters.toLocation || null,
                dateOfDepartment: filters.dateOfDepartment || null,
                returnDay: filters.returnDay || null,
                mediaTypeList: filters.mediaTypeList === [] ? null : filters.mediaTypeList,
                listOfVehicleManufacturers: filters.listOfVehicleManufacturers === [] ? null : filters.listOfVehicleManufacturers,
                seatTypeList: filters.seatTypeList === [] ? null : filters.seatTypeList
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

    this.checkExitsTourDetail = function (tourDetailId) {
        return $http({
            method: 'GET',
            url: API_REQUEST_CAR + 'check-exits-tour-detail',
            params: {
                tourDetailId: tourDetailId,
            }
        });
    }

    this.findRequestCarDetailSubmittedService = function (transportationScheduleId) {
        return $http({
            method: 'GET',
            url: API_REQUEST_CAR + 'find-request-car-detail-submitted',
            params: {
                transportationScheduleId: transportationScheduleId,
            }
        });
    }

    this.findCarSubmittedService = function (requestCarId, transportationScheduleId) {
        return $http({
            method: 'GET',
            url: API_REQUEST_CAR + 'find-car-submitted',
            params: {
                requestCarId: requestCarId,
                transportationScheduleId: transportationScheduleId,
            }
        });
    }

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