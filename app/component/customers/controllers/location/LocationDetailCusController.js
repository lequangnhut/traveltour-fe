travel_app.controller('LocationDetailCusController', function ($scope, $anchorScroll, $location, LocationCusService) {
    $anchorScroll();

    function errorCallback() {
        $location.path('/admin/internal-server-error')
    }

    $scope.init = function () {

    }

    $scope.init();
});