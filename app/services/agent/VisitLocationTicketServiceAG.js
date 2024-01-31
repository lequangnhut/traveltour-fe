travel_app.service('VisitLocationTicketServiceAG', function ($http) {
    let API_VISIT_TICKET = BASE_API + 'agent/visit-location-ticket/';

    this.findAllVisitTicket = function (brandId, page, size, sortBy, sortDir, searchTerm) {
        return $http({
            method: 'GET',
            url: API_VISIT_TICKET + 'find-all-visit-ticket/' + brandId,
            params: {
                page: page || 0,
                size: size || 5,
                sortBy: sortBy || 'id',
                sortDir: sortDir || 'asc',
                searchTerm: searchTerm || ''
            }
        })
    }

    this.findByVisitLocationId = function (visitLocationId) {
        return $http({
            method: 'GET',
            url: API_VISIT_TICKET + 'find-all-by-visit-locationId/' + visitLocationId
        })
    }

    this.findByVisitTicketId = function (visitTicketId) {
        return $http({
            method: 'GET',
            url: API_VISIT_TICKET + 'find-by-visit-ticketId/' + visitTicketId
        })
    }

    this.create = function (dataTicket) {
        return $http({
            method: 'POST',
            url: API_VISIT_TICKET + 'create-visit-ticket',
            data: dataTicket
        })
    }

    this.update = function (dataTicket) {
        return $http({
            method: 'PUT',
            url: API_VISIT_TICKET + 'update-visit-ticket',
            data: dataTicket
        })
    }

    this.delete = function (visitTicketId) {
        return $http({
            method: 'GET',
            url: API_VISIT_TICKET + 'delete-visit-ticket/' + visitTicketId
        })
    }
})