travel_app.controller('SelectTypeControllerAG', function ($scope, AgenciesServiceAG) {
    let user = $scope.user;

    function errorCallback(error) {
        console.log(error)
        toastAlert('error', "Máy chủ không tồn tại !");
    }

    $scope.init = function () {
        if (user !== undefined && user !== null && user !== "") {
            AgenciesServiceAG.findByUserId(user.id).then(function successCallback(response) {
                $scope.agencies = response.data;
                console.log($scope.agencies)
            }, errorCallback);
        }
    }

    $scope.init();
})