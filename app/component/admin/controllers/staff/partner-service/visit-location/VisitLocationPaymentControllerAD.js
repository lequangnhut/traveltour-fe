travel_app.controller('VisitLocationPaymentControllerAD',
    function ($scope, $sce, $routeParams, $location, $timeout, $http, VisitLocationServiceAD, CustomerServiceAD,
              OrderVisitServiceAD, OrderVisitDetailServiceAD) {
        $scope.isLoading = true;
        $scope.showActivities = false;
        const tourDetailId = $routeParams.tourDetailId;
        const visitLocationId = $routeParams.visitLocationId;
        $scope.payment = {method: ''};
        $scope.tourGuide = {};
        $scope.orderVisitLocation = {};
        $scope.selectedTickets = JSON.parse(sessionStorage.getItem('selectedTickets')) || [];
        $scope.infoVisitLocation = JSON.parse(sessionStorage.getItem('infoVisitLocation')) || {};
        $scope.tourGuideId = sessionStorage.getItem('tourGuideId') || '';
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


        if ($scope.tourGuideId) {
            CustomerServiceAD.findCustomerById($scope.tourGuideId).then(response => {
                $scope.tourGuide = response.data.data;
            });
        }

        $scope.confirmCompletionOfTicketPurchase = function () {
            $scope.orderVisitLocation = {
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
                paymentMethod: false,
                dateCreated: new Date(),
                orderStatus: 1,
            }

            console.log($scope.orderVisitLocation)

            let orderVisitLocation = $scope.orderVisitLocation;
            const dataOrderVisitLocation = new FormData();

            dataOrderVisitLocation.append("orderVisitsDto", new Blob([JSON.stringify(orderVisitLocation)], {type: "application/json"}));

            OrderVisitServiceAD.createOrderVisit(dataOrderVisitLocation).then(function successCallback(repo) {
                let orderVisitLocationId = repo.data.data.id;

                $scope.selectedTickets.forEach(item => {
                    let orderVisitLocationDetail = {
                        orderVisitId: orderVisitLocationId,
                        visitLocationTicketId: item.id,
                        amount: item.quantity,
                        unitPrice: item.unitPrice,
                    }

                    console.log(orderVisitLocationDetail)

                    const dataOrderVisitLocationDetail = new FormData();
                    dataOrderVisitLocationDetail.append("orderVisitDetailsDto", new Blob([JSON.stringify(orderVisitLocationDetail)], {type: "application/json"}));
                    OrderVisitDetailServiceAD.createOrderVisitDetail(dataOrderVisitLocationDetail).then(function successCallback() {
                    })
                })
                toastAlert('success', 'Thêm mới thành công !');
                $location.path(`/admin/detail-tour-list/${tourDetailId}/service-list/visit-location-list`);
            }, errorCallback).finally(function () {
                $scope.isLoading = false;
            });
        };

        $scope.toggleActivities = function () {
            $scope.showActivities = $scope.payment.method === '2';
        };

        function errorCallback() {
            $location.path('/admin/internal-server-error')
        }
    });