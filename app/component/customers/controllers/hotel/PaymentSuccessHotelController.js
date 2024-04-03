travel_app.controller('PaymentSuccessHotelController', function($scope, $routeParams, OrderHotelService) {
    $scope.orderStatus = atob($routeParams.orderStatus);
    $scope.paymentMethod = atob($routeParams.paymentMethod);
    $scope.orderId = atob($routeParams.orderId);
    $scope.orderHotel = {

    }

    console.log($scope.orderStatus)
    $scope.orderDetailsHotel = {

    }

    OrderHotelService.findOrderHotelById($scope.orderId ).then(function(response) {
        $scope.isLoading = true;

        if(response.status === 200) {
            $scope.orderHotel = response.data.data;
            console.log($scope.orderHotel);
        }else {
            console.log("Thanh toán thất bại hihi")
        }
    }).finally(function () {
        $scope.isLoading = false;
    })
})