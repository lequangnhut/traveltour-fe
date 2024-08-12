travel_app.service("HotelTypeService", function ($http) {
    let API_HOTEL_TYPE = BASE_API + 'agent/hotel-type';

    this.getListHotelType = function () {
       return $http({
           method: "GET",
           url: API_HOTEL_TYPE + "/list-hotel-type",
        })
    }

    this.getListPlaceUtilities = function () {
        return $http({
            method: "GET",
            url: API_PLACE_UTILITIES + "/list-place-utilities"
        });
    };
})