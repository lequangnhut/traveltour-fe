travel_app.controller('AccountDecentralizationControllerAD', function ($scope) {
    $scope.account = {
        fullName: null,
        phoneNumber: null,
        email: null,
        role: null,
        gender: null,
    }

    /**
     * Submit gửi dữ liệu cho api
     */
    $scope.submitAccount = function () {
        console.log($scope.account)
    };
});
