travel_app.controller('TicketController', function ($scope, $location, $timeout, $routeParams, OrderTransportService) {
    let orderTransportId = $routeParams.orderTransportId;

    function errorCallback() {
        $location.path('/admin/internal-server-error')
    }

    $scope.init = function () {
        $timeout(function () {
            $('#modelTicket').modal('show');
        });

        OrderTransportService.findByOrderTransportId(orderTransportId).then(function successCallback(response) {
            if (response.status === 200) {
                $scope.orderTransport = response.data.data.orderTransportations;
                $scope.transportSchedule = response.data.data.exportDataOrderTransportDto.transportationSchedules;
                console.log($scope.orderTransport)
                console.log($scope.transportSchedule);
            } else {
                $location.path('/admin/page-not-found')
            }
        }, errorCallback);
    }

    $scope.init();
});