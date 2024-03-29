travel_app.controller('TransBookingCusController',
    function ($scope, $location, $routeParams, $interval, LocalStorageService, $window, GenerateCodePayService, AuthService, TransportationScheduleServiceAD, BookingTransportCusService) {
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
                    let dataBookingTransport = LocalStorageService.get('dataBookingTransport');
                    let decryptDataBookingTransport = LocalStorageService.decryptData(dataBookingTransport, 'encryptBookingTransport');

                    $scope.transportSchedule = response.data.data;
                    $scope.totalAmountSeat = decryptDataBookingTransport.totalAmountSeat;
                    $scope.totalPrice = decryptDataBookingTransport.totalPrice;
                    $scope.seatNumber = decryptDataBookingTransport.seatNumber;
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
            let transportSchedule = $scope.transportSchedule;
            let orderTransport = $scope.bookingTransport;

            orderTransport.id = GenerateCodePayService.generateCodeBooking('VPO', transportSchedule.id);
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
                $scope.isLoading = true;

                BookingTransportCusService.createBookingTransport(orderTransport, seatNumber).then(function (response) {
                    if (response.status === 200) {
                        let dataBookingTransportSuccess = {
                            orderTransport: response.data.data,
                            transportSchedule: transportSchedule,
                            seatNumber: seatNumber
                        }
                        LocalStorageService.set('dataBookingTransportSuccess', dataBookingTransportSuccess);

                        $location.path('/drive-move/drive-transport-detail/booking-confirmation/booking-successfully');
                    } else {
                        $location.path('/admin/page-not-found');
                    }
                }).finally(function () {
                    $scope.isLoading = false;
                });
            }

            confirmAlert('Bạn có chắc chắn địa chỉ email: ' + $scope.bookingTransport.customerEmail + ' là chính xác không ?', confirmBookTour);
        }

        $scope.paymentVNPay = function () {
            let seatNumber = $scope.seatNumber;
            let transportSchedule = $scope.transportSchedule;
            let orderTransport = $scope.bookingTransport;

            orderTransport.id = GenerateCodePayService.generateCodeBooking('VNPAY', transportSchedule.id);
            orderTransport.transportationScheduleId = $scope.scheduleId;
            orderTransport.amountTicket = $scope.totalAmountSeat;
            orderTransport.orderTotal = $scope.totalPrice;
            orderTransport.paymentMethod = 1; // thanh toán bằng VNPay

            if (user !== null) {
                if (user.roles.some(role => role.nameRole === 'ROLE_CUSTOMER')) {
                    orderTransport.userId = user.id;
                } else {
                    LocalStorageService.remove('user');
                }
            }

            function confirmBookTour() {
                $scope.isLoading = true;

                let scheduleId = transportSchedule.id;
                let orderInfo = orderTransport.id;
                let amountTicker = orderTransport.amountTicket;

                BookingTransportCusService.redirectVNPayTransport(orderTransport, scheduleId, orderInfo, amountTicker, seatNumber).then(function (response) {
                    if (response.status === 200) {
                        let dataBookingTransportSuccess = {
                            orderTransport: orderTransport,
                            transportSchedule: transportSchedule,
                            seatNumber: seatNumber
                        }
                        LocalStorageService.set('dataBookingTransportSuccess', dataBookingTransportSuccess);
                        $window.location.href = response.data.redirectUrl;
                    } else {
                        $location.path('/admin/page-not-found');
                    }
                }).finally(function () {
                    $scope.isLoading = false;
                });
            }

            confirmAlert('Bạn có chắc chắn địa chỉ email: ' + $scope.bookingTransport.customerEmail + ' là chính xác không ?', confirmBookTour);
        }

        $scope.paymentMomo = function () {
            let seatNumber = $scope.seatNumber;
            let transportSchedule = $scope.transportSchedule;
            let orderTransport = $scope.bookingTransport;

            orderTransport.id = GenerateCodePayService.generateCodeBooking('MOMO', transportSchedule.id);
            orderTransport.transportationScheduleId = $scope.scheduleId;
            orderTransport.amountTicket = $scope.totalAmountSeat;
            orderTransport.orderTotal = $scope.totalPrice;
            orderTransport.paymentMethod = 3; // thanh toán bằng Momo


            if (user !== null) {
                if (user.roles.some(role => role.nameRole === 'ROLE_CUSTOMER')) {
                    orderTransport.userId = user.id;
                } else {
                    LocalStorageService.remove('user');
                }
            }

            function confirmBookTour() {
                $scope.isLoading = true;

                BookingTransportCusService.redirectMomoTransport(orderTransport, seatNumber).then(function (response) {
                    if (response.status === 200) {
                        let dataBookingTransportSuccess = {
                            orderTransport: orderTransport,
                            transportSchedule: transportSchedule,
                            seatNumber: seatNumber
                        }
                        LocalStorageService.set('dataBookingTransportSuccess', dataBookingTransportSuccess);
                        $window.location.href = response.data.redirectUrl;
                    } else {
                        $location.path('/admin/page-not-found');
                    }
                }).finally(function () {
                    $scope.isLoading = false;
                });
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

        /**
         * Đếm thời gian thanh toán
         */
        let savedTime = LocalStorageService.get('countdownTime');
        let decryptCountdownTime = LocalStorageService.decryptData(savedTime, 'encryptCountdownTime');
        let countdownTime = decryptCountdownTime ? JSON.parse(decryptCountdownTime) : {minutes: 10, seconds: 0};

        $scope.minutes = countdownTime.minutes;
        $scope.seconds = countdownTime.seconds;

        let intervalPromise = $interval(function () {
            if ($scope.seconds > 0 || $scope.minutes > 0) {
                $scope.seconds--;
                if ($scope.seconds < 0) {
                    $scope.seconds = 59;
                    $scope.minutes--;
                }
            } else {
                LocalStorageService.remove('countdownTime');
                $location.path('/drive-move');
                centerAlert('Thất bại', 'Đã hết thời gian thanh toán quý khách vui lòng đặt vé khác', 'warning');
                return;
            }

            let countdownTime = JSON.stringify({
                minutes: $scope.minutes,
                seconds: $scope.seconds
            });
            let encryptCountdownTime = LocalStorageService.encryptData(countdownTime, 'encryptCountdownTime');
            LocalStorageService.set('countdownTime', encryptCountdownTime);

        }, 1000);

        $scope.$on('$destroy', function () {
            $interval.cancel(intervalPromise);
        });

        /**
         * Bắt sự kiện nếu người dùng click ra khỏi trang này thì hiện thông báo
         */
        $scope.$on('$locationChangeStart', function (event) {
            event.preventDefault();

            function confirm() {
                $window.location.href = '/drive-move'
                LocalStorageService.remove('dataBookingTransport');
                LocalStorageService.remove('redirectAfterLogin');
                LocalStorageService.remove('countdownTime');
                LocalStorageService.remove('dataBookingTransportSuccess');
            }

            confirmAlert('Nếu bạn rời khỏi trang này, quá trình thanh toán sẽ bị hủy bỏ và dữ liệu đã nhập sẽ bị mất. Bạn có muốn tiếp tục rời khỏi trang ?', confirm);
        });
    })