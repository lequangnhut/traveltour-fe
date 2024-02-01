travel_app.service("OrderVisitServiceAG", function ($http) {
    let API_ORDER_VISIT = BASE_API + "agent/order-visit/"

    this.findAllOrderVisit = function (brandId, page, size, sortBy, sortDir, searchTerm) {
        return $http({
            method: 'GET',
            url: API_ORDER_VISIT + 'find-all-order-visit/' + brandId,
            params: {
                page: page || 0,
                size: size || 5,
                sortBy: sortBy || 'id',
                sortDir: sortDir || 'asc',
                searchTerm: searchTerm || ''
            }
        })
    }

    this.findAllVisitLocation = function (brandId) {
        return $http({
            method: 'GET',
            url: API_ORDER_VISIT + 'find-all-visit-location/' + brandId
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