travel_app.controller('BedTypeControllerAD', function ($scope) {
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