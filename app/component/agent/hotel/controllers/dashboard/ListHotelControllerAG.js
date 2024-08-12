travel_app.controller('ListHotelControllerAG', function ($scope, $timeout, $location, HotelServiceAG) {

    $scope.init = function () {
        $scope.isLoading = true;

        $timeout(function () {
            if ($scope.agencies && $scope.agencies.id) {
                HotelServiceAG.findAllByAgencyIdAndStatusDelete($scope.agencies.id)
                    .then(function successCallback(response) {
                        if (response.status === 200) {
                            $scope.hotels = response.data;
                        } else {
                            $location.path('/admin/page-not-found');
                        }
                    })
                    .catch(function (error) {
                        toastAlert('error', error.data.message)
                    })
                    .finally(function () {
                        $scope.isLoading = false;
                    });
            } else {
                console.error('Agencies data is not available');
                $scope.isLoading = false;
            }
        }, 150)
    }

    $scope.init();
});