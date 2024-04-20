travel_app.controller('SelectTypeControllerAG',
    function ($scope, $location, AgenciesServiceAG, HotelServiceAG, TransportBrandServiceAG, VisitLocationServiceAG) {
        let user = $scope.user;

        function errorCallback() {
            $location.path('/admin/internal-server-error')
        }

        $scope.init = function () {
            if (user !== undefined && user !== null && user !== "") {
                AgenciesServiceAG.findByUserId(user.id).then(function successCallback(response) {
                    if (response.status === 200) {
                        $scope.agencies = response.data;

                        HotelServiceAG.findAllByAgencyId($scope.agencies.id).then(function (response) {
                            if (response.status === 200) {
                                $scope.hotels = response.data[0];
                                console.log(response.data)
                            } else {
                                $location.path('/admin/page-not-found');
                            }
                        });

                        TransportBrandServiceAG.findAllByAgencyId($scope.agencies.id).then(function (response) {
                            if (response.status === 200) {
                                $scope.transport = response.data[0];
                            } else {
                                $location.path('/admin/page-not-found');
                            }
                        });

                        VisitLocationServiceAG.findAllByAgencyId($scope.agencies.id).then(function (response) {
                            if (response.status === 200) {
                                $scope.visits = response.data[0];
                            } else {
                                $location.path('/admin/page-not-found');
                            }
                        });
                    } else {
                        $location.path('/admin/page-not-found');
                    }
                }, errorCallback);
            }
        }

        $scope.init();
    })