travel_app.controller('TransBookingSuccessCusController',
    function ($scope, $location, $timeout, $routeParams, LocalStorageService) {

        $scope.init = function () {
            let dataBookingTransportSuccess = LocalStorageService.get('dataBookingTransportSuccess');

            if (dataBookingTransportSuccess === null) {
                centerAlert('Cảnh báo', 'Chúng tôi nhận thấy bạn đang truy cập bất thường vào trang này, vui lòng rời khỏi !', 'warning');
                $location.path('/drive-move');
                return;
            }

            $scope.seatNumber = dataBookingTransportSuccess.seatNumber;
            $scope.orderTransport = dataBookingTransportSuccess.orderTransport;
            $scope.orderTransport.orderStatus = parseInt(atob($routeParams.orderStatus), 10);
            $scope.transportSchedule = dataBookingTransportSuccess.transportSchedule;
        }

        $scope.init();

        $scope.toggleOffCanVas = function () {
            $timeout(function () {
                let backdrops = document.querySelectorAll('.offcanvas-backdrop');
                if (backdrops.length > 1) {
                    backdrops[0].remove();
                }
            }, 0);
        }

        $scope.redirectService = function (service) {
            if (service === 'hotel') {
                $location.path('/hotel');
            } else {
                $location.path('/tours');
            }
        }

        $scope.$on('$destroy', function () {
            LocalStorageService.remove('dataBookingTransportSuccess');
        });
    })