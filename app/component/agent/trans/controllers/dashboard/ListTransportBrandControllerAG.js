travel_app.controller('ListTransportBrandControllerAG',
    function ($scope, $routeParams, $timeout, $location, TransportBrandServiceAG) {

        function errorCallback() {
            $location.path('/admin/internal-server-error')
        }

        $scope.init = function () {
            $scope.isLoading = true;

            $timeout(function () {
                if ($scope.agencies && $scope.agencies.id) {
                    TransportBrandServiceAG.findAllByAgencyId($scope.agencies.id)
                        .then(function successCallback(response) {
                            $scope.transportations = response.data;
                        })
                        .catch(errorCallback)
                        .finally(function () {
                            $scope.isLoading = false;
                        });
                } else {
                    console.error('Agencies data is not available');
                    $scope.isLoading = false;
                }
            }, 150);
        };

        $scope.init();
    });