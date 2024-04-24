travel_app.controller('BookingTourSuccessCusController',
    function ($scope, $location, $routeParams, LocalStorageService, PrintService) {

        $scope.init = function () {
            let dataBooking = LocalStorageService.decryptLocalData('dataBooking', 'encryptDataBooking');
            let bookingDto = LocalStorageService.decryptLocalData('bookingDto', 'encryptBookingDto');
            let bookingTicket = LocalStorageService.decryptLocalData('bookingTicket', 'encryptBookingTicket');

            if (dataBooking === null && bookingTicket === null && bookingDto == null) {
                centerAlert('Cảnh báo', 'Chúng tôi nhận thấy bạn đang truy cập bất thường vào trang này, vui lòng rời khỏi !', 'warning');
                $location.path('/tours');
                return;
            }

            $scope.ticket = dataBooking.ticket;
            $scope.amountTicket = parseInt($scope.ticket.adults) + parseInt($scope.ticket.children) + parseInt($scope.ticket.baby);
            $scope.tourDetail = dataBooking.tourDetail;
            $scope.provinceName = dataBooking.provinceName;
            $scope.dataCustomers = bookingDto.bookingTourCustomersDto;
            $scope.bookingTicket = bookingTicket;

            if ($routeParams.orderStatus && $routeParams.paymentMethod) {
                $scope.orderStatus = parseInt(atob($routeParams.orderStatus));
                $scope.paymentMethodTour = atob($routeParams.paymentMethod);
            } else {
                $scope.orderStatus = 0;
                $scope.paymentMethodTour = 'VPO';
            }

            $scope.printInvoiceTourCustomer = function () {
                let invoice = {
                    dateCreated: new Date(),
                    bookingTourId: bookingTicket.id,
                    bookingToursByBookingTourId: {
                        orderTotal: bookingTicket.orderTotal,
                        customerName: bookingTicket.customerName,
                        customerPhone: bookingTicket.customerPhone,
                        customerEmail: bookingTicket.customerEmail,
                        customerCitizenCard: bookingTicket.customerCitizenCard,
                        capacityAdult: $scope.ticket.adults,
                        capacityKid: $scope.ticket.children,
                        capacityBaby: $scope.ticket.baby
                    },
                    tourDetailsByTourDetailId: $scope.tourDetail
                }

                PrintService.print(invoice);
            }
        }

        $scope.init();

        $scope.$on('$routeChangeStart', function (event, next, current) {
            if (next.controller !== 'BookingTourSuccessCusController') {
                LocalStorageService.remove('dataBooking');
                LocalStorageService.remove('bookingDto');
                LocalStorageService.remove('bookingTicket');
                LocalStorageService.remove('serviceCustomer');
            }
        });
    })