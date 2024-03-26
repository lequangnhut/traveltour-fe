travel_app.service('MapBoxService', function ($http, $q) {
    let accessToken = 'pk.eyJ1IjoicW5odXQxNyIsImEiOiJjbHN5aXk2czMwY2RxMmtwMjMxcGE1NXg4In0.iUd6-sHYnKnhsvvFuuB_bA';

    this.geocodeAddress = function (address, callback) {
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

    this.getRoutePoints = function (fromCoords, toCoords) {
        let deferred = $q.defer();

        $http.get('https://api.mapbox.com/directions/v5/mapbox/driving/' + fromCoords.lng + ',' + fromCoords.lat + ';' + toCoords.lng + ',' + toCoords.lat + '?steps=true&geometries=geojson&access_token=' + accessToken)
            .then(function (response) {
                let routeData = response.data;
                let routePoints = [];

                routeData.routes[0].geometry.coordinates.forEach(function (coordinate) {
                    routePoints.push({lat: coordinate[1], lng: coordinate[0]});
                });

                deferred.resolve(routePoints);
            })
            .catch(function (error) {
                deferred.reject(error);
            });

        return deferred.promise;
    };

    this.getCoordinatesFromAddress = function (address) {
        let url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + encodeURIComponent(address) + '.json?access_token=' + accessToken;

        return $http.get(url).then(function (response) {
            let data = response.data;
            if (data.features.length > 0) {
                return data.features[0].geometry.coordinates; // Trả về coordinates
            } else {
                throw new Error("Không tìm thấy địa chỉ.");
            }
        }).catch(function (error) {
            throw error;
        });
    };


});