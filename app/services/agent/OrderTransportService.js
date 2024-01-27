travel_app.service('OrderTransportService', function ($http) {
    let API_ORDER_TRANS = BASE_API + 'agent/order-transport/';

    this.findAllOrderTransport = function (brandId, page, size, sortBy, sortDir, searchTerm) {
        return $http({
            method: 'GET',
            url: API_ORDER_TRANS + 'find-all-order-transport/' + brandId,
            params: {
                page: page || 0,
                size: size || 5,
                sortBy: sortBy || 'id',
                sortDir: sortDir || 'asc',
                searchTerm: searchTerm || ''
            }
        })
    }

    this.findByOrderTransportId = function (orderTransId) {
        return $http({
            method: 'GET',
            url: API_ORDER_TRANS + 'find-by-orderTransId/' + orderTransId
        })
    }

    this.findScheduleByBrandId = function (transportBrandId) {
        return $http({
            method: 'GET',
            url: API_ORDER_TRANS + 'find-all-schedule-by-brandId/' + transportBrandId
        })
    }

    this.findScheduleByScheduleId = function (scheduleId) {
        return $http({
            method: 'GET',
            url: API_ORDER_TRANS + 'find-schedule-by-id/' + scheduleId
        })
    }

    this.create = function (orderTransportationsDto) {
        return $http({
            method: 'POST',
            url: API_ORDER_TRANS + 'create-order-transport',
            data: orderTransportationsDto
        })
    }

    this.update = function (orderTransportationsDto) {
        return $http({
            method: 'PUT',
            url: API_ORDER_TRANS + 'update-order-transport',
            data: orderTransportationsDto
        })
    }

    this.delete = function (orderTransportId) {
        return $http({
            method: 'GET',
            url: API_ORDER_TRANS + 'delete-order-transport/' + orderTransportId
        })
    }
})