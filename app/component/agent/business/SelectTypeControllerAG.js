travel_app.controller('SelectTypeControllerAG', function ($scope, $location, AgenciesServiceAG, HotelServiceAG, TransportServiceAG, VisitLocationServiceAG) {
    let user = $scope.user;

    function errorCallback(error) {
        console.log(error)
        toastAlert('error', "Máy chủ không tồn tại !");
    }

    $scope.init = function () {
        if (user !== undefined && user !== null && user !== "") {
            AgenciesServiceAG.findByUserId(user.id).then(function successCallback(response) {
                $scope.agencies = response.data;
                let agencyId = response.data.id;

                HotelServiceAG.findByAgencyId(agencyId).then(function successCallback(response) {
                    $scope.hotels = response.data;
                }, errorCallback);

                TransportServiceAG.findByAgencyId(agencyId).then(function successCallback(response) {
                    $scope.transport = response.data;
                }, errorCallback);

                VisitLocationServiceAG.findByAgencyId(agencyId).then(function successCallback(response) {
                    $scope.visits = response.data;

                    for (let i = 0; i < user.roles.length; i++) {
                        console.log(user.roles[i].nameRole);
                    }
                    if ($scope.hotels.isAccepted && $scope.transport.isAccepted && $scope.visits.isAccepted) {
                        $location.path('/business/hotel');
                    }
                }, errorCallback);
            }, errorCallback);
        }
    }

    $scope.init();
})