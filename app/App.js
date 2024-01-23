let travel_app = angular.module('travel_app', ['ngRoute', 'ngFileUpload']);

let BASE_API = 'http://localhost:8080/api/v1/'

travel_app.config(function ($routeProvider, $locationProvider) {
    $routeProvider
        /**
         * Super Admin
         */
        .when('/login-admin', {
            templateUrl: 'app/component/admin/views/pages/auth/login.html',
            controller: 'LoginControllerAD'
        })
        .when('/admin/dashboard', {
            templateUrl: 'app/component/admin/views/pages/dashboard/dashboard.html',
            controller: 'DashboardControllerAD'
        })
        .when('/admin/decentralized-staff-management', {
            templateUrl: 'app/component/admin/views/pages/supper-admin/decentralization/decentralization-staff.html',
            controller: 'DecentralizationControllerStaffAD'
        })
        .when('/admin/decentralized-staff-management/create-staff-account', {
            templateUrl: 'app/component/admin/views/pages/supper-admin/account/staff-create.html',
            controller: 'DecentralizationControllerStaffAD'
        })
        .when('/admin/decentralized-staff-management/update-staff-account/:id', {
            templateUrl: 'app/component/admin/views/pages/supper-admin/account/staff-update.html',
            controller: 'DecentralizationControllerStaffAD'
        })
        .when('/admin/decentralized-agent-management', {
            templateUrl: 'app/component/admin/views/pages/supper-admin/decentralization/decentralization-agent.html',
            controller: 'DecentralizationControllerAgentAD'
        })
        .when('/admin/decentralized-agent-management/create-agency-account', {
            templateUrl: 'app/component/admin/views/pages/supper-admin/agent/agent-create.html',
            controller: 'DecentralizationControllerAgentAD'
        })
        .when('/admin/decentralized-agent-management/update-agency-account/:id', {
            templateUrl: 'app/component/admin/views/pages/supper-admin/agent/agent-update.html',
            controller: 'DecentralizationControllerAgentAD'
        })

        /**
         * Admin Tour
         */
        .when('/admin/basic-tour-list', {
            templateUrl: 'app/component/admin/views/pages/staff/tour-management/basic-tour/basic-tour-list.html',
            controller: 'BasicTourControllerAD'
        })
        .when('/admin/basic-tour-list/basic-tour-create', {
            templateUrl: 'app/component/admin/views/pages/staff/tour-management/basic-tour/basic-tour-create.html',
            controller: 'BasicTourControllerAD'
        })
        .when('/admin/basic-tour-list/basic-tour-update/:id', {
            templateUrl: 'app/component/admin/views/pages/staff/tour-management/basic-tour/basic-tour-update.html',
            controller: 'BasicTourControllerAD'
        })
        .when('/admin/detail-tour-list', {
            templateUrl: 'app/component/admin/views/pages/staff/tour-management/detail-tour/detail-tour-list.html',
            controller: 'DetailTourControllerAD'
        })
        .when('/admin/detail-tour-list/detail-tour-create', {
            templateUrl: 'app/component/admin/views/pages/staff/tour-management/detail-tour/detail-tour-create.html',
            controller: 'DetailTourControllerAD'
        })
        .when('/admin/detail-tour-list/detail-tour-update/:id', {
            templateUrl: 'app/component/admin/views/pages/staff/tour-management/detail-tour/detail-tour-update.html',
            controller: 'DetailTourControllerAD'
        })

        /**
         * Admin Partner Services
         */
        .when('/admin/vehicle-list', {
            templateUrl: 'app/component/admin/views/pages/staff/partner-service/vehicle/vehicle-list.html',
            controller: 'VehicleControllerAD'
        })
        .when('/admin/vehicle-list/vehicle-create', {
            templateUrl: 'app/component/admin/views/pages/staff/partner-service/vehicle/vehicle-create.html',
            controller: 'VehicleControllerAD'
        })
        .when('/admin/vehicle-list/vehicle-update/:id', {
            templateUrl: 'app/component/admin/views/pages/staff/partner-service/vehicle/vehicle-update.html',
            controller: 'VehicleControllerAD'
        })
        .when('/admin/stay-list', {
            templateUrl: 'app/component/admin/views/pages/staff/partner-service/stay/stay-list.html',
            controller: 'StayControllerAD'
        })
        .when('/admin/stay-list/stay-create', {
            templateUrl: 'app/component/admin/views/pages/staff/partner-service/stay/stay-create.html',
            controller: 'StayControllerAD'
        })
        .when('/admin/stay-list/stay-update/:id', {
            templateUrl: 'app/component/admin/views/pages/staff/partner-service/stay/stay-update.html',
            controller: 'StayControllerAD'
        })
        .when('/admin/sightseeing-list', {
            templateUrl: 'app/component/admin/views/pages/staff/partner-service/sightseeing/sightseeing-list.html',
            controller: 'SightseeingControllerAD'
        })
        .when('/admin/sightseeing-list/sightseeing-create', {
            templateUrl: 'app/component/admin/views/pages/staff/partner-service/sightseeing/sightseeing-create.html',
            controller: 'SightseeingControllerAD'
        })
        .when('/admin/sightseeing-list/sightseeing-update/:id', {
            templateUrl: 'app/component/admin/views/pages/staff/partner-service/sightseeing/sightseeing-update.html',
            controller: 'SightseeingControllerAD'
        })

        /**
         * Admin Schedule Management
         */
        .when('/admin/tours-are-going-list', {
            templateUrl: 'app/component/admin/views/pages/staff/schedule-management/tours-are-going/tours-are-going-list.html',
            controller: 'ToursAreGoingControllerAD'
        })
        .when('/admin/travel-schedule-list', {
            templateUrl: 'app/component/admin/views/pages/staff/schedule-management/travel-schedule/travel-schedule-list.html',
            controller: 'TravelScheduleControllerAD'
        })
        //tour-customers
        .when('/admin/tour-customer-list', {
            templateUrl: 'app/component/admin/views/pages/staff/schedule-management/tour-customers/tour-customers-list.html',
            controller: 'TourCustomersControllerAD'
        })
        .when('/admin/tour-customer-list/tour-customer-create', {
            templateUrl: 'app/component/admin/views/pages/staff/schedule-management/tour-customers/tour-customers-create.html',
            controller: 'TourCustomersControllerAD'
        })
        .when('/admin/tour-customer-list/tour-customer-update/:id', {
            templateUrl: 'app/component/admin/views/pages/staff/schedule-management/tour-customers/tour-customers-update.html',
            controller: 'TourCustomersControllerAD'
        })
        .when('/admin/bill-list', {
            templateUrl: 'app/component/admin/views/pages/staff/bill/bill-list.html',
            controller: 'BillControllerAD'
        })
        .when('/admin/bill-list/bill-create', {
            templateUrl: 'app/component/admin/views/pages/staff/bill/bill-create.html',
            controller: 'BillControllerAD'
        })
        .when('/admin/bill-list/bill-update/:id', {
            templateUrl: 'app/component/admin/views/pages/staff/bill/bill-update.html',
            controller: 'BillControllerAD'
        })
        .when('/admin/booking-list', {
            templateUrl: 'app/component/admin/views/pages/staff/booking/booking-list.html',
            controller: 'BookingControllerAD'
        })

        /**
         * Agent
         */
        .when('/business/welcome-hotel', {
            templateUrl: 'app/component/agent/welcome.html',
            resolve: {
                "check": function ($location, AuthService) {
                    if (!AuthService.getToken()) {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/business/welcome-transport', {
            templateUrl: 'app/component/agent/welcome.html',
            resolve: {
                "check": function ($location, AuthService) {
                    if (!AuthService.getToken()) {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/business/welcome-place', {
            templateUrl: 'app/component/agent/welcome.html',
            resolve: {
                "check": function ($location, AuthService) {
                    if (!AuthService.getToken()) {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/business/register-business', {
            templateUrl: 'app/component/agent/business/register-business.html',
            controller: 'RegisterBusinessControllerAG',
            resolve: {
                "check": function ($location, AuthService) {
                    if (!AuthService.getToken()) {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/business/register-business-success', {
            templateUrl: 'app/component/agent/business/register-business-success.html',
            resolve: {
                "check": function ($location, AuthService) {
                    if (!AuthService.getToken()) {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/business/select-type', {
            templateUrl: 'app/component/agent/business/select-type.html',
            controller: 'SelectTypeControllerAG',
            resolve: {
                "check": function ($location, AuthService) {
                    if (!AuthService.getToken()) {
                        $location.path('/login-admin');
                    }
                }
            }
        })

        /**
         * Agent Hotel
         */
        .when('/business/register-hotel', {
            templateUrl: 'app/component/agent/hotel/views/pages/register-hotel.html',
            controller: 'RegisterHotelControllerAG'
        })
        .when('/business/hotel/home', {
            templateUrl: 'app/component/agent/hotel/views/pages/dashboard/dashboard.html',
            controller: 'SelectTypeControllerAG'
        })
        .when('/business/hotel/hotel-information-list', {
            templateUrl: 'app/component/agent/hotel/views/pages/hotel/hotel-information-list.html',
            controller: ''
        })
        .when('/business/hotel/hotel-information-list/create', {
            templateUrl: 'app/component/agent/hotel/views/pages/hotel/hotel-information-add.html',
            controller: ''
        })
        .when('/business/hotel/hotel-information-list/update', {
            templateUrl: 'app/component/agent/hotel/views/pages/hotel/hotel-information-edit.html',
            controller: ''
        })
        .when('/business/hotel/hotel-amenities-list', {
            templateUrl: 'app/component/agent/hotel/views/pages/service/amenities/hotel-amenities-list.html',
            controller: 'HotelAmenitiesListControllerAG'
        })
        .when('/business/hotel/hotel-amenities-list/create', {
            templateUrl: 'app/component/agent/hotel/views/pages/service/amenities/hotel-amenities-add.html',
            controller: 'HotelAmenitiesAddControllerAG'
        })
        .when('/business/hotel/hotel-amenities-list/update', {
            templateUrl: 'app/component/agent/hotel/views/pages/service/amenities/hotel-amenities-edit.html',
            controller: ''
        })
        .when('/business/hotel/booking-list', {
            templateUrl: 'app/component/agent/hotel/views/pages/booking/booking-list.html',
            controller: 'HotelAmenitiesListControllerAG'
        })
        .when('/business/hotel/booking-list/create', {
            templateUrl: 'app/component/agent/hotel/views/pages/booking/booking-add.html',
            controller: 'HotelAmenitiesListControllerAG'
        })
        .when('/business/hotel/booking-list/update', {
            templateUrl: 'app/component/agent/hotel/views/pages/booking/booking-edit.html',
            controller: 'HotelAmenitiesListControllerAG'
        })
        .when('/business/hotel/accommodation-location-information/update', {
            templateUrl: 'app/component/agent/hotel/views/pages/hotel/accommodation-location-information-edit.html',
            controller: 'AccommodationLocationInformationEditController'
        })
        .when('/business/hotel/room-type-information-update', {
            templateUrl: 'app/component/agent/hotel/views/pages/hotel/room-type-information-edit.html',
            controller: 'AccommodationLocationInformationEditController'
        })
        .when('/business/hotel/room-amenities-update', {
            templateUrl: 'app/component/agent/hotel/views/pages/hotel/room-amenities.html',
            controller: 'AccommodationLocationInformationEditController'
        })

        /**
         * Agent Transport
         */
        .when('/business/register-transports', {
            templateUrl: 'app/component/agent/trans/views/pages/register-transport.html',
            controller: 'RegisterTransControllerAG'
        })
        .when('/business/transport/transports-list', {
            templateUrl: 'app/component/agent/trans/views/pages/transports/transport-list.html',
            controller: 'TransportControllerAG'
        })
        .when('/business/transport/transports-list/transports-create', {
            templateUrl: 'app/component/agent/trans/views/pages/transports/transport-create.html',
            controller: 'TransportControllerAG'
        })
        .when('/business/transport/transports-list/transports-update', {
            templateUrl: 'app/component/agent/trans/views/pages/transports/transport-update.html',
            controller: 'TransportControllerAG'
        })
        .when('/business/booking/bookings-list', {
            templateUrl: 'app/component/agent/trans/views/pages/bookings/booking-list.html',
            controller: 'BookingControllerAG'
        })
        .when('/business/booking/bookings-list/bookings-create', {
            templateUrl: 'app/component/agent/trans/views/pages/bookings/booking-create.html',
            controller: 'BookingControllerAG'
        })
        .when('/business/booking/bookings-list/bookings-update', {
            templateUrl: 'app/component/agent/trans/views/pages/bookings/booking-update.html',
            controller: 'BookingControllerAG'
        })
        .when('/business/trip/trips-list', {
            templateUrl: 'app/component/agent/trans/views/pages/trips/trip-list.html',
            controller: 'TripControllerAG'
        })
        .when('/business/trip/trips-list/trips-create', {
            templateUrl: 'app/component/agent/trans/views/pages/trips/trip-create.html',
            controller: 'TripControllerAG'
        })
        .when('/business/trip/trips-list/trips-update', {
            templateUrl: 'app/component/agent/trans/views/pages/trips/trip-update.html',
            controller: 'TripControllerAG'
        })

        /**
         * Agent Visit
         */
        .when('/business/register-visit', {
            templateUrl: 'app/component/agent/visits/views/pages/register-visits.html',
            controller: 'RegisterVisitsControllerAG'
        })
        .when('/business/visit/visit-list', {
            templateUrl: 'app/component/agent/visits/views/pages/visits/visit-list.html',
            controller: 'VisitControllerAG'
        })
        .when('/business/visit/visit-list/visit-create', {
            templateUrl: 'app/component/agent/visits/views/pages/visits/visit-create.html',
            controller: 'VisitControllerAG'
        })
        .when('/business/visit/visit-list/visit-update', {
            templateUrl: 'app/component/agent/visits/views/pages/visits/visit-update.html',
            controller: 'VisitControllerAG'
        })
        .when('/business/booking-visit/booking-info', {
            templateUrl: 'app/component/agent/visits/views/pages/bookings/booking-visit-list.html',
            controller: ''
        })
        .when('/business/booking-visit/booking-list/booking-create', {
            templateUrl: 'app/component/agent/visits/views/pages/bookings/booking-visit-create.html',
            controller: ''
        })
        .when('/business/booking-visit/booking-list/booking-update', {
            templateUrl: 'app/component/agent/visits/views/pages/bookings/booking-visit-update.html',
            controller: ''
        })

        /**
         * Admin Template
         */
        .when('/admin/customer-list', {
            templateUrl: 'app/component/admin/views/pages/staff/customer-management/customers-list.html',
            controller: 'CustomerControllerAD'
        })
        .when('/admin/customer-list/customer-create', {
            templateUrl: 'app/component/admin/views/pages/staff/customer-management/customers-create.html',
            controller: 'CustomerControllerAD'
        })
        .when('/admin/customer-list/customer-update', {
            templateUrl: 'app/component/admin/views/pages/staff/customer-management/customers-update.html',
            controller: 'CustomerControllerAD'
        })
        .when('/admin/type/hotel-type-list', {
            templateUrl: 'app/component/admin/views/pages/admin-form/type/hotel-type/hotel-type-list.html',
            controller: 'HotelTypeControllerAD'
        })
        .when('/admin/type/hotel-type-list/hotel-type-create', {
            templateUrl: 'app/component/admin/views/pages/admin-form/type/hotel-type/hotel-type-create.html',
            controller: 'HotelTypeControllerAD'
        })
        .when('/admin/type/hotel-type-list/hotel-type-update', {
            templateUrl: 'app/component/admin/views/pages/admin-form/type/hotel-type/hotel-type-update.html',
            controller: 'HotelTypeControllerAD'
        })
        .when('/admin/type/location-type-list', {
            templateUrl: 'app/component/admin/views/pages/admin-form/type/location-type/location-type-list.html',
            controller: 'LocationTypeControllerAD'
        })
        .when('/admin/type/location-type-list/location-type-create', {
            templateUrl: 'app/component/admin/views/pages/admin-form/type/location-type/location-type-create.html',
            controller: 'LocationTypeControllerAD'
        })
        .when('/admin/type/location-type-list/location-type-update', {
            templateUrl: 'app/component/admin/views/pages/admin-form/type/location-type/location-type-update.html',
            controller: 'LocationTypeControllerAD'
        })
        .when('/admin/type/tour-type-list', {
            templateUrl: 'app/component/admin/views/pages/admin-form/type/tour-type/tour-type-list.html',
            controller: 'TourTypeControllerAD'
        })
        .when('/admin/type/tour-type-list/tour-type-create', {
            templateUrl: 'app/component/admin/views/pages/admin-form/type/tour-type/tour-type-create.html',
            controller: 'TourTypeControllerAD'
        })
        .when('/admin/type/tour-type-list/tour-type-update', {
            templateUrl: 'app/component/admin/views/pages/admin-form/type/tour-type/tour-type-update.html',
            controller: 'TourTypeControllerAD'
        })
        .when('/admin/type/transportation-type-list', {
            templateUrl: 'app/component/admin/views/pages/admin-form/type/transportation-type/transportation-type-list.html',
            controller: 'TransTypeControllerAD'
        })
        .when('/admin/type/transportation-type-list/transportation-type-create', {
            templateUrl: 'app/component/admin/views/pages/admin-form/type/transportation-type/transportation-type-create.html',
            controller: 'TransTypeControllerAD'
        })
        .when('/admin/type/transportation-type-list/transportation-type-update', {
            templateUrl: 'app/component/admin/views/pages/admin-form/type/transportation-type/transportation-type-update.html',
            controller: 'TransTypeControllerAD'
        })
        .when('/admin/type/hotel-utility-list', {
            templateUrl: 'app/component/admin/views/pages/admin-form/type/hotel-utility/hotel-utility-list.html',
            controller: 'HotelUtilityControllerAD'
        })
        .when('/admin/type/hotel-utility-list/hotel-utility-create', {
            templateUrl: 'app/component/admin/views/pages/admin-form/type/hotel-utility/hotel-utility-create.html',
            controller: 'HotelUtilityControllerAD'
        })
        .when('/admin/type/hotel-utility-list/hotel-utility-update', {
            templateUrl: 'app/component/admin/views/pages/admin-form/type/hotel-utility/hotel-utility-update.html',
            controller: 'HotelUtilityControllerAD'
        })
        .when('/admin/type/room-utility-list', {
            templateUrl: 'app/component/admin/views/pages/admin-form/type/room-utility/room-utility-list.html',
            controller: 'RoomUtilityControllerAD'
        })
        .when('/admin/type/room-utility-list/room-utility-create', {
            templateUrl: 'app/component/admin/views/pages/admin-form/type/room-utility/room-utility-create.html',
            controller: 'RoomUtilityControllerAD'
        })
        .when('/admin/type/room-utility-list/room-utility-update', {
            templateUrl: 'app/component/admin/views/pages/admin-form/type/room-utility/room-utility-update.html',
            controller: 'RoomUtilityControllerAD'
        })
        .when('/admin/type/bed-type-list', {
            templateUrl: 'app/component/admin/views/pages/admin-form/type/bed-type/bed-type-list.html',
            controller: 'BedTypeControllerAD'
        })
        .when('/admin/type/bed-type-list/bed-type-create', {
            templateUrl: 'app/component/admin/views/pages/admin-form/type/bed-type/bed-type-create.html',
            controller: 'BedTypeControllerAD'
        })
        .when('/admin/type/bed-type-list/bed-type-update', {
            templateUrl: 'app/component/admin/views/pages/admin-form/type/bed-type/bed-type-update.html',
            controller: 'BedTypeControllerAD'
        })
        .when('/admin/staff/staff-list', {
            templateUrl: 'app/component/admin/views/pages/admin-form/staff/staff-list.html',
            controller: 'StaffControllerAD'
        })
        .when('/admin/staff/staff-list/staff-create', {
            templateUrl: 'app/component/admin/views/pages/admin-form/staff/staff-create.html',
            controller: 'StaffControllerAD'
        })
        .when('/admin/staff/staff-list/staff-update', {
            templateUrl: 'app/component/admin/views/pages/admin-form/staff/staff-update.html',
            controller: 'StaffControllerAD'
        })
        .when('/admin/agency/agency-list', {
            templateUrl: 'app/component/admin/views/pages/admin-form/agency/agency-list.html',
            controller: 'AgencyControllerAD'
        })
        .when('/admin/agency/agency-list/agency-create', {
            templateUrl: 'app/component/admin/views/pages/admin-form/agency/agency-create.html',
            controller: 'AgencyControllerAD'
        })
        .when('/admin/agency/agency-list/agency-update', {
            templateUrl: 'app/component/admin/views/pages/admin-form/agency/agency-update.html',
            controller: 'AgencyControllerAD'
        })
        .when('/admin/report/revenue', {
            templateUrl: 'app/component/admin/views/pages/admin-form/report/revenue.html',
            controller: 'RevenueControllerAD'
        })
        .when('/admin/report/statistical', {
            templateUrl: 'app/component/admin/views/pages/admin-form/report/statistical.html',
            controller: 'StatisticalControllerAD'
        })

        /**
         * Customer
         */
        .when('/home', {
            templateUrl: 'app/component/customers/views/pages/home/home.html',
            controller: 'HomeController'
        })
        .when('/information', {
            templateUrl: 'app/component/customers/views/pages/info/information.html',
            controller: 'InformationController',
            resolve: {
                "check": function ($location, AuthService) {
                    if (!AuthService.getToken()) {
                        $location.path('/home');
                    }
                }
            }
        })
        .when('/information/change-password', {
            templateUrl: 'app/component/customers/views/pages/info/change-password.html',
            controller: 'ChangePasswordController',
            resolve: {
                "check": function ($location, AuthService) {
                    if (!AuthService.getToken()) {
                        $location.path('/home');
                    }
                }
            }
        })
        .when('/booking', {
            templateUrl: 'app/component/customers/views/pages/booking/booking.html',
            controller: ''
        })
        .when('/introduce', {
            templateUrl: 'app/component/customers/views/pages/home/introduce.html',
            controller: 'IntroduceController'
        })
        .when('/travel-guide', {
            templateUrl: 'app/component/customers/views/pages/home/travel-guide.html',
            controller: 'TravelGuideController'
        })
        .when('/contact', {
            templateUrl: 'app/component/customers/views/pages/home/contact.html',
            controller: 'ContactController'
        })
        .when('/tours', {
            templateUrl: 'app/component/customers/views/pages/tour/tour.html',
            controller: 'TourController'
        })
        .when('/tour-detail', {
            templateUrl: 'app/component/customers/views/pages/tour/tour-details.html',
            controller: 'TourDetailController'
        })
        .when('/tourism-location', {
            templateUrl: 'app/component/customers/views/pages/location/location-tour.html',
            controller: 'LocationController'
        })
        .when('/tourism-location-detail', {
            templateUrl: 'app/component/customers/views/pages/location/location-tour-detail.html',
            controller: 'LocationController'
        })
        .when('/hotel', {
            templateUrl: 'app/component/customers/views/pages/hotel/hotel.html',
            controller: 'HotelController'
        })
        .when('/hotel-detail', {
            templateUrl: 'app/component/customers/views/pages/hotel/hotel-detail.html',
            controller: 'HotelDetailController'
        })
        .when('/drive-move', {
            templateUrl: 'app/component/customers/views/pages/move/drive-move.html',
            controller: 'DriveMoveController'
        })
        .when('/drive-move-detail', {
            templateUrl: 'app/component/customers/views/pages/move/drive-move-detail.html',
            controller: 'DriveMoveController'
        })

        /**
         * Authentication
         */
        .when('/sign-in', {
            templateUrl: 'app/component/customers/views/pages/auth/sign-in.html',
            controller: 'LoginController'
        })
        .when('/sign-up', {
            templateUrl: 'app/component/customers/views/pages/auth/sign-up.html',
            controller: 'SignupController'
        })
        .when('/forgot-password', {
            templateUrl: 'app/component/customers/views/pages/password/forgot.html',
            controller: 'ForgotPwController'
        })
        .otherwise({
            redirectTo: '/home'
        })

    if (window.history && window.history.pushState) {
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    }
});