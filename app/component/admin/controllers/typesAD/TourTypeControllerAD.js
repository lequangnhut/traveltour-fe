travel_app.controller('TourTypeControllerAD', function ($scope) {
    $scope.type = {
        typename : null
    }

    /**
     * Submit gửi dữ liệu cho api
     */
    $scope.submitAdminType = function () {
        console.log($scope.type)
    };
});