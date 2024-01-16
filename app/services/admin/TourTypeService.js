travel_app.service('TourTypeService', function ($http) {

    let API_TYPE = BASE_API + 'type/';

    /**
     * @message API register account
     */
    this.listTourType = function () {
        return $http({
            method: 'GET',
            url: API_TYPE + 'tour-type'
        })
    };

});
