travel_app.controller('HotelPaymentControllerAD',
    function ($scope, $location, $routeParams, $sce, OrderHotelServiceAD, OrderHotelDetailServiceAD,
              CustomerServiceAD, TourDetailsServiceAD, LocalStorageService, GenerateCodePayService,
              Base64ObjectService) {
        $scope.showActivities = false;

        const tourDetailId = Base64ObjectService.decodeObject($routeParams.tourDetailId);
        const hotelId = Base64ObjectService.decodeObject($routeParams.hotelId);

        $scope.tourDetailId = $routeParams.tourDetailId;
        $scope.hotelId = $routeParams.hotelId;

        $scope.tourGuide = {};
        $scope.orderHotel = {};

        $scope.selectedRooms = LocalStorageService.decryptLocalData('selectedRooms', 'encryptSelectedRooms') || [];
        $scope.infoHotel = LocalStorageService.decryptLocalData('infoHotel', 'encryptInfoHotel') || {};

        $scope.totalBeforeTax = 0;
        $scope.VATRate = 8; // 8% VAT
        $scope.discountRate = 0; // 0% Discount for now
        $scope.VATAmount = 0;
        $scope.discountAmount = 0;
        $scope.total = calculateTotal($scope.selectedRooms);

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

        $scope.ConfirmationOfCompleteBooking = () => {
            confirmAlert('Bạn có chắc chắn muốn đặt phòng không ?', () => {
                $scope.paymentTravel();
            });
        }

        const errorCallback = () => {
            $location.path('/admin/internal-server-error')
        }


        $scope.paymentTravel = () => {
            $scope.isLoading = true;

            $scope.orderHotel = {
                id: GenerateCodePayService.generateCodeBooking('VPO',hotelId),
                userId: $scope.tourGuide.id,
                customerName: $scope.tourGuide.fullName,
                customerCitizenCard: $scope.tourGuide.citizenCard,
                customerPhone: $scope.tourGuide.phone,
                customerEmail: $scope.tourGuide.email,
                capacityAdult: $scope.infoHotel.capacityAdult,
                capacityKid: $scope.infoHotel.capacityKid,
                checkIn: LocalStorageService.decryptLocalData('infoHotel', 'encryptInfoHotel').departureDate,
                checkOut: LocalStorageService.decryptLocalData('infoHotel', 'encryptInfoHotel').arrivalDate,
                orderTotal: $scope.total,
                paymentMethod: 'VPO',
                dateCreated: new Date(),
                orderStatus: 0, //cho thanh toan
                orderCode: GenerateCodePayService.generateCodePayment('VPO')
            }

            let orderHotel = $scope.orderHotel;
            const dataOrderHotel = new FormData();

            dataOrderHotel.append("orderHotelsDto", new Blob([JSON.stringify(orderHotel)], {type: "application/json"}));
            dataOrderHotel.append("tourDetailId", tourDetailId);

            OrderHotelServiceAD.createOrderHotel(dataOrderHotel).then((repo) => {
                let orderHotelId = repo.data.data.id;
                $scope.selectedRooms.forEach(item => {
                    let orderHotelDetail = {
                        orderHotelId: orderHotelId, roomTypeId: item.id, amount: item.quantity, unitPrice: item.price,
                    }
                    const dataOrderHotelDetail = new FormData();
                    dataOrderHotelDetail.append("orderHotelDetailsDto", new Blob([JSON.stringify(orderHotelDetail)], {type: "application/json"}));
                    OrderHotelDetailServiceAD.createOrderHotelDetail(dataOrderHotelDetail).then(() => {
                    })
                })
                toastAlert('success', 'Thêm mới thành công !');
                $location.path(`/admin/detail-tour-list/${$routeParams.tourDetailId}/service-list/hotel-list`);
            }, errorCallback).finally(() => {
                $scope.isLoading = false;
            });
        }


    });
