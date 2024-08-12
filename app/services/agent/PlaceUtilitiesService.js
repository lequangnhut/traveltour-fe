travel_app.service("PlaceUtilitiesService", function ($http) {
    let API_PLACE_UTILITIES = BASE_API + 'agent/hotels';

    this.getListPlaceUtilities = function () {
        return $http({
            method: "GET",
            url: API_PLACE_UTILITIES + "/list-place-utilities"
        });
    };
})