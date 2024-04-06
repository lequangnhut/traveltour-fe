travel_app.controller('ListTransportBrandControllerAG',
    function ($scope, $routeParams, $timeout, $location, TransportBrandServiceAG) {

        function errorCallback() {
            $location.path('/admin/internal-server-error')
        }

        $scope.init = function () {
            $scope.isLoading = true;

            $timeout(function () {
                let agencyId = $scope.agencies.id;

                if (agencyId !== undefined && agencyId !== null && agencyId !== "") {
                    TransportBrandServiceAG.findAllByAgencyId(agencyId).then(function successCallback(response) {
                        $scope.transportations = response.data;
                    }, errorCallback).finally(function () {
                        $scope.isLoading = false;
                    });
                }
            }, 100)
        }

        $scope.init();
    });