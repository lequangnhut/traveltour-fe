travel_app.service('SchedulesServiceAG', function ($http) {
    let API_SCHEDULE = BASE_API + 'agent/transportation-schedules/';

    this.findAllByTripType = function (transportBrandId, tripType, page, size, sortBy, sortDir, searchTerm) {
        return $http({
            method: 'GET',
            url: API_SCHEDULE + 'find-all-schedule-by-trip-type/' + tripType,
            params: {
                transportBrandId: transportBrandId,
                page: page || 0,
                size: size || 5,
                sortBy: sortBy || 'id',
                sortDir: sortDir || 'desc',
                searchTerm: searchTerm || ''
            }
        })
    }

    this.findAllScheduleByTransportId = function (transportId) {
        return $http({
            method: 'GET',
            url: API_SCHEDULE + 'find-all-transport-by-transport-brandId/' + transportId
        })
    }

    this.findByScheduleId = function (scheduleId) {
        return $http({
            method: 'GET',
            url: API_SCHEDULE + 'find-schedule-by-scheduleId/' + scheduleId
        })
    }

    this.findTransportByTransportId = function (transportId) {
        return $http({
            method: 'GET',
            url: API_SCHEDULE + 'find-transport-by-transportId/' + transportId
        })
    }

    this.create = function (scheduleDto) {
        return $http({
            method: 'POST',
            url: API_SCHEDULE + 'create-schedule',
            data: scheduleDto,
        })
    }

    this.update = function (scheduleDto) {
        return $http({
            method: 'PUT',
            url: API_SCHEDULE + 'update-schedule',
            data: scheduleDto
        })
    }

    this.delete = function (scheduleId) {
        return $http({
            method: 'GET',
            url: API_SCHEDULE + 'delete-schedule/' + scheduleId
        })
    }

    this.checkDuplicateSchedule = function (transportId, departureTime, arrivalTime) {
        return $http({
            method: 'GET',
            url: API_SCHEDULE + 'check-duplicate-schedules',
            params: {
                transportId: transportId,
                departureTime: departureTime,
                arrivalTime: arrivalTime
            }
        })
    }
})