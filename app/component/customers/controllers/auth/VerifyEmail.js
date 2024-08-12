travel_app.controller('VerifyEmail', function ($scope, $location, $routeParams, AuthService) {

    const token = $routeParams.token;

    function errorCallback() {
        toastAlert('error', "Máy chủ không tồn tại !");
    }

    /**
     * @message lấy dữ liệu api trả ra user
     */
    $scope.init = function () {
        AuthService.findByToken(token).then(function successCallback(response) {
            if (response.status === 200) {
                $scope.email = response.data.data.email;
            } else {
                $location.path('/admin/page-not-found');
            }
        }, errorCallback);
    };

    $scope.init();
});
