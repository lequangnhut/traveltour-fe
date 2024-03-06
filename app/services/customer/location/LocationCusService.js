travel_app.service('LocationCusService', function ($http) {

    let API_LOCATION = BASE_API + 'customer/location/';

    this.findAllLocationCus = function (page, size, searchTerm) {
        return $http({
            method: 'GET',
            url: API_LOCATION + 'find-all-location',
            params: {
                page: page || 0,
                size: size || 10,
                searchTerm: searchTerm
            }
        });
    }

    this.findAllLocationTypeCus = function () {
        return $http({
            method: 'GET',
            url: API_LOCATION + 'find-all-location-type'
        });
    }
})