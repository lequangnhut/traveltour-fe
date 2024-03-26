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
    let orderVisitId = $location    .search().orderVisitId;

    function errorCallback() {
        $location.path('/admin/internal-server-error')
    }

    $scope.init = function () {
        let dataBookingLocation = LocalStorageService.get('dataBookingLocation');
        let decryptedDataBookingLocation = LocalStorageService.decryptData(dataBookingLocation, 'encryptDataBookingLocation');
        console.log(decryptedDataBookingLocation)

        let orderVisitLocation = LocalStorageService.get('orderVisitLocation');
        let decryptedDataOrderVisitLocation = LocalStorageService.decryptData(orderVisitLocation, 'encryptDataOrderVisitLocation');

        if (decryptedDataBookingLocation === null || decryptedDataBookingLocation === undefined) {
            centerAlert('Cảnh báo', 'Chúng tôi nhận thấy bạn đang truy cập bất thường vào trang này, vui lòng rời khỏi !', 'warning');
            $location.path('/tourism-location');
            return;
        }

        console.log(orderVisitLocation)
        $scope.tickets = orderVisitLocation;

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
            console.log($scope.orderVisitLocation)
        }
    }

    $scope.$on('$destroy', function () {
        LocalStorageService.remove('dataBookingLocation');
    });

    $scope.init();
})