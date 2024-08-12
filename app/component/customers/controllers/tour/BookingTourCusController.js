travel_app.controller('BookingTourCusController',
    function ($scope, $sce, $location, $rootScope, $window, $routeParams, AuthService, LocalStorageService, BookingTourCusService,
              TourDetailCusService, GenerateCodePayService, Base64ObjectService) {

        let user = AuthService.getUser();
        let tourDetailId = Base64ObjectService.decodeObject($routeParams.id);
        $scope.tourDetailIdBase64 = $routeParams.id;

        if (!user) {
            LocalStorageService.set('redirectAfterLogin', $location.path());
        }

        $scope.showForm = false;
        $scope.checkPrivatePolicy = false;
        $scope.selectedPaymentMethod = '';
        $scope.selectedContent = '';

        $scope.bookingCustomerList = [];

        $scope.paymentMethods = {
            VNPay: "TravelTour chấp nhận thanh toán bằng VNPay. Với hạn mức lên đến 20.000.000 VNĐ",
            ZaloPay: "TravelTour chấp nhận thanh toán bằng ZaloPay.",
            Momo: "TravelTour chấp nhận thanh toán bằng Ví điện tử Momo. (*) Hạn mức tối đa là 20.000.000 VNĐ",
            Travel: "Quý khách vui lòng đến các văn phòng TravelTour để thanh toán và nhận vé."
        };

        $scope.showContent = function (paymentMethod) {
            $scope.selectedContent = $sce.trustAsHtml($scope.paymentMethods[paymentMethod]);
        };

        $scope.service = {
            discountCode: null,
            paymentMethod: null
        }

        $scope.bookings_tour = {
            id: null,
            userId: null,
            tourDetailId: tourDetailId,
            customerName: null,
            customerCitizenCard: null,
            customerPhone: null,
            customerEmail: null,
            capacityAdult: null,
            capacityKid: null,
            capacityBaby: null,
            orderTotal: null,
            paymentMethod: null,
            orderCode: null,
            orderNote: null
        }

        $scope.bookings_tour_customer = {
            id: null,
            bookingTourId: null,
            customerName: null,
            customerBirth: null,
            customerPhone: null
        }

        function errorCallback() {
            $location.path('/admin/internal-server-error')
        }

        $scope.init = function () {
            let dataBooking = LocalStorageService.decryptLocalData('dataBooking', 'encryptDataBooking');

            if (dataBooking === null) {
                centerAlert('Cảnh báo', 'Chúng tôi nhận thấy bạn đang truy cập bất thường vào trang này, vui lòng rời khỏi !', 'warning');
                $location.path('/tours');
                return;
            }

            $scope.ticket = dataBooking.ticket;
            $scope.totalPrice = dataBooking.totalPrice;
            $scope.tourDetail = dataBooking.tourDetail;
            $scope.provinceName = dataBooking.provinceName;

            $scope.totalQuantityTicket = Object.values($scope.ticket).reduce((total, value) => total + parseInt(value), 0);
            $scope.ticketArray = Array.from({length: $scope.totalQuantityTicket}, (_, index) => index);

            /**
             * Hàm này dùng để tính discount code
             */
            $scope.submitDiscountCode = function () {
                let discountCode = $scope.service.discountCode;
            }

            /**
             * Hàm này để check xem có đủ điều kiện để vượt form không
             */
            $scope.acceptPassForm = function () {
                if (!$scope.service.paymentMethod) {
                    centerAlert('Xác nhận !', 'Vui lòng chọn phương thức thanh toán.', 'warning')
                } else if ($scope.checkPrivatePolicy === false) {
                    centerAlert('Xác nhận !', 'Vui lòng chấp nhận điều khoản, điều kiện.', 'warning')
                } else {
                    LocalStorageService.encryptLocalData($scope.service, 'serviceCustomer', 'encryptServiceCustomer');
                    $location.path('/tours/tour-detail/' + $scope.tourDetailIdBase64 + '/booking-tour/customer-information');
                }
            };

            /**
             * Kiểm tra ngày sinh trên form (lớn hơn 2 tuổi)
             * @param birthDate
             * @returns {boolean}
             */
            $scope.isBirthDateInvalid = function (birthDate) {
                let selectedDate = new Date(birthDate);
                let currentDate = new Date();
                currentDate.setFullYear(currentDate.getFullYear() - 2);
                return selectedDate >= currentDate;
            };

            /**
             * Phương thức lấy hình thức thanh toán so sánh để thanh toán
             */
            $scope.submitBooking = function () {
                let paymentMethod = LocalStorageService.decryptLocalData('serviceCustomer', 'encryptServiceCustomer').paymentMethod;

                if (paymentMethod === 'Travel') {
                    $scope.paymentTravel();
                } else if (paymentMethod === 'VNPay') {
                    $scope.paymentVNPay();
                } else if (paymentMethod === 'ZaloPay') {
                    $scope.paymentZaLoPay();
                } else if (paymentMethod === 'Momo') {
                    $scope.paymentMomo();
                }

                $scope.addCustomerToList();
            }

            /**
             * click vào để show ra form thêm thông tin khách hàng
             */
            $scope.showFormImportInfo = function () {
                $scope.showForm = !$scope.showForm;
            }

            /**
             * Phưương thức thay đổi icon khi nhấn vào xem thêm bên tour
             */
            $scope.getChangeIconTour = function () {
                if ($scope.showForm) {
                    if ($scope.showForm === -1) {
                        return $sce.trustAsHtml('<svg class="svg-inline--fa fa-angle-down" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="angle-down" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" data-fa-i2svg=""><path fill="currentColor" d="M192 384c-8.188 0-16.38-3.125-22.62-9.375l-160-160c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L192 306.8l137.4-137.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-160 160C208.4 380.9 200.2 384 192 384z"></path></svg>');
                    } else {
                        return $sce.trustAsHtml('<svg class="svg-inline--fa fa-angle-up" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="angle-up" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" data-fa-i2svg=""><path fill="currentColor" d="M352 352c-8.188 0-16.38-3.125-22.62-9.375L192 205.3l-137.4 137.4c-12.5 12.5-32.75 12.5-45.25 0s-12.5-32.75 0-45.25l160-160c12.5-12.5 32.75-12.5 45.25 0l160 160c12.5 12.5 12.5 32.75 0 45.25C368.4 348.9 360.2 352 352 352z"></path></svg>');
                    }
                }
                return $sce.trustAsHtml('<svg class="svg-inline--fa fa-angle-down" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="angle-down" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" data-fa-i2svg=""><path fill="currentColor" d="M192 384c-8.188 0-16.38-3.125-22.62-9.375l-160-160c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L192 306.8l137.4-137.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-160 160C208.4 380.9 200.2 384 192 384z"></path></svg>');
            };

            /**
             * Phương thức thêm tất cả người dùng vào csdl
             */
            $scope.addCustomerToList = function () {
                let widgets = document.querySelectorAll('.sidebar-widget.category-widget.mb-30');
                widgets.forEach(function (widget, index) {
                    let customer = {};

                    let inputs = widget.querySelectorAll('input[type="text"], input[type="date"], input[type="tel"]');
                    let hasValidData = false;
                    inputs.forEach(function (input) {
                        let key = input.getAttribute('name').replace('customer', '');
                        let value = input.value;
                        if (value.trim() !== '') {
                            hasValidData = true;
                        }
                        customer[key] = value;
                    });

                    if (hasValidData) {
                        $scope.bookingCustomerList.push(customer);
                    }
                });
            };
        }

        $scope.init();

        // ======= Từ chổ này viết hàm để gọi vào submitBooking =======
        $scope.paymentTravel = function () {
            if (user !== null) {
                if (user.roles.some(role => role.nameRole === 'ROLE_CUSTOMER')) {
                    $scope.bookings_tour.userId = user.id;
                } else {
                    LocalStorageService.remove('user');
                }
            }

            let ticket = $scope.ticket;
            let email = $scope.bookings_tour.customerEmail;
            let totalPrice = $scope.totalPrice;
            let tourDetail = $scope.tourDetail;

            $scope.bookings_tour.id = GenerateCodePayService.generateCodeBooking('VPO', tourDetail.id);
            $scope.bookings_tour.capacityAdult = ticket.adults;
            $scope.bookings_tour.capacityKid = ticket.children;
            $scope.bookings_tour.capacityBaby = ticket.baby;
            $scope.bookings_tour.orderTotal = totalPrice;
            $scope.bookings_tour.paymentMethod = 0; // 0: Travel
            $scope.bookings_tour.dateBookingTour = new Date().getTime();
            $scope.bookings_tour.orderCode = GenerateCodePayService.generateCodePayment('VPO');

            let bookingDto = {
                bookingToursDto: $scope.bookings_tour,
                bookingTourCustomersDto: $scope.bookingCustomerList
            }

            function confirmBookTour() {
                $scope.isLoading = true;

                BookingTourCusService.createBookTour(bookingDto).then(function successCallBack(response) {
                    if (response.status === 200) {
                        LocalStorageService.encryptLocalData(bookingDto, 'bookingDto', 'encryptBookingDto');
                        LocalStorageService.encryptLocalData(bookingDto.bookingToursDto, 'bookingTicket', 'encryptBookingTicket');

                        toastAlert('success', 'Đặt tour thành công !');
                        $location.path('/tours/tour-detail/booking-tour/customer-information/payment-success');
                        $scope.bookingCustomerList.splice(0, $scope.bookingCustomerList.length);
                    } else {
                        $location.path('/admin/page-not-found')
                    }
                }, errorCallback).finally(function () {
                    $scope.isLoading = false;
                });
            }

            confirmAlert('Bạn có chắc chắn địa chỉ email: ' + email + ' là chính xác không ?', confirmBookTour);
        }

        $scope.paymentVNPay = function () {
            if (user !== null) {
                if (user.roles.some(role => role.nameRole === 'ROLE_CUSTOMER')) {
                    $scope.bookings_tour.userId = user.id;
                } else {
                    LocalStorageService.remove('user');
                }
            }

            let ticket = $scope.ticket;
            let email = $scope.bookings_tour.customerEmail;
            let totalPrice = $scope.totalPrice;
            let tourDetail = $scope.tourDetail;

            $scope.bookings_tour.id = GenerateCodePayService.generateCodeBooking('VNPAY', tourDetail.id);
            $scope.bookings_tour.capacityAdult = ticket.adults;
            $scope.bookings_tour.capacityKid = ticket.children;
            $scope.bookings_tour.capacityBaby = ticket.baby;
            $scope.bookings_tour.orderTotal = totalPrice;
            $scope.bookings_tour.paymentMethod = 1; // 1: VNPay
            $scope.bookings_tour.dateBookingTour = new Date().getTime();
            $scope.bookings_tour.orderCode = GenerateCodePayService.generateCodePayment('VNPAY');

            function confirmBookTour() {
                $scope.isLoading = true;

                let bookingDto = {
                    bookingToursDto: $scope.bookings_tour,
                    bookingTourCustomersDto: $scope.bookingCustomerList
                }

                BookingTourCusService.redirectVNPay(bookingDto).then(function successCallBack(response) {
                    if (response.status === 200) {
                        LocalStorageService.encryptLocalData(bookingDto, 'bookingDto', 'encryptBookingDto');
                        LocalStorageService.encryptLocalData(bookingDto.bookingToursDto, 'bookingTicket', 'encryptBookingTicket');

                        $window.location.href = response.data.redirectUrl;
                        $scope.bookingCustomerList.splice(0, $scope.bookingCustomerList.length);
                    } else {
                        $location.path('/admin/page-not-found')
                    }
                }, errorCallback).finally(function () {
                    $scope.isLoading = false;
                });
            }

            confirmAlert('Bạn có chắc chắn địa chỉ email: ' + email + ' là chính xác không ?', confirmBookTour);
        }

        $scope.paymentMomo = function () {
            if (user !== null) {
                if (user.roles.some(role => role.nameRole === 'ROLE_CUSTOMER')) {
                    $scope.bookings_tour.userId = user.id;
                } else {
                    LocalStorageService.remove('user');
                }
            }

            let ticket = $scope.ticket;
            let email = $scope.bookings_tour.customerEmail;
            let totalPrice = $scope.totalPrice;
            let tourDetail = $scope.tourDetail;

            $scope.bookings_tour.id = GenerateCodePayService.generateCodeBooking('MOMO', tourDetail.id);
            $scope.bookings_tour.capacityAdult = ticket.adults;
            $scope.bookings_tour.capacityKid = ticket.children;
            $scope.bookings_tour.capacityBaby = ticket.baby;
            $scope.bookings_tour.orderTotal = totalPrice;
            $scope.bookings_tour.paymentMethod = 3; // 3: MOMO
            $scope.bookings_tour.dateBookingTour = new Date().getTime();
            $scope.bookings_tour.orderCode = GenerateCodePayService.generateCodePayment('MOMO');

            function confirmBookTour() {
                $scope.isLoading = true;

                let bookingDto = {
                    bookingToursDto: $scope.bookings_tour,
                    bookingTourCustomersDto: $scope.bookingCustomerList
                }

                BookingTourCusService.redirectMomo(bookingDto).then(function successCallBack(response) {
                    if (response.status === 200) {
                        LocalStorageService.encryptLocalData(bookingDto, 'bookingDto', 'encryptBookingDto');
                        LocalStorageService.encryptLocalData(bookingDto.bookingToursDto, 'bookingTicket', 'encryptBookingTicket');

                        $window.location.href = response.data.redirectUrl;
                        $scope.bookingCustomerList.splice(0, $scope.bookingCustomerList.length);
                    } else {
                        $location.path('/admin/page-not-found')
                    }
                }, errorCallback).finally(function () {
                    $scope.isLoading = false;
                });
            }

            confirmAlert('Bạn có chắc chắn địa chỉ email: ' + email + ' là chính xác không ?', confirmBookTour);
        }

        $scope.paymentZaLoPay = function () {
            if (user !== null) {
                if (user.roles.some(role => role.nameRole === 'ROLE_CUSTOMER')) {
                    $scope.bookings_tour.userId = user.id;
                } else {
                    LocalStorageService.remove('user');
                }
            }

            let ticket = $scope.ticket;
            let email = $scope.bookings_tour.customerEmail;
            let totalPrice = $scope.totalPrice;
            let tourDetail = $scope.tourDetail;
            let bookingTourId = GenerateCodePayService.generateCodeBooking('ZALOPAY', tourDetail.id);

            $scope.bookings_tour.id = bookingTourId;
            $scope.bookings_tour.capacityAdult = ticket.adults;
            $scope.bookings_tour.capacityKid = ticket.children;
            $scope.bookings_tour.capacityBaby = ticket.baby;
            $scope.bookings_tour.orderTotal = totalPrice;
            $scope.bookings_tour.paymentMethod = 2; // 2: ZALOPAY
            $scope.bookings_tour.orderCode = GenerateCodePayService.generateCodePayment('ZALOPAY');

            function confirmBookTour() {
                $scope.isLoading = true;

                let paymentData = {
                    amount: totalPrice,
                    bookingTourId: bookingTourId
                }

                BookingTourCusService.redirectZALOPay(paymentData).then(function successCallBack(response) {
                    if (response.status === 200) {
                        $window.location.href = response.data.data;
                        $scope.bookingCustomerList.splice(0, $scope.bookingCustomerList.length);
                    } else {
                        $location.path('/admin/page-not-found')
                    }
                }, errorCallback).finally(function () {
                    $scope.isLoading = false;
                });
            }

            confirmAlert('Bạn có chắc chắn địa chỉ email: ' + email + ' là chính xác không ?', confirmBookTour);
        }

        $scope.$on('$routeChangeStart', function (event, next, current) {
            if (next.controller !== 'BookingTourCusController' && next.controller !== 'BookingTourSuccessCusController' && next.controller !== 'LoginController') {
                LocalStorageService.remove('dataBooking');
                LocalStorageService.remove('bookingDto');
                LocalStorageService.remove('bookingTicket');
                LocalStorageService.remove('redirectAfterLogin');
            }
        });
    });
