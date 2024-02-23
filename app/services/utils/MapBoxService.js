travel_app.service('MapBoxService', function ($http) {

    this.geocodeAddress = function (address, callback) {
        let accessToken = 'pk.eyJ1IjoicW5odXQxNyIsImEiOiJjbHN5aXk2czMwY2RxMmtwMjMxcGE1NXg4In0.iUd6-sHYnKnhsvvFuuB_bA';
        let url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + encodeURIComponent(address) + '.json?access_token=' + accessToken;

        $http.get(url)
            .then(function (response) {
                let data = response.data;
                if (data.features.length > 0) {
                    let coordinates = data.features[0].geometry.coordinates;
                    callback(null, coordinates);
                } else {
                    callback("Không tìm thấy địa chỉ.", null);
                }
            })
            .catch(function (error) {
                callback(error, null);
            });
    };

    this.geocodeAddressGetKilometer = function (address) {
        let accessToken = 'pk.eyJ1IjoicW5odXQxNyIsImEiOiJjbHN5aXk2czMwY2RxMmtwMjMxcGE1NXg4In0.iUd6-sHYnKnhsvvFuuB_bA';
        let url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + encodeURIComponent(address) + '.json?access_token=' + accessToken;

        return $http.get(url)
            .then(function (response) {
                let data = response.data;
                if (data.features.length > 0) {
                    let coords = data.features[0].geometry.coordinates;
                    return {lat: coords[1], lng: coords[0]};
                } else {
                    throw new Error("Không tìm thấy địa chỉ.");
                }
            })
            .catch(function (error) {
                throw error;
            });
    };
});