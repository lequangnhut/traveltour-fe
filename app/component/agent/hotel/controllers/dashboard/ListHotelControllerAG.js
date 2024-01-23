travel_app.controller('ListHotelControllerAG', function ($scope, $location, HotelServiceAG) {

    function errorCallback() {
        $location.path('/admin/internal-server-error')
    }

    $scope.init = function () {
        let agencyId = $scope.agencies.id;

        if (agencyId !== undefined && agencyId !== null && agencyId !== "") {
            HotelServiceAG.findAllByAgencyId(agencyId).then(function successCallback(response) {
                $scope.hotels = response.data;
            }, errorCallback);
        }
    }

    $scope.init();
});