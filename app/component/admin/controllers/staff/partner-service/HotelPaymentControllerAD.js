travel_app.controller('HotelPaymentControllerAD', function ($scope, $location, $routeParams, OrderHotelServiceAD, OrderHotelDetailServiceAD, CustomerServiceAD) {
    $scope.showActivities = false;
    const tourDetailId = $routeParams.tourDetailId;
    $scope.payment = {method: ''};
    $scope.tourGuide = {};
    $scope.orderHotel = {};
    $scope.selectedRooms = JSON.parse(sessionStorage.getItem('selectedRooms')) || [];
    $scope.infoHotel = JSON.parse(sessionStorage.getItem('infoHotel')) || {};
    $scope.tourGuideId = sessionStorage.getItem('tourGuideId') || '';
    $scope.totalBeforeTax = 0;
    $scope.VATRate = 8; // 8% VAT
    $scope.discountRate = 0; // 0% Discount for now
    $scope.VATAmount = 0;
    $scope.discountAmount = 0;
    $scope.total = calculateTotal($scope.selectedRooms);

    // Sử dụng hàm này để format các ngày từ infoHotel
    $scope.formatDates = function () {
        $scope.infoHotel.departureDate = formatDateTime($scope.infoHotel.departureDate);
        $scope.infoHotel.arrivalDate = formatDateTime($scope.infoHotel.arrivalDate);
    };

    function calculateTotal(rooms) {
        $scope.totalBeforeTax = rooms.reduce((acc, room) => acc + room.price * room.quantity, 0);
        $scope.VATAmount = $scope.totalBeforeTax * ($scope.VATRate / 100);
        $scope.discountAmount = $scope.totalBeforeTax * ($scope.discountRate / 100);

        return $scope.totalBeforeTax + $scope.VATAmount - $scope.discountAmount;
    }


    function formatDateTime(dateString) {
        let date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;

        // Định dạng ngày giờ với AM/PM
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // Giờ '0' sẽ được hiểu là '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        let strTime = hours + ':' + minutes + ' ' + ampm;

        let day = date.getDate().toString().padStart(2, '0');
        let month = (date.getMonth() + 1).toString().padStart(2, '0'); // Tháng trong JavaScript bắt đầu từ 0
        let year = date.getFullYear();

        return day + '/' + month + '/' + year + ' ' + strTime;
    }


    if ($scope.tourGuideId) {
        CustomerServiceAD.findCustomerById($scope.tourGuideId).then(response => {
            $scope.tourGuide = response.data.data;
        });
    }

    $scope.completeYourBooking = function () {
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
            paymentMethod: false,
            dateCreated: new Date(),
            orderStatus: 1,
        }

        $scope.isLoading = true;
        let orderHotel = $scope.orderHotel;
        const dataOrderHotel = new FormData();

        dataOrderHotel.append("orderHotelsDto", new Blob([JSON.stringify(orderHotel)], {type: "application/json"}));

        OrderHotelServiceAD.createOrderHotel(dataOrderHotel).then(function successCallback(repo) {
            let orderHotelId = repo.data.data.id;
            $scope.selectedRooms.forEach(item => {
                let orderHotelDetail = {
                    orderHotelId: orderHotelId,
                    roomTypeId: item.id,
                    amount: item.quantity,
                    unitPrice: item.price,
                }
                console.log(orderHotelDetail)
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

    $scope.toggleActivities = function () {
        $scope.showActivities = $scope.payment.method === '2';
    };

    $scope.formatDates();

    function errorCallback() {
        $location.path('/admin/internal-server-error')
    }

    console.log($scope.selectedRooms)
});
