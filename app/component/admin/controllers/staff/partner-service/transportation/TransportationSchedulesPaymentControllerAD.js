travel_app.controller('TransportationSchedulesPaymentControllerAD',
    function ($scope, $sce, $routeParams, $location, $timeout, $http, TransportationScheduleServiceAD, TourDetailsServiceAD,
              CustomerServiceAD, OrderTransportationServiceAD) {
        $scope.isLoading = true;
        $scope.showActivities = false;
        const tourDetailId = $routeParams.tourDetailId;
        $scope.tourDetailId = tourDetailId;
        const transportationScheduleId = $routeParams.transportationScheduleId;
        $scope.payment = {method: '0'};
        $scope.tourGuide = {};

        if (tourDetailId !== undefined && tourDetailId !== null && tourDetailId !== "") {
            TourDetailsServiceAD.findTourDetailById(tourDetailId).then(async response => {
                $scope.tourGuideId = response.data.data.guideId;
                if ($scope.tourGuideId) {
                    const guideResponse = await CustomerServiceAD.findCustomerById($scope.tourGuideId);
                    $scope.tourGuide = guideResponse.data.data;
                    const transportationResponse = await TransportationScheduleServiceAD.findById(transportationScheduleId);
                    $scope.transportationSchedules = transportationResponse.data.data;
                    $scope.$apply()
                }
            })
        }

        const Confirm = function () {
            let orderTransportation = {
                userId: $scope.tourGuide.id,
                transportationScheduleId: transportationScheduleId,
                customerName: $scope.tourGuide.fullName,
                customerCitizenCard: $scope.tourGuide.citizenCard,
                customerPhone: $scope.tourGuide.phone,
                customerEmail: $scope.tourGuide.email,
                amountTicket: $scope.transportationSchedules.bookedSeat,
                orderTotal: $scope.transportationSchedules.unitPrice,
                paymentMethod: $scope.payment.method !== '0',
                dateCreated: new Date(),
                orderStatus: $scope.payment.method,
            }

            const dataOrderTransportation = new FormData();
            dataOrderTransportation.append("orderTransportationsDto", new Blob([JSON.stringify(orderTransportation)], {type: "application/json"}));
            dataOrderTransportation.append("tourDetailId", tourDetailId);

            OrderTransportationServiceAD.createOrderTransportation(dataOrderTransportation).then(function successCallback(repo) {
                toastAlert('success', 'Thêm mới thành công !');
                $location.path(`/admin/detail-tour-list/${tourDetailId}/service-list/transportation-list`);
            }, errorCallback).finally(function () {
                $scope.isLoading = false;
            });
        };

        $scope.ConfirmCompletionOfBooking = () => {
            confirmAlert('Bạn có chắc chắn muốn đặt xe không ?', function () {
                Confirm()
            });
        }
        $scope.toggleActivities = function () {
            $scope.showActivities = $scope.payment.method === '1';
        };

        function errorCallback() {
            $location.path('/admin/internal-server-error')
        }
    });