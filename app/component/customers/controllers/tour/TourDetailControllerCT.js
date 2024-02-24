travel_app.controller('TourDetailController', function ($scope, $location, $sce, $routeParams, $anchorScroll, TourTripsServiceAD, TourDetailsServiceAD, TourDetailServiceCT, MapBoxService) {
    $anchorScroll();

    $scope.provinceData = [];

    const tourDetailId = $routeParams.id;

    function errorCallback() {
        $location.path('/admin/internal-server-error')
    }

    $scope.init = function () {
        TourDetailServiceCT.findByTourDetailId(tourDetailId).then(function (response) {
            if (response.status === 200) {
                $scope.tourDetail = response.data.data;
                $scope.tourDetailImagesById = response.data.data.tourDetailImagesById;
                $scope.tourDetailDescription = $sce.trustAsHtml($scope.tourDetail.tourDetailDescription);

                let departureDate = new Date($scope.tourDetail.departureDate);
                let arrivalDate = new Date($scope.tourDetail.arrivalDate);

                $scope.tourDetail.numberOfDays = Math.ceil((arrivalDate - departureDate) / (1000 * 60 * 60 * 24));

                $scope.initMap();
            } else {
                $location.path('/admin/page-not-found')
            }
        }, errorCallback).finally(function () {
            $scope.isLoading = false;
        });

        TourTripsServiceAD.getTripsByTourId(tourDetailId).then(function (response) {
            if (response.status === 200) {
                $scope.tourTrips = response.data.data;

                if ($scope.tourTrips !== null) {
                    for (let i = 0; i < $scope.tourTrips.length; i++) {
                        $scope.tourTrips[i].activityInDay = $sce.trustAsHtml($scope.tourTrips[i].activityInDay);
                    }
                }
            } else {
                $location.path('/admin/page-not-found')
            }
        }, errorCallback).finally(function () {
            $scope.isLoading = false;
        });
    }

    // Khởi tạo bản đồ
    $scope.initMap = function () {
        $scope.provinceName = [];

        if (!tourDetailId) return;

        TourDetailsServiceAD.findTourDestinationByTourDetailById(tourDetailId).then(function (response) {
            if (response.status === 200) {
                $scope.arrayData = response.data.data;

                if ($scope.arrayData !== null) {
                    $scope.arrayData.forEach(function (item) {
                        $scope.provinceName.push(item.province);
                    });
                } else {
                    $scope.provinceName = ['Cần Thơ'];
                }

                let fromLocation = $scope.tourDetail.fromLocation;
                let toLocation = $scope.tourDetail.toLocation;
                let intermediatePoints = $scope.provinceName;

                mapboxgl.accessToken = 'pk.eyJ1IjoicW5odXQxNyIsImEiOiJjbHN5aXk2czMwY2RxMmtwMjMxcGE1NXg4In0.iUd6-sHYnKnhsvvFuuB_bA';

                // Lấy tọa độ từ tên địa chỉ cho cả điểm đi và điểm đến
                MapBoxService.geocodeAddress(fromLocation, function (error, fromCoordinates) {
                    if (!error) {
                        MapBoxService.geocodeAddress(toLocation, function (error, toCoordinates) {
                            if (!error) {
                                // Thêm tọa độ của các điểm trung gian vào danh sách địa điểm
                                let coordinatesList = intermediatePoints.map(function (point) {
                                    return new Promise(function (resolve, reject) {
                                        MapBoxService.geocodeAddress(point, function (error, coordinates) {
                                            if (!error) {
                                                resolve(coordinates);
                                            } else {
                                                reject(error);
                                            }
                                        });
                                    });
                                });

                                // Gộp tất cả các Promise lại thành một Promise duy nhất
                                Promise.all(coordinatesList)
                                    .then(function (intermediateCoordinates) {
                                        // Tạo URL cho API định tuyến với các điểm trung gian
                                        let waypoints = intermediateCoordinates.map(coord => `${coord[0]},${coord[1]}`).join(";");
                                        let routeURL = `https://api.mapbox.com/directions/v5/mapbox/driving/${fromCoordinates[0]},${fromCoordinates[1]};${waypoints};${toCoordinates[0]},${toCoordinates[1]}?geometries=geojson&steps=true&access_token=${mapboxgl.accessToken}`;

                                        const map = new mapboxgl.Map({
                                            container: 'map',
                                            style: 'mapbox://styles/mapbox/streets-v12',
                                            center: toCoordinates,
                                            zoom: 7
                                        });

                                        map.on('load', () => {
                                            // Lấy thông tin về đường đi từ dịch vụ định tuyến
                                            fetch(routeURL)
                                                .then(response => response.json())
                                                .then(data => {
                                                    // Lấy dữ liệu về đường đi
                                                    let route = data.routes[0].geometry;

                                                    // Vẽ đường đi trên bản đồ
                                                    map.addLayer({
                                                        'id': 'route',
                                                        'type': 'line',
                                                        'source': {
                                                            'type': 'geojson',
                                                            'data': {
                                                                'type': 'Feature',
                                                                'properties': {},
                                                                'geometry': route
                                                            }
                                                        },
                                                        'layout': {
                                                            'line-join': 'round',
                                                            'line-cap': 'round'
                                                        },
                                                        'paint': {
                                                            'line-color': '#e35050',
                                                            'line-width': 3
                                                        }
                                                    });
                                                })
                                                .catch(error => {
                                                    console.error('Lỗi khi lấy thông tin định tuyến:', error);
                                                });
                                        });
                                    })
                                    .catch(error => {
                                        console.error('Lỗi khi lấy tọa độ của các điểm trung gian:', error);
                                    });
                            } else {
                                console.error("Lỗi khi lấy tọa độ của điểm đến:", error);
                            }
                        });
                    } else {
                        console.error("Lỗi khi lấy tọa độ của điểm đi:", error);
                    }
                });
            } else {
                $location.path('/admin/page-not-found')
            }
        }, errorCallback).finally(function () {
            $scope.isLoading = false;
        });
    }

    $scope.init();

    $scope.$on('$viewContentLoaded', function () {
        $('.place-slider').slick({
            dots: false,
            arrows: false,
            infinite: true,
            speed: 800,
            autoplay: true,
            variableWidth: true,
            slidesToShow: 3,
            slidesToScroll: 1,
            prevArrow: '<div class="prev"><i class="far fa-arrow-left"></i></div>',
            nextArrow: '<div class="next"><i class="far fa-arrow-right"></i></div>',
            responsive: [{
                breakpoint: 767, settings: {
                    slidesToShow: 1
                }
            }]
        });

        $('.slider-active-5-item').slick({
            dots: false,
            arrows: false,
            infinite: true,
            speed: 800,
            autoplay: true,
            slidesToShow: 5,
            slidesToScroll: 1,
            prevArrow: '<div class="prev"><i class="far fa-arrow-left"></i></div>',
            nextArrow: '<div class="next"><i class="far fa-arrow-right"></i></div>',
            responsive: [{
                breakpoint: 1400, settings: {
                    slidesToShow: 4
                }
            }, {
                breakpoint: 1199, settings: {
                    slidesToShow: 3
                }
            }, {
                breakpoint: 991, settings: {
                    slidesToShow: 2
                }
            }, {
                breakpoint: 575, settings: {
                    slidesToShow: 1
                }
            }]
        });
    });
});