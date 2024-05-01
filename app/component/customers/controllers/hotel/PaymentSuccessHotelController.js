travel_app.controller('PaymentSuccessHotelController', function($scope, $routeParams, $location, AuthService,Base64ObjectService , OrderHotelService) {
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

    /**
     * Hàm để di chuyển trang encode mã
     * @param objId
     * @param url
     * @param navItem
     */
    $scope.redirectPage = function (url, objId, navItem) {
        if (navItem) {
            let objIdEncode = Base64ObjectService.encodeObject(objId);
            $location.path(url + objIdEncode);
            $scope.setActiveNavItem(navItem);
        } else {
            let objIdEncode = Base64ObjectService.encodeObject(objId);
            $location.path(url + objIdEncode);
        }

    }
})