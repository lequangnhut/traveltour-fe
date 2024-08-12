travel_app.controller('TransportationSchedulesPaymentControllerAD',
    function ($scope, $sce, $routeParams, $location, $timeout, $http, GenerateCodePayService, TransportationScheduleServiceAD, TourDetailsServiceAD,
              CustomerServiceAD, OrderTransportationServiceAD, Base64ObjectService) {

        $scope.isLoading = true;
        $scope.showActivities = false;

        const tourDetailId = Base64ObjectService.decodeObject($routeParams.tourDetailId);
        $scope.tourDetailId = $routeParams.tourDetailId;

        const transportationScheduleId = Base64ObjectService.decodeObject($routeParams.transportationScheduleId);
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

        const Confirm = () => {
            let orderTransportation = {
                id: GenerateCodePayService.generateCodeBooking('VPO', transportationScheduleId),
                userId: $scope.tourGuide.id,
                transportationScheduleId: transportationScheduleId,
                customerName: $scope.tourGuide.fullName,
                customerCitizenCard: $scope.tourGuide.citizenCard,
                customerPhone: $scope.tourGuide.phone,
                customerEmail: $scope.tourGuide.email,
                amountTicket: $scope.transportationSchedules.bookedSeat,
                orderTotal: $scope.transportationSchedules.unitPrice,
                paymentMethod: 0,
                dateCreated: new Date(),
                orderStatus: 0,
                orderCode: GenerateCodePayService.generateCodePayment('VPO')
            }

            const dataOrderTransportation = new FormData();
            dataOrderTransportation.append("orderTransportationsDto", new Blob([JSON.stringify(orderTransportation)], {type: "application/json"}));
            dataOrderTransportation.append("tourDetailId", tourDetailId);

            OrderTransportationServiceAD.createOrderTransportation(dataOrderTransportation).then((repo) => {
                toastAlert('success', 'Thêm mới thành công !');
                $location.path(`/admin/detail-tour-list/${$routeParams.tourDetailId}/service-list/transportation-list`);
            }, errorCallback).finally(() => {
                $scope.isLoading = false;
            });
        };

        $scope.ConfirmCompletionOfBooking = () => {
            confirmAlert('Bạn có chắc chắn muốn đặt xe không ?', () => {
                Confirm();
            });
        }

        const errorCallback = () => {
            $location.path('/admin/internal-server-error')
        }
    });