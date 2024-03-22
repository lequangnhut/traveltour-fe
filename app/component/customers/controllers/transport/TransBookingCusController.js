travel_app.controller('TransBookingCusController',
    function ($scope, $location, $routeParams, LocalStorageService, AuthService, TransportationScheduleServiceAD, BookingTransportCusService) {

        let user = AuthService.getUser();

        if (LocalStorageService.get('dataBookingTransport') === null) {
            centerAlert('Cảnh báo', 'Chúng tôi nhận thấy bạn đang truy cập bất thường vào trang này, vui lòng rời khỏi !', 'warning');
            $location.path('/drive-move');
            return;
        }

        if (!user) {
            LocalStorageService.set('redirectAfterLogin', $location.path());
        }

        $scope.checkPrivatePolicy = false;
        $scope.selectedPaymentMethod = '';
        $scope.showPaymentGuide = {
            Travel: false,
            Momo: false,
            VNPay: false,
            ZaloPay: false
        };

        $scope.bookingTransport = {
            id: null,
            userId: null,
            transportationScheduleId: null,
            customerName: null,
            customerCitizenCard: null,
            customerPhone: null,
            customerEmail: null,
            amountTicket: null,
            orderTotal: null,
            paymentMethod: null,
            orderCode: null,
            dateCreated: null,
            orderStatus: null,
            orderNote: null
        }

        /**
         * Chọn phương thức thanh toán
         * @param paymentMethod
         */
        $scope.togglePaymentGuide = function (paymentMethod) {
            angular.forEach($scope.showPaymentGuide, function (value, key) {
                $scope.showPaymentGuide[key] = false;
            });
            $scope.showPaymentGuide[paymentMethod] = true;
        };

        /**
         * Hàm trở về trang trước mã hóa id
         */
        $scope.goBack = function () {
            $location.path('/drive-move/drive-transport-detail/' + $routeParams.brandId);
        };

        $scope.init = function () {
            $scope.scheduleId = JSON.parse(atob($routeParams.scheduleId));

            /**
             * Tìm đối tượng nhà xe
             */
            TransportationScheduleServiceAD.findById($scope.scheduleId).then(function (response) {
                if (response.status === 200) {
                    $scope.transportSchedule = response.data.data;
                    $scope.totalAmountSeat = LocalStorageService.get('dataBookingTransport').totalAmountSeat;
                    $scope.totalPrice = LocalStorageService.get('dataBookingTransport').totalPrice;
                    $scope.seatNumber = LocalStorageService.get('dataBookingTransport').seatNumber;
                } else {
                    $location.path('/admin/page-not-found');
                }
            }).finally(function () {
                $scope.isLoading = false;
            });
        }

        /**
         * Phương thức submit booking xét điều kiện để thanh toán
         */
        $scope.submitBooking = function () {
            if (!$scope.selectedPaymentMethod) {
                centerAlert('Xác nhận !', 'Vui lòng chọn phương thức thanh toán.', 'warning');
                return;
            } else if ($scope.checkPrivatePolicy === false) {
                centerAlert('Xác nhận !', 'Vui lòng chấp nhận điều khoản, điều kiện.', 'warning')
                return;
            }

            let paymentMethod = $scope.selectedPaymentMethod;

            if (paymentMethod === 'Travel') {
                $scope.paymentTravel();
            } else if (paymentMethod === 'VNPay') {
                $scope.paymentVNPay();
            } else if (paymentMethod === 'ZaloPay') {
                $scope.paymentZaLoPay();
            } else if (paymentMethod === 'Momo') {
                $scope.paymentMomo();
            }
        }

        $scope.init();

        /**
         * Thanh toán tại quầy
         */
        $scope.paymentTravel = function () {
            let seatNumber = $scope.seatNumber;
            let orderTransport = $scope.bookingTransport;

            orderTransport.transportationScheduleId = $scope.scheduleId;
            orderTransport.amountTicket = $scope.totalAmountSeat;
            orderTransport.orderTotal = $scope.totalPrice;
            orderTransport.paymentMethod = 0; // thanh toán tại quầy

            if (user !== null) {
                if (user.roles.some(role => role.nameRole === 'ROLE_CUSTOMER')) {
                    orderTransport.userId = user.id;
                } else {
                    LocalStorageService.remove('user');
                }
            }

            function confirmBookTour() {
                BookingTransportCusService.createBookingTransport(orderTransport, seatNumber).then(function (response) {
                    console.log(response)
                });
            }

            confirmAlert('Bạn có chắc chắn địa chỉ email: ' + $scope.bookingTransport.customerEmail + ' là chính xác không ?', confirmBookTour);
        }

        $scope.paymentVNPay = function () {
            if (user !== null) {
                if (user.roles.some(role => role.nameRole === 'ROLE_CUSTOMER')) {
                    console.log(user.id)
                } else {
                    LocalStorageService.remove('user');
                }
            }

            function confirmBookTour() {
                console.log($scope.bookingTransport)
            }

            confirmAlert('Bạn có chắc chắn địa chỉ email: ' + $scope.bookingTransport.customerEmail + ' là chính xác không ?', confirmBookTour);
        }

        $scope.paymentZaLoPay = function () {
            if (user !== null) {
                if (user.roles.some(role => role.nameRole === 'ROLE_CUSTOMER')) {
                    console.log(user.id)
                } else {
                    LocalStorageService.remove('user');
                }
            }

            function confirmBookTour() {
                console.log($scope.bookingTransport)
            }

            confirmAlert('Bạn có chắc chắn địa chỉ email: ' + $scope.bookingTransport.customerEmail + ' là chính xác không ?', confirmBookTour);
        }

        $scope.paymentMomo = function () {
            if (user !== null) {
                if (user.roles.some(role => role.nameRole === 'ROLE_CUSTOMER')) {
                    console.log(user.id)
                } else {
                    LocalStorageService.remove('user');
                }
            }

            function confirmBookTour() {
                console.log($scope.bookingTransport)
            }

            confirmAlert('Bạn có chắc chắn địa chỉ email: ' + $scope.bookingTransport.customerEmail + ' là chính xác không ?', confirmBookTour);
        }

        $scope.$on('$routeChangeStart', function (event, next, current) {
            if (next.controller !== 'TransBookingCusController' && next.controller !== 'LoginController' && next.controller !== 'MainController') {
                LocalStorageService.remove('dataBookingTransport');
                LocalStorageService.remove('redirectAfterLogin');
            }
        });
    })