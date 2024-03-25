travel_app.controller('RegisterTransControllerAG', function ($scope, $http, $routeParams, $location, AgenciesServiceAG, TransportBrandServiceAG, MapBoxService) {
    mapboxgl.accessToken = 'pk.eyJ1IjoicW5odXQxNyIsImEiOiJjbHN5aXk2czMwY2RxMmtwMjMxcGE1NXg4In0.iUd6-sHYnKnhsvvFuuB_bA';

    let brandId = $routeParams.id;

    $scope.currentStep = 1;
    $scope.showNextForm = false;
    $scope.showThirdForm = false;
    $scope.checkboxChecked = false;

    $scope.nextStep = function () {
        if ($scope.currentStep < 4) {
            $scope.currentStep++;
        }
    };

    $scope.prevStep = function () {
        if ($scope.currentStep <= 4) {
            $scope.currentStep--;
        }
    };

    function errorCallback() {
        $location.path('/admin/internal-server-error')
    }

    $scope.transportBrand = {
        id: null,
        agenciesId: null,
        transportationBrandName: null,
        transportationBrandPolicy: null,
        transportationBrandAddress: null,
        transportationBrandImg: null
    }

    $scope.init = function () {
        let user = $scope.user;

        if (user !== undefined && user !== null && user !== "") {
            AgenciesServiceAG.findByUserId(user.id).then(function successCallback(response) {
                $scope.agencies = response.data;
            }, errorCallback);
        }

        if (brandId !== undefined && brandId !== null && brandId !== "") {
            TransportBrandServiceAG.findByTransportBrandId(brandId).then(function successCallback(response) {
                if (response.status === 200) {
                    $scope.transportBrand = response.data.data;
                } else {
                    $location.path('/admin/page-not-found')
                }
            }, errorCallback);
        }
    }

    /**
     * Upload hình ảnh và lưu vào biến transportationBrandImg
     * @param file
     */
    $scope.uploadTransportBrandImg = function (file) {
        if (file && !file.$error) {
            $scope.transportBrand.transportationBrandImg = file;
        }
    };

    /**
     * Submit gửi dữ liệu cho api
     */
    $scope.submitDataRegisterTrans = function () {
        TransportBrandServiceAG.findAllByAgencyId($scope.agencies.id).then(function successCallback(response) {
            let transportBrand = response.data;

            if (transportBrand.length === 1) {
                let existingTrans = transportBrand[0];

                if (existingTrans.transportationBrandName == null) {
                    $scope.submitDataAPITransport('register', 'select-type');
                } else {
                    $scope.submitDataAPITransport('create', 'transport/home');
                }
            } else {
                $scope.submitDataAPITransport('create', 'transport/home');
            }
        }, errorCallback);
    };

    $scope.submitDataAPITransport = function (apiUrl, urlRedirect) {
        $scope.isLoading = true;
        $scope.transportBrand.agenciesId = $scope.agencies.id;

        const dataTrans = new FormData();
        dataTrans.append("transportDto", new Blob([JSON.stringify($scope.transportBrand)], {type: "application/json"}));
        dataTrans.append("transportImg", $scope.transportBrand.transportationBrandImg);

        TransportBrandServiceAG.registerTransport(dataTrans, apiUrl).then(function successCallback() {
            $location.path('/business/' + urlRedirect);
            centerAlert('Thành công !', 'Thông tin phương tiện đã được cập nhật thành công.', 'success');
        }, errorCallback).finally(function () {
            $scope.isLoading = false;
        });
    };

    /**
     * Gọi api để cập nhật transport brand
     */
    $scope.updateTransport = function () {
        function confirmUpdate() {
            $scope.isLoading = true;

            const dataTrans = new FormData();
            dataTrans.append("transportDto", new Blob([JSON.stringify($scope.transportBrand)], {type: "application/json"}));
            dataTrans.append("transportImg", $scope.transportBrand.transportationBrandImg);

            TransportBrandServiceAG.update(dataTrans).then(function successCallback() {
                $location.path('/business/transport/home');
                centerAlert('Thành công !', 'Thông tin phương tiện đã được cập nhật thành công.', 'success');
            }, errorCallback).finally(function () {
                $scope.isLoading = false;
            });
        }

        confirmAlert('Bạn có chắc chắn muốn cập nhật không ?', confirmUpdate);
    }

    $scope.deleteTransport = function () {
        function confirmDelete() {
            $scope.isLoading = true;

            TransportBrandServiceAG.delete(brandId).then(function successCallback() {
                $location.path('/business/transport/home');
                centerAlert('Thành công !', 'Xóa thông tin nhà xe thành công.', 'success');
            }, errorCallback).finally(function () {
                $scope.isLoading = false;
            });
        }

        confirmAlert('Bạn có chắc chắn muốn xóa không ?', confirmDelete);
    }

    $scope.init();

    $scope.initMap = () => {
        $scope.map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [106.6297, 10.8231],
            zoom: 9
        });

        $scope.map.on('load', () => {
            $scope.map.on('click', (e) => {
                $scope.longitude = e.lngLat.lng;
                $scope.latitude = e.lngLat.lat;

                if ($scope.currentMarker) {
                    $scope.currentMarker.remove();
                }

                $scope.toLocationArray = [$scope.longitude, $scope.latitude];

                $scope.showLocationOnInput($scope.toLocationArray);

                $scope.currentMarker = new mapboxgl.Marker()
                    .setLngLat([$scope.longitude, $scope.latitude])
                    .addTo($scope.map);
            });
        });
    }

    $scope.searchLocationOnMap = () => {
        let searchQuery = encodeURIComponent($scope.searchLocation);

        if (searchQuery) {
            let apiUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${searchQuery}.json?access_token=${mapboxgl.accessToken}&country=VN&type=region&autocomplete=true`;

            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                    if (data.features.length > 0) {
                        $scope.suggestedLocations = data.features.map(feature => feature.place_name);
                        $scope.showSuggestions = true;
                    } else {
                        $scope.showSuggestions = false;
                    }
                })
                .catch(error => {
                    console.error('Lỗi khi tìm kiếm địa điểm:', error);
                    $scope.showSuggestions = false;
                });
        } else {
            $scope.showSuggestions = false;
            $scope.initMap();
        }
    }

    $scope.selectLocation = (location) => {
        $scope.searchLocation = location;
        $scope.searchLocationOnMap();
        $scope.showSuggestions = false;
    }

    $scope.submitSearchOnMap = () => {
        $scope.showSuggestions = false;
        let searchQuery = $scope.searchLocation;

        if (searchQuery) {
            if (searchQuery.length > 50) {
                searchQuery = searchQuery.substring(0, 50);
            }

            let relatedKeywords = searchQuery.split(' ').filter(keyword => keyword.length > 2);
            searchQuery = relatedKeywords.join(' ');

            MapBoxService.geocodeAddress(searchQuery, (error, coordinates) => {
                if (error) {
                    console.error('Lỗi khi tìm kiếm địa điểm:', error);
                    return;
                }

                let bbox = [
                    [coordinates[0] - 0.01, coordinates[1] - 0.01],
                    [coordinates[0] + 0.01, coordinates[1] + 0.01]
                ];

                $scope.map ? $scope.map.fitBounds(bbox) : $scope.initMap();
            });
        } else {
            $scope.initMap();
        }
    }

    $scope.showLocationOnInput = (toLocation) => {
        fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${toLocation[0]},${toLocation[1]}.json?access_token=${mapboxgl.accessToken}`)
            .then(response => response.json())
            .then(data => {
                $scope.$apply(() => {
                    let addressComponents = data.features[0].place_name.split(',');
                    for (let i = addressComponents.length - 1; i >= 0; i--) {
                        let lastPart = addressComponents[i].trim();
                        if (!isNaN(lastPart)) {
                            addressComponents.splice(i, 1);
                            break;
                        }
                    }
                    $scope.transportBrand.transportationBrandAddress = addressComponents.join(',').trim();
                });
            })
            .catch(error => {
                console.error('Lỗi khi lấy thông tin địa chỉ:', error);
            });
    }

    /**
     * Phương thức hiển thị modal
     */
    $scope.showModalMap = () => {
        $scope.searchLocation = "";
        let modelMap = $('#modalMapTransport');
        modelMap.modal('show');

        modelMap.on('shown.bs.modal', () => {
            $scope.initMap();
        });
    };
});
