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

                HotelServiceAG.findByAgencyId(agencyId).then(function successCallback(response) {
                    $scope.hotels = response.data;
                }, errorCallback);

                TransportBrandServiceAG.findByAgencyId(agencyId).then(function successCallback(response) {
                    $scope.transport = response.data;
                }, errorCallback);

                VisitLocationServiceAG.findByAgencyId(agencyId).then(function successCallback(response) {
                    $scope.visits = response.data;
                }, errorCallback);
            }, errorCallback);
        }
    }

    $scope.init();
})