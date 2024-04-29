travel_app.controller('VisitLocationPaymentControllerAD',
    function ($scope, $sce, $routeParams, $location, $timeout, $http, VisitLocationServiceAD, CustomerServiceAD,
              OrderVisitServiceAD, OrderVisitDetailServiceAD, TourDetailsServiceAD, GenerateCodePayService,
              LocalStorageService, Base64ObjectService) {
        $scope.isLoading = true;
        $scope.showActivities = false;
        const tourDetailId = Base64ObjectService.decodeObject($routeParams.tourDetailId);
        $scope.tourDetailId = $routeParams.tourDetailId;
        const visitLocationId = Base64ObjectService.decodeObject($routeParams.visitLocationId);
        $scope.payment = {method: '0'};
        $scope.tourGuide = {};
        $scope.orderVisitLocation = {};
        $scope.selectedTickets = LocalStorageService.decryptLocalData('selectedTickets', 'encryptSelectedTickets') || [];
        $scope.infoVisitLocation = LocalStorageService.decryptLocalData('infoVisitLocation', 'encryptInfoVisitLocation') || {};
        $scope.totalBeforeTax = 0;
        $scope.VATRate = 0; // 8% VAT
        $scope.discountRate = 0; // 0% Discount for now
        $scope.VATAmount = 0;
        $scope.discountAmount = 0;
        $scope.total = calculateTotal($scope.selectedTickets);

        function calculateTotal(tickets) {
            $scope.totalBeforeTax = tickets.reduce((acc, ticket) => acc + ticket.unitPrice * ticket.quantity, 0);
            $scope.VATAmount = $scope.totalBeforeTax * ($scope.VATRate / 100);
            $scope.discountAmount = $scope.totalBeforeTax * ($scope.discountRate / 100);

            return $scope.totalBeforeTax + $scope.VATAmount - $scope.discountAmount;
        }


        if (tourDetailId !== undefined && tourDetailId !== null && tourDetailId !== "") {
            TourDetailsServiceAD.findTourDetailById(tourDetailId).then(async response => {
                $scope.tourGuideId = response.data.data.guideId;
                if ($scope.tourGuideId) {
                    const guideResponse = await CustomerServiceAD.findCustomerById($scope.tourGuideId);
                    $scope.tourGuide = guideResponse.data.data;
                    $scope.$apply()
                }
            })
        }

        $scope.confirmCompletionOfTicketPurchase = () => {
            $scope.orderVisitLocation = {
                id: GenerateCodePayService.generateCodeBooking('VPO', visitLocationId),
                userId: $scope.tourGuide.id,
                visitLocationId: visitLocationId,
                customerName: $scope.tourGuide.fullName,
                customerCitizenCard: $scope.tourGuide.citizenCard,
                customerPhone: $scope.tourGuide.phone,
                customerEmail: $scope.tourGuide.email,
                capacityAdult: $scope.infoVisitLocation.capacityAdult,
                capacityKid: $scope.infoVisitLocation.capacityKid,
                checkIn: $scope.infoVisitLocation.checkIn,
                orderTotal: $scope.total,
                paymentMethod: 0,
                dateCreated: new Date(),
                orderStatus: 0,
                orderCode: GenerateCodePayService.generateCodePayment('VPO')
            }

            let orderVisitLocation = $scope.orderVisitLocation;
            const dataOrderVisitLocation = new FormData();

            dataOrderVisitLocation.append("orderVisitsDto", new Blob([JSON.stringify(orderVisitLocation)], {type: "application/json"}));
            dataOrderVisitLocation.append("tourDetailId", tourDetailId);

            function confirmSubmit() {
                OrderVisitServiceAD.createOrderVisit(dataOrderVisitLocation).then((repo) => {
                    let orderVisitLocationId = repo.data.data.id;

                    $scope.selectedTickets.forEach(item => {
                        let orderVisitLocationDetail = {
                            orderVisitId: orderVisitLocationId,
                            visitLocationTicketId: item.id,
                            amount: item.quantity,
                            unitPrice: item.unitPrice,
                        }

                        const dataOrderVisitLocationDetail = new FormData();
                        dataOrderVisitLocationDetail.append("orderVisitDetailsDto", new Blob([JSON.stringify(orderVisitLocationDetail)], {type: "application/json"}));
                        OrderVisitDetailServiceAD.createOrderVisitDetail(dataOrderVisitLocationDetail).then(() => {
                        })
                    })
                    toastAlert('success', 'Đặt vé thành công !');
                    $location.path(`/admin/detail-tour-list/${$routeParams.tourDetailId}/service-list/visit-information-list`);
                }, errorCallback).finally(() => {
                    $scope.isLoading = false;
                });
            }

            confirmAlert('Bạn có chắc chắn muốn đặt vé cho điểm tham quan này không ?', confirmSubmit);
        };

        $scope.toggleActivities = () => {
            $scope.showActivities = $scope.payment.method === '1';
        };

        const errorCallback = () => {
            $location.path('/admin/internal-server-error')
        }
    });