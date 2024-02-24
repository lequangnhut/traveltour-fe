travel_app.service('NotificationsServiceAD', function ($http, $q) {

    let API_NOTEAGENCY = BASE_API + 'notification-register/';

    /**
     * API show list
     */
    this.findAllNote = function () {
        return $http({
            method: 'GET',
            url: API_NOTEAGENCY + 'findAll'
        })
    };

    this.deleteNote = function (id) {
        return $http({
            method: 'DELETE',
            url: API_NOTEAGENCY + 'deleteNoted/' + id
        })
    };

    this.seenNote = function (id) {
        return $http({
            method: 'PUT',
            url: API_NOTEAGENCY + 'updateIsSeen/' + id
        })
    };

});
