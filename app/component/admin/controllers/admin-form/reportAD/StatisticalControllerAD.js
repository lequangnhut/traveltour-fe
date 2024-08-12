travel_app.controller('StatisticalControllerAD', function ($scope, $location, StatisticalServiceAD) {

    $scope.isLoading = true;

    $scope.listHotel = [];
    $scope.listBrand = [];
    $scope.listVisit = [];

    function errorCallback() {
        $location.path('/admin/internal-server-error')
    }

    $scope.init = function () {

        StatisticalServiceAD.listFiveAgent().then(function successCallback(response) {
            $scope.listFive = response.data.data;
        }, errorCallback).finally(function () {
            $scope.isLoading = false;
        });

        StatisticalServiceAD.compareAmountUser().then(function successCallback(response) {

            $scope.userNow = response.data.data.nowUser;
            $scope.userAgo = response.data.data.agoUser;

            $scope.compareUser = Math.ceil((($scope.userNow - $scope.userAgo) / $scope.userAgo) * 100);

        }, errorCallback).finally(function () {
            $scope.isLoading = false;
        });

        StatisticalServiceAD.compareAmountAgent().then(function successCallback(response) {
            $scope.agentNow = response.data.data.nowAgent;
            $scope.agentAgo = response.data.data.agoAgent;
            $scope.compareAgent = Math.ceil((($scope.agentNow - $scope.agentAgo) / $scope.agentAgo) * 100);
        }, errorCallback).finally(function () {
            $scope.isLoading = false;
        });

        StatisticalServiceAD.topThreeHotel().then(function successCallback(response) {
            $scope.listHotel = response.data.data;
        }, errorCallback).finally(function () {
            $scope.isLoading = false;
        });

        StatisticalServiceAD.topThreeVehicle().then(function successCallback(response) {
            $scope.listBrand = response.data.data;
        }, errorCallback).finally(function () {
            $scope.isLoading = false;
        });

        StatisticalServiceAD.topThreeVisit().then(function successCallback(response) {
            $scope.listVisit = response.data.data;
            console.log($scope.listVisit);
        }, errorCallback).finally(function () {
            $scope.isLoading = false;
        });
    }


    $scope.init();

});