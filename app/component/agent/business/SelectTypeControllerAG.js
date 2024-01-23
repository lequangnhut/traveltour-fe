travel_app.controller('SelectTypeControllerAG', function ($scope, $location, AgenciesServiceAG, HotelServiceAG, TransportBrandServiceAG, VisitLocationServiceAG) {
    let user = $scope.user;

    function errorCallback(error) {
        $location.path('/admin/internal-server-error')
    }

    $scope.init = function () {
        if (user !== undefined && user !== null && user !== "") {
            AgenciesServiceAG.findByUserId(user.id).then(function successCallback(response) {
                $scope.agencies = response.data;
                let agencyId = response.data.id;

                HotelServiceAG.findAllByAgencyId(agencyId).then(function successCallback(response) {
                    $scope.hotels = response.data[0];
                }, errorCallback);

                TransportBrandServiceAG.findAllByAgencyId(agencyId).then(function successCallback(response) {
                    $scope.transport = response.data[0];
                }, errorCallback);

                VisitLocationServiceAG.findAllByAgencyId(agencyId).then(function successCallback(response) {
                    $scope.visits = response.data[0];
                }, errorCallback);
            }, errorCallback);
        }
    }

    $scope.init();
})