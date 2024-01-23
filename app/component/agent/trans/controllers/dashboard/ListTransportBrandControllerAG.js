travel_app.controller('ListTransportBrandControllerAG', function ($scope, $location, TransportBrandServiceAG) {

    function errorCallback() {
        $location.path('/admin/internal-server-error')
    }

    $scope.init = function () {
        let agencyId = $scope.agencies.id;

        if (agencyId !== undefined && agencyId !== null && agencyId !== "") {
            TransportBrandServiceAG.findAllByAgencyId(agencyId).then(function successCallback(response) {
                $scope.transportations = response.data;
            }, errorCallback);
        }
    }

    $scope.init();
});