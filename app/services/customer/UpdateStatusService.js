travel_app.service('UpdateStatusService', function ($http) {
    let API_UPDATE_STATUS = BASE_API + 'update-auto/';

    this.updateOtpStatus = function () {
        return $http({
            method: 'GET',
            url: API_UPDATE_STATUS + 'forgot-token-false'
        })
    }

    this.updateTourDetailsStatus = function () {
        return $http({
            method: 'GET',
            url: API_UPDATE_STATUS + 'tour-details-status'
        })
    }

    this.updateSchedulesStatus = function () {
        return $http({
            method: 'GET',
            url: API_UPDATE_STATUS + 'transportation-schedules-status'
        })
    }

});
