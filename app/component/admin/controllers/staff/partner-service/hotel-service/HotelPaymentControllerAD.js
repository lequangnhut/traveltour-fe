travel_app.controller('HotelPaymentControllerAD',
    function ($scope, $location, $routeParams, OrderHotelServiceAD, OrderHotelDetailServiceAD,
              CustomerServiceAD, TourDetailsServiceAD) {
        $scope.showActivities = false;
        const tourDetailId = $routeParams.tourDetailId;
        $scope.tourDetailId = tourDetailId;
        $scope.hotelId = $routeParams.hotelId;
        $scope.payment = {method: '0'};
        $scope.tourGuide = {};
        $scope.orderHotel = {};
        $scope.selectedRooms = JSON.parse(sessionStorage.getItem('selectedRooms')) || [];
        $scope.infoHotel = JSON.parse(sessionStorage.getItem('infoHotel')) || {};
        $scope.totalBeforeTax = 0;
        $scope.VATRate = 8; // 8% VAT
        $scope.discountRate = 0; // 0% Discount for now
        $scope.VATAmount = 0;
        $scope.discountAmount = 0;
        $scope.total = calculateTotal($scope.selectedRooms);
        $scope.tourGuide = {};

        function calculateTotal(rooms) {
            $scope.totalBeforeTax = rooms.reduce((acc, room) => acc + room.price * room.quantity, 0);
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

        const yourBooking = () => {
            $scope.orderHotel = {
                userId: $scope.tourGuide.id,
                customerName: $scope.tourGuide.fullName,
                customerCitizenCard: $scope.tourGuide.citizenCard,
                customerPhone: $scope.tourGuide.phone,
                customerEmail: $scope.tourGuide.email,
                capacityAdult: $scope.infoHotel.capacityAdult,
                capacityKid: $scope.infoHotel.capacityKid,
                checkIn: JSON.parse(sessionStorage.getItem('infoHotel')).departureDate,
                checkOut: JSON.parse(sessionStorage.getItem('infoHotel')).arrivalDate,
                orderTotal: $scope.total,
                paymentMethod: $scope.payment.method !== '0',
                dateCreated: new Date(),
                orderStatus: $scope.payment.method,
            }

            $scope.isLoading = true;
            let orderHotel = $scope.orderHotel;
            const dataOrderHotel = new FormData();

            dataOrderHotel.append("orderHotelsDto", new Blob([JSON.stringify(orderHotel)], {type: "application/json"}));
            dataOrderHotel.append("tourDetailId", tourDetailId);

            OrderHotelServiceAD.createOrderHotel(dataOrderHotel).then(function successCallback(repo) {
                let orderHotelId = repo.data.data.id;
                $scope.selectedRooms.forEach(item => {
                    let orderHotelDetail = {
                        orderHotelId: orderHotelId,
                        roomTypeId: item.id,
                        amount: item.quantity,
                        unitPrice: item.price,
                    }
                    const dataOrderHotelDetail = new FormData();
                    dataOrderHotelDetail.append("orderHotelDetailsDto", new Blob([JSON.stringify(orderHotelDetail)], {type: "application/json"}));
                    OrderHotelDetailServiceAD.createOrderHotelDetail(dataOrderHotelDetail).then(function successCallback() {
                    })
                })
                toastAlert('success', 'Thêm mới thành công !');
                $location.path(`/admin/detail-tour-list/${tourDetailId}/service-list/hotel-list`);
            }, errorCallback).finally(function () {
                $scope.isLoading = false;
            });
        };

        $scope.ConfirmationOfCompleteBooking = () => {
            confirmAlert('Bạn có chắc chắn muốn đặt phòng không ?', () => {
                yourBooking()
            });
        }

        $scope.toggleActivities = function () {
            $scope.showActivities = $scope.payment.method === '1';
        };

        function errorCallback() {
            $location.path('/admin/internal-server-error')
        }

    });
