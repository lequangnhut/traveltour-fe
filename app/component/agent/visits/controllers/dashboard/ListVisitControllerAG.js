travel_app.controller('ListVisitControllerAG',
    function ($scope, $location, $timeout, VisitLocationServiceAG) {

        function errorCallback() {
            $location.path('/admin/internal-server-error')
        }

        $scope.init = function () {
            $scope.isLoading = true;

            $timeout(function () {
                let agencyId = $scope.agencies.id;

                if (agencyId !== undefined && agencyId !== null && agencyId !== "") {
                    VisitLocationServiceAG.findAllByAgencyId(agencyId).then(function (response) {
                        $scope.visitLocation = response.data;
                    }, errorCallback).finally(function () {
                        $scope.isLoading = false;
                    });
                }
            }, 150);
        }

        $scope.init();
    });