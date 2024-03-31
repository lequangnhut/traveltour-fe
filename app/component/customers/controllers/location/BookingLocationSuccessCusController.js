travel_app.controller('BookingLocationSuccessCusController', function ($scope, $location, $routeParams, BookingLocationCusService, LocationDetailCusService, LocalStorageService) {

    const decodeToId = (id) => {
        try {
            return atob(id);
        } catch (error) {
            return id;
        }
    }

    let visitLocationId = decodeToId($routeParams.id);
    let orderVisitId = decodeToId($routeParams.orderVisitId);

    function errorCallback() {
        $location.path('/admin/internal-server-error')
    }

    $scope.init = function () {
        let decryptedDataBookingLocation = LocalStorageService.decryptLocalData('dataBookingLocation', 'encryptDataBookingLocation');
        let decryptedDataOrderVisitLocation = LocalStorageService.decryptLocalData('orderVisitLocation', 'encryptDataOrderVisitLocation');

        if (decryptedDataBookingLocation === null || decryptedDataBookingLocation === undefined) {
            toastAlert('warning', 'Booking tham quan không tồn tại !');
            $location.path('/tourism-location');
            return;
        } else {
            toastAlert('success', 'Đặt vé tham quan thành công !');
        }

        $scope.tickets = decryptedDataBookingLocation;
        $scope.locationDetail = decryptedDataOrderVisitLocation;

        if (visitLocationId !== undefined && visitLocationId !== null) {
            LocationDetailCusService.findById(visitLocationId).then((response) => {
                if (response.status === 200) {
                    $scope.locationDetail = response.data.data;
                } else {
                    $location.path('/admin/page-not-found')
                }
            }, errorCallback).finally(() => {
                $scope.isLoading = false;
            });
        }

        if (orderVisitId !== undefined && orderVisitId !== null) {
            BookingLocationCusService.findById(orderVisitId).then((response) => {
                if (response.status === 200) {
                    $scope.orderVisitLocation = response.data.data;
                } else {
                    $location.path('/admin/page-not-found')
                }
            }, errorCallback).finally(() => {
                $scope.isLoading = false;
            });
        } else {
            $scope.orderVisitLocation = decryptedDataOrderVisitLocation
        }
    }

    if ($routeParams.orderStatus && $routeParams.paymentMethod) {
        $scope.orderStatus = parseInt($routeParams.orderStatus);
        $scope.paymentMethodTour = $routeParams.paymentMethod;
    } else {
        $scope.orderStatus = 0;
        $scope.paymentMethodTour = 'VPO';
    }

    $scope.$on('$destroy', function () {
        LocalStorageService.remove('dataBookingLocation');
    });

    $scope.init();
})