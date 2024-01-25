travel_app.service('TransportServiceAG', function ($http) {
    let API_TRANS = BASE_API + 'agent/transportation/';

    this.findAllTransport = function (brandId, page, size, sortBy, sortDir, searchTerm) {
        return $http({
            method: 'GET',
            url: API_TRANS + 'find-all-transportation/' + brandId,
            params: {
                page: page || 0,
                size: size || 5,
                sortBy: sortBy || 'id',
                sortDir: sortDir || 'asc',
                searchTerm: searchTerm || ''
            }
        })
    }

    this.findByTransportId = function (transportId) {
        return $http({
            method: 'GET',
            url: API_TRANS + 'find-by-transportation-id/' + transportId
        })
    }

    this.findByTransportBrandId = function (transportBrandId) {
        return $http({
            method: 'GET',
            url: API_TRANS + 'find-by-transport-brandId/' + transportBrandId
        })
    }

    this.findByLicensePlate = function (licensePlate) {
        return $http({
            method: 'GET',
            url: API_TRANS + 'check-duplicate-license-plate/' + licensePlate
        })
    }

    this.findAllTransportType = function () {
        return $http({
            method: 'GET',
            url: API_TRANS + 'find-all-transportation-type'
        })
    }

    this.findByTransportTypeId = function (transportTypeId) {
        return $http({
            method: 'GET',
            url: API_TRANS + 'find-by-transport-type-id/' + transportTypeId
        })
    }

    this.create = function (transportationsDto) {
        return $http({
            method: 'POST',
            url: API_TRANS + 'create-transportation',
            data: transportationsDto
        })
    }

    this.update = function (transportationsDto) {
        return $http({
            method: 'PUT',
            url: API_TRANS + 'update-transportation',
            data: transportationsDto
        })
    }

    this.delete = function (transportId) {
        return $http({
            method: 'GET',
            url: API_TRANS + 'delete-transportation/' + transportId
        })
    }
})