travel_app.controller('ListHotelControllerAG', function ($scope, $location, HotelServiceAG) {

    function errorCallback() {
        $location.path('/admin/internal-server-error')
    }

    $scope.hotels = {};

    let agencyId = $scope.agencies.id;

    if (agencyId !== undefined && agencyId !== null && agencyId !== "") {
        HotelServiceAG.findAllByAgencyIdAndStatusDelete(agencyId)
            .then(function successCallback(response) {
                if (response.status === 200) {
                    $scope.hotels = response.data;
                    console.log($scope.hotels)
                } else {
                    toastAlert('error', response.message)
                }
            })
            .catch(function (error) {
                toastAlert('error', error.data.message)
            });
    }


});