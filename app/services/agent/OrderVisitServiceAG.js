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

    this.findByOrderVisitId = function (orderVisitId) {
        return $http({
            method: 'GET',
            url: API_ORDER_VISIT + 'find-by-order-visit-id/' + orderVisitId
        })
    }

    this.findByVisitLocationId = function (visitLocationId) {
        return $http({
            method: 'GET',
            url: API_ORDER_VISIT + 'find-by-visit-location-id/' + visitLocationId
        })
    }

    this.findByVisitTicketId = function (visitTicketId) {
        return $http({
            method: 'GET',
            url: API_ORDER_VISIT + 'find-by-visit-ticket-id/' + visitTicketId
        })
    }

    this.create = function (orderVisitDto) {
        return $http({
            method: 'POST',
            url: API_ORDER_VISIT + 'create-order-visit',
            data: orderVisitDto
        })
    }

    this.update = function (orderVisitDto) {
        return $http({
            method: 'PUT',
            url: API_ORDER_VISIT + 'update-order-visit',
            data: orderVisitDto
        })
    }

    this.delete = function (orderVisitId) {
        return $http({
            method: 'GET',
            url: API_ORDER_VISIT + 'delete-order-visit/' + orderVisitId
        })
    }
})