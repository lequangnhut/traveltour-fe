travel_app.controller('PaymentSuccessHotelController', function($scope, $routeParams, $location, AuthService, OrderHotelService) {
    let user = $scope.user = AuthService.getUser();

    $scope.orderStatus = atob($routeParams.orderStatus);
    $scope.paymentMethod = atob($routeParams.paymentMethod);
    $scope.orderId = atob($routeParams.orderId);
    $scope.orderHotel = {}

    $scope.orderDetailsHotel = {}

    OrderHotelService.findOrderHotelById($scope.orderId ).then(function(response) {
        $scope.isLoading = true;

        if(response.status === 200) {
            $scope.orderHotel = response.data.data;
            console.log($scope.orderHotel);
        }else {
            console.log("Thanh toán thất bại")
        }
    }).finally(function () {
        $scope.isLoading = false;
    })

    $scope.redirectToHistoryOrderHotel = function() {
        if(user === null || user) {
            $location.path("/sign-up")
        }else {
            $location.path("/sign-up")
        }

    }
})