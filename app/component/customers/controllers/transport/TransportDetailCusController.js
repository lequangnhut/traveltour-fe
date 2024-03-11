travel_app.controller('TransportDetailCusController', function ($scope) {
    $scope.showTransportInfoNav = false;

    $scope.toggleTransportInfoNav = function () {
        $scope.showTransportInfoNav = !$scope.showTransportInfoNav;
    }

    $scope.currentTab = 'pending';

    $scope.changeTab = function(tabName) {
        $scope.currentTab = tabName;
    };
});