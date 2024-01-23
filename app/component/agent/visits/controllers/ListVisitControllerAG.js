travel_app.controller('ListVisitControllerAG', function ($scope, $location, VisitLocationServiceAG) {

    function errorCallback() {
        $location.path('/admin/internal-server-error')
    }

    $scope.init = function () {
        let agencyId = $scope.agencies.id;

        if (agencyId !== undefined && agencyId !== null && agencyId !== "") {
            VisitLocationServiceAG.findAllByAgencyId(agencyId).then(function successCallback(response) {
                $scope.visitLocation = response.data;
            }, errorCallback);
        }
    }

    $scope.init();
});