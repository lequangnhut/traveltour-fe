travel_app.controller('BookingLocationSuccessCusController', function ($scope, $location, $routeParams, BookingLocationCusService, LocationDetailCusService, LocalStorageService) {

    function getVisitLocationId() {
        let id = $routeParams.id;
        try {
            let decodedId = atob(id);
            return JSON.parse(decodedId);
        } catch (error) {
            return id;
        }
    }

    let visitLocationId = getVisitLocationId();
    let orderVisitId = $location.search().orderVisitId;

    function errorCallback() {
        $location.path('/admin/internal-server-error')
    }

    $scope.init = function () {
        let decryptedDataBookingLocation = LocalStorageService.decryptLocalData('dataBookingLocation', 'encryptDataBookingLocation');
        console.log(decryptedDataBookingLocation)

        let decryptedDataOrderVisitLocation = LocalStorageService.decryptLocalData('orderVisitLocation', 'encryptDataOrderVisitLocation');

        if (decryptedDataBookingLocation === null || decryptedDataBookingLocation === undefined) {
            toastAlert('warning', 'Booking tham quan không tồn tại !');
            $location.path('/tourism-location');
            return;
        } else {
            toastAlert('success', 'Đặt vé tham quan thành công !');
        }

        console.log(decryptedDataOrderVisitLocation)
        $scope.tickets = decryptedDataBookingLocation;
        $scope.locationDetail = decryptedDataOrderVisitLocation;

        if (visitLocationId !== undefined && visitLocationId !== null) {
            LocationDetailCusService.findById(visitLocationId).then((response) => {
                if (response.status === 200) {
                    $scope.locationDetail = response.data.data;
                    console.log($scope.locationDetail)
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
                    console.log($scope.orderVisitLocation)
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