travel_app.controller('BookingLocationCusController', function ($scope, $sce, $timeout, $location, $rootScope, $window, $routeParams, AuthService, LocalStorageService, BookingLocationCusService, TourDetailCusService, LocationDetailCusService, GenerateCodePayService) {

    const user = AuthService.getUser();
    const visitLocationId = JSON.parse(atob($routeParams.id));
    $scope.locationDetailIdBase64 = $routeParams.id;

    $scope.locationQr = encodeURIComponent('bé ơi từ từ, bé bé bé ơi từ từ'); //mã hóa
    // decodeURIComponent($scope.locationQr); dịch lại

    if (!user) {
        LocalStorageService.set('redirectAfterLogin', $location.path());
    }

    $scope.showForm = false;
    $scope.checkPrivatePolicy = false;
    $scope.selectedPaymentMethod = '';
    $scope.selectedContent = '';

    $scope.paymentMethods = {
        VNPay: "TravelTour chấp nhận thanh toán bằng VNPay. Với hạn mức lên đến 30.000.000 VNĐ",
        ZaloPay: "TravelTour chấp nhận thanh toán bằng ZaloPay.",
        Momo: "TravelTour chấp nhận thanh toán bằng Ví điện tử Momo. (*) Hạn mức tối đa là 20.000.000 VNĐ",
        Travel: "Quý khách vui lòng đến các văn phòng TravelTour để thanh toán và nhận vé."
    };

    $scope.showContent = function (paymentMethod) {
        $scope.selectedContent = $sce.trustAsHtml($scope.paymentMethods[paymentMethod]);
    };

    $scope.service = {
        discountCode: null, paymentMethod: null
    }

    $scope.bookingLocation = {
        userId: user ? user.id : null,
        visitLocationId,
        customerName: user ? user.fullName : null,
        customerCitizenCard: user ? user.citizenCard : null,
        customerPhone: user ? user.phone : null,
        customerEmail: user ? user.email : null,
    };

    function errorCallback() {
        $location.path('/admin/internal-server-error')
    }

    $scope.init = function () {

        $scope.isLoading = true;

        let decryptedDataBookingLocation = LocalStorageService.decryptLocalData('dataBookingLocation', 'encryptDataBookingLocation');
        if (decryptedDataBookingLocation === null || decryptedDataBookingLocation === undefined) {
            centerAlert('Cảnh báo', 'Chúng tôi nhận thấy bạn đang truy cập bất thường vào trang này, vui lòng rời khỏi !', 'warning');
            $location.path('/tourism-location');
            return;
        }

        $scope.tickets = decryptedDataBookingLocation;

        LocationDetailCusService.findById(visitLocationId).then((response) => {
            if (response.status === 200) {
                $scope.locationDetail = response.data.data;
            } else {
                $location.path('/admin/page-not-found')
            }
        }, errorCallback).finally(() => {
            $scope.isLoading = false;
        });


        /**
         * Hàm này dùng để tính discount code
         */
        $scope.submitDiscountCode = () => {
            let discountCode = $scope.service.discountCode;
        }
        $scope.codeQrOnChange = () => {
            const codeQr = $scope.bookingLocation.customerName + '/' + $scope.bookingLocation.customerEmail + '/' + $scope.bookingLocation.customerPhone;
            $scope.locationQr = encodeURIComponent(codeQr);
        };

        $scope.downloadQRCode = () => {
            let qrCanvas = document.querySelector('canvas');
            const imageUrl = qrCanvas.toDataURL('image/png');

            let downloadLink = document.createElement('a');
            downloadLink.href = imageUrl;
            downloadLink.download = 'qr-code.png';

            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        };

        /**
         * Hàm này để check xem có đủ điều kiện để vượt form không
         */
        $scope.acceptPassForm = function () {
            if (!$scope.service.paymentMethod) {
                centerAlert('Xác nhận !', 'Vui lòng chọn phương thức thanh toán.', 'warning')
            } else if ($scope.checkPrivatePolicy === false) {
                centerAlert('Xác nhận !', 'Vui lòng chấp nhận điều khoản, điều kiện.', 'warning')
            } else {
                LocalStorageService.set('serviceCustomer', $scope.service);
                $location.path('/tourism-location/tourism-location-detail/' + btoa(JSON.stringify(visitLocationId)) + '/booking-location/customer-information');
            }
        };

        /**
         * Phương thức lấy hình thức thanh toán so sánh để thanh toán
         */
        $scope.submitBooking = function () {
            let paymentMethod = LocalStorageService.get('serviceCustomer').paymentMethod;

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
    }

    $scope.init();

    // ======= Từ chổ này viết hàm để gọi vào submitBooking =======
    $scope.paymentTravel = function () {
        if (user !== null) {
            if (user.roles.some(role => role.nameRole === 'ROLE_CUSTOMER')) {
                $scope.bookingLocation.userId = user.id;
            } else {
                LocalStorageService.remove('user');
            }
        }

        const confirmBookLocation = () => {
            $scope.isLoading = true;

            $scope.orderVisitLocation = {
                id: GenerateCodePayService.generateCodeBooking('VPO', visitLocationId),
                userId: $scope.bookingLocation.userId,
                visitLocationId: visitLocationId,
                customerName: $scope.bookingLocation.customerName,
                customerPhone: $scope.bookingLocation.customerPhone,
                customerEmail: $scope.bookingLocation.customerEmail,
                customerCitizenCard: $scope.bookingLocation.customerCitizenCard,
                capacityAdult: $scope.tickets.adultTickets,
                capacityKid: $scope.tickets.childrenTickets,
                checkIn: $scope.tickets.departureDate,
                orderTotal: $scope.tickets.totalPrice,
                paymentMethod: 0, //vay
                dateCreated: new Date(),
                orderStatus: 0, //chờ thánh toán
                orderCode: GenerateCodePayService.generateCodePayment('VPO'),
                orderNote: $scope.bookingLocation.orderNote
            }

            let orderVisitLocation = $scope.orderVisitLocation;
            const dataOrderVisitLocation = new FormData();

            dataOrderVisitLocation.append("orderVisitsDto", new Blob([JSON.stringify(orderVisitLocation)], {type: "application/json"}));

            BookingLocationCusService.createBookLocation(dataOrderVisitLocation).then((repo) => {
                if (repo.status === 200) {
                    $timeout(() => {
                        let orderVisitLocation = repo.data.data;
                        LocalStorageService.encryptLocalData(orderVisitLocation, 'orderVisitLocation', 'encryptDataOrderVisitLocation');
                        toastAlert('success', 'Đặt vé tham quan thành công !');
                        $location.path('/tourism-location/tourism-location-detail/' + btoa(visitLocationId) + '/booking-location/customer-information/check-information');
                    }, 0)
                } else {
                    $location.path('/admin/page-not-found')
                }
            }, errorCallback).finally(() => {
                $scope.isLoading = false;
            });
        }

        confirmAlert('Bạn có chắc chắn địa chỉ email: ' + $scope.bookingLocation.customerEmail + ' là chính xác không ?', confirmBookLocation);
    }

    $scope.paymentVNPay = function () {
        if (user !== null) {
            if (user.roles.some(role => role.nameRole === 'ROLE_CUSTOMER')) {
                $scope.bookingLocation.userId = user.id;
            } else {
                LocalStorageService.remove('user');
            }
        }

        const confirmBookLocation = () => {
            $scope.isLoading = true;

            $scope.orderVisitLocation = {
                id: GenerateCodePayService.generateCodeBooking('VNPAY', visitLocationId),
                userId: $scope.bookingLocation.userId,
                visitLocationId: visitLocationId,
                customerName: $scope.bookingLocation.customerName,
                customerPhone: $scope.bookingLocation.customerPhone,
                customerEmail: $scope.bookingLocation.customerEmail,
                customerCitizenCard: $scope.bookingLocation.customerCitizenCard,
                capacityAdult: $scope.tickets.adultTickets,
                capacityKid: $scope.tickets.childrenTickets,
                checkIn: $scope.tickets.departureDate,
                orderTotal: $scope.tickets.totalPrice,
                paymentMethod: 1, //vnp
                dateCreated: new Date(),
                orderStatus: 1, //đã thánh toán
                orderCode: GenerateCodePayService.generateCodePayment('VNPAY'),
                orderNote: $scope.bookingLocation.orderNote
            }

            let orderVisitLocation = $scope.orderVisitLocation;
            const dataOrderVisitLocation = new FormData();

            dataOrderVisitLocation.append("orderVisitsDto", new Blob([JSON.stringify(orderVisitLocation)], {type: "application/json"}));

            BookingLocationCusService.redirectVNPay(dataOrderVisitLocation).then((repo) => {
                if (repo.status === 200) {
                    $timeout(() => {
                        LocalStorageService.set('orderVisitLocation', repo);
                        $window.location.href = repo.data.redirectUrl;
                    }, 0)
                } else {
                    $location.path('/admin/page-not-found')
                }
            }, errorCallback).finally(() => {
                $scope.isLoading = false;
            });
        }

        confirmAlert('Bạn có chắc chắn địa chỉ email: ' + $scope.bookingLocation.customerEmail + ' là chính xác không ?', confirmBookLocation);
    }

    $scope.paymentMomo = function () {
        if (user !== null) {
            if (user.roles.some(role => role.nameRole === 'ROLE_CUSTOMER')) {
                $scope.bookingLocation.userId = user.id;
            } else {
                LocalStorageService.remove('user');
            }
        }

        const confirmBookLocation = () => {
            $scope.isLoading = true;

            $scope.orderVisitLocation = {
                id: GenerateCodePayService.generateCodeBooking('MOMO', visitLocationId),
                userId: $scope.bookingLocation.userId,
                visitLocationId: visitLocationId,
                customerName: $scope.bookingLocation.customerName,
                customerPhone: $scope.bookingLocation.customerPhone,
                customerEmail: $scope.bookingLocation.customerEmail,
                customerCitizenCard: $scope.bookingLocation.customerCitizenCard,
                capacityAdult: $scope.tickets.adultTickets,
                capacityKid: $scope.tickets.childrenTickets,
                checkIn: $scope.tickets.departureDate,
                orderTotal: $scope.tickets.totalPrice,
                paymentMethod: 3, //Momo
                dateCreated: new Date(),
                orderStatus: 1, //đã thánh toán
                orderCode: GenerateCodePayService.generateCodePayment('MOMO'),
                orderNote: $scope.bookingLocation.orderNote
            }

            let orderVisitLocation = $scope.orderVisitLocation;
            const dataOrderVisitLocation = new FormData();

            dataOrderVisitLocation.append("orderVisitsDto", new Blob([JSON.stringify(orderVisitLocation)], {type: "application/json"}));

            BookingLocationCusService.redirectMomo(dataOrderVisitLocation).then((repo) => {
                if (repo.status === 200) {
                    $timeout(() => {
                        LocalStorageService.set('orderVisitLocation', repo);
                        $window.location.href = repo.data.redirectUrl;
                    }, 0)
                } else {
                    $location.path('/admin/page-not-found')
                }
            }, errorCallback).finally(() => {
                $scope.isLoading = false;
            });
        }

        confirmAlert('Bạn có chắc chắn địa chỉ email: ' + $scope.bookingLocation.customerEmail + ' là chính xác không ?', confirmBookLocation);
    }

    $scope.paymentZaLoPay = function () {
        const confirmBookLocation = () => {
            $scope.isLoading = true;

            $scope.orderVisitLocation = {
                id: GenerateCodePayService.generateCodeBooking('ZALOPAY', visitLocationId),
                userId: $scope.bookingLocation.userId,
                visitLocationId: visitLocationId,
                customerName: $scope.bookingLocation.customerName,
                customerPhone: $scope.bookingLocation.customerPhone,
                customerEmail: $scope.bookingLocation.customerEmail,
                customerCitizenCard: $scope.bookingLocation.customerCitizenCard,
                capacityAdult: $scope.tickets.adultTickets,
                capacityKid: $scope.tickets.childrenTickets,
                checkIn: $scope.tickets.departureDate,
                orderTotal: $scope.tickets.totalPrice,
                paymentMethod: 2, //Zalo payment
                dateCreated: new Date(),
                orderStatus: 1, //đã thánh toán
                orderCode: GenerateCodePayService.generateCodePayment('ZALOPAY'),
                orderNote: $scope.bookingLocation.orderNote
            }

            let orderVisitLocation = $scope.orderVisitLocation;
            const dataOrderVisitLocation = new FormData();

            dataOrderVisitLocation.append("orderVisitsDto", new Blob([JSON.stringify(orderVisitLocation)], {type: "application/json"}));

            BookingLocationCusService.redirectZALOPay(dataOrderVisitLocation).then((repo) => {
                if (repo.status === 200) {
                    $timeout(() => {
                        LocalStorageService.set('orderVisitLocation', repo);
                        $window.location.href = repo.data.redirectUrl;
                    }, 0)
                } else {
                    $location.path('/admin/page-not-found')
                }
            }, errorCallback).finally(() => {
                $scope.isLoading = false;
            });
        }

        confirmAlert('Bạn có chắc chắn địa chỉ email: ' + $scope.bookingLocation.customerEmail + ' là chính xác không ?', confirmBookLocation);
    }


    $scope.$on('$routeChangeStart', function (event, next, current) {
        if (next.controller !== 'BookingLocationCusController' && next.controller !== 'LoginController') {
            LocalStorageService.remove('redirectAfterLogin');
        }
    });
})
;
