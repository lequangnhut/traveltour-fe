travel_app.controller('TourDetailController', function ($scope, $location, $sce, $routeParams, $anchorScroll, TourDetailServiceCT, GoogleMapsService) {
    $anchorScroll();

    const tourDetailId = $routeParams.id;

    function errorCallback() {
        $location.path('/admin/internal-server-error')
    }

    $scope.init = function () {
        GoogleMapsService.loadMapsApi();

        TourDetailServiceCT.findByTourDetailId(tourDetailId).then(function (response) {
            if (response.status === 200) {
                $scope.tourDetail = response.data.data;
                $scope.tourDetailImagesById = response.data.data.tourDetailImagesById;
                $scope.tourDetailDescription = $sce.trustAsHtml($scope.tourDetail.tourDetailDescription);

                let departureDate = new Date($scope.tourDetail.departureDate);
                let arrivalDate = new Date($scope.tourDetail.arrivalDate);

                $scope.tourDetail.numberOfDays = Math.ceil((arrivalDate - departureDate) / (1000 * 60 * 60 * 24));

                if (typeof google !== 'undefined' && typeof google.maps !== 'undefined') {
                    initMap();
                } else {
                    setTimeout(initMap, 1000);
                }
            } else {
                $location.path('/admin/page-not-found')
            }
        }, errorCallback).finally(function () {
            $scope.isLoading = false;
        });
    }

    function initMap() {
        const directionsService = new google.maps.DirectionsService();
        const directionsRenderer = new google.maps.DirectionsRenderer();

        let fromLocation = $scope.tourDetail.fromLocation;
        let toLocation = $scope.tourDetail.toLocation;

        const mapOptions = {
            zoom: 8,
            center: {lat: 10.0276, lng: 105.7856}
        };

        const map = new google.maps.Map(document.getElementById('map'), mapOptions);

        directionsRenderer.setMap(map);

        const request = {
            origin: fromLocation + ', Vietnam',
            waypoints: [
                {location: 'Chợ Kinh F, Xã Định Thành, An Giang, Vietnam'},
                {location: 'Sóc Trăng, Vietnam'}
            ],
            destination: toLocation + ', Kiên Giang, Vietnam',
            travelMode: 'DRIVING'
        };

        directionsService.route(request, function (response, status) {
            if (status === 'OK') {
                directionsRenderer.setDirections(response);
            } else {
                console.error('Error:', status);
            }
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