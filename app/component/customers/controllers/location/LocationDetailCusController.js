travel_app.controller('LocationDetailCusController', function ($scope, $location, LocationCusService) {
    function errorCallback() {
        $location.path('/admin/internal-server-error')
    }

    $scope.init = function () {

    }

    $scope.init();
});