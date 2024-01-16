travel_app.controller('TourTypeControllerAD', function ($scope, TourTypeService) {
    $scope.type = {
        typename : null
    }

    $scope.types = [];

    /**
     * Submit gửi dữ liệu cho api
     */
    $scope.submitAdminType = function () {
        console.log($scope.type)
    };

    $scope.fillListTourType = function (){

    }

    TourTypeService.listTourType().then(function successCallback(response) {
        $scope.tourtypes = response.data;
        console.log(response.data);
    }, function errorCallback(response) {
        console.log(response.data);
    });
});