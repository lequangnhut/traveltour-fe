let travel_app = angular.module('travel_app', ['ngRoute', 'ngFileUpload']);

let BASE_API = 'http://localhost:8080/api/v1/'

travel_app.config(function ($routeProvider, $locationProvider) {
    $routeProvider
        /**
         * Admin
         */
        .when('/login-admin', {
            templateUrl: 'app/component/admin/views/pages/auth/login.html',
            controller: 'LoginControllerAD'
        })
        .when('/admin/dashboard', {
            templateUrl: 'app/component/admin/views/pages/dashboard/dashboard.html',
            controller: 'DashboardControllerAD'
        })
        .when('/admin/decentralization-account', {
            templateUrl: 'app/component/admin/views/pages/decentralization/account-full.html',
            controller: 'DecentralizationControllerAD'
        })
        .when('/admin/decentralization-list', {
            templateUrl: 'app/component/admin/views/pages/decentralization/decentralization-list.html',
            controller: 'DecentralizationListControllerAD'
        })
        /**
         * tour
         */
        .when('/admin/basic-tour-list', {
            templateUrl: 'app/component/admin/views/pages/tour-management/basic-tour/basic-tour-list.html',
            controller: 'BasicTourControllerAD'
        })
        .when('/admin/basic-tour-create', {
            templateUrl: 'app/component/admin/views/pages/tour-management/basic-tour/basic-tour-create.html',
            controller: 'BasicTourControllerAD'
        })
        .when('/admin/basic-tour-update', {
            templateUrl: 'app/component/admin/views/pages/tour-management/basic-tour/basic-tour-update.html',
            controller: 'BasicTourControllerAD'
        })
        .when('/admin/detail-tour-list', {
            templateUrl: 'app/component/admin/views/pages/tour-management/detail-tour/detail-tour-list.html',
            controller: 'DetailTourControllerAD'
        })
        .when('/admin/detail-tour-create', {
            templateUrl: 'app/component/admin/views/pages/tour-management/detail-tour/detail-tour-create.html',
            controller: 'DetailTourControllerAD'
        })
        .when('/admin/detail-tour-update', {
            templateUrl: 'app/component/admin/views/pages/tour-management/detail-tour/detail-tour-update.html',
            controller: 'DetailTourControllerAD'
        })
        /**
         * partner services
         */
        //vehicle
        .when('/admin/vehicle-list', {
            templateUrl: 'app/component/admin/views/pages/partner-service/vehicle/vehicle-list.html',
            controller: 'VehicleControllerAD'
        })
        .when('/admin/vehicle-create', {
            templateUrl: 'app/component/admin/views/pages/partner-service/vehicle/vehicle-create.html',
            controller: 'VehicleControllerAD'
        })
        .when('/admin/vehicle-update', {
            templateUrl: 'app/component/admin/views/pages/partner-service/vehicle/vehicle-update.html',
            controller: 'VehicleControllerAD'
        })
        //stay
        .when('/admin/stay-list', {
            templateUrl: 'app/component/admin/views/pages/partner-service/stay/stay-list.html',
            controller: 'StayControllerAD'
        })
        .when('/admin/stay-create', {
            templateUrl: 'app/component/admin/views/pages/partner-service/stay/stay-create.html',
            controller: 'StayControllerAD'
        })
        .when('/admin/stay-update', {
            templateUrl: 'app/component/admin/views/pages/partner-service/stay/stay-update.html',
            controller: 'StayControllerAD'
        })
        //sightseeing
        .when('/admin/sightseeing-list', {
            templateUrl: 'app/component/admin/views/pages/partner-service/sightseeing/sightseeing-list.html',
            controller: 'SightseeingControllerAD'
        })
        .when('/admin/sightseeing-create', {
            templateUrl: 'app/component/admin/views/pages/partner-service/sightseeing/sightseeing-create.html',
            controller: 'SightseeingControllerAD'
        })
        .when('/admin/sightseeing-update', {
            templateUrl: 'app/component/admin/views/pages/partner-service/sightseeing/sightseeing-update.html',
            controller: 'SightseeingControllerAD'
        })
        /**
         * schedule management
         */
        .when('/admin/tours-are-going-list', {
            templateUrl: 'app/component/admin/views/pages/schedule-management/tours-are-going/tours-are-going-list.html',
            controller: 'ToursAreGoingControllerAD'
        })
        .when('/admin/travel-schedule-list', {
            templateUrl: 'app/component/admin/views/pages/schedule-management/travel-schedule/travel-schedule-list.html',
            controller: 'TravelScheduleControllerAD'
        })
        //bill
        .when('/admin/bill-list', {
            templateUrl: 'app/component/admin/views/pages/bill/bill-list.html',
            controller: 'BillControllerAD'
        })
        .when('/admin/bill-create', {
            templateUrl: 'app/component/admin/views/pages/bill/bill-create.html',
            controller: 'BillControllerAD'
        })
        .when('/admin/bill-update', {
            templateUrl: 'app/component/admin/views/pages/bill/bill-update.html',
            controller: 'BillControllerAD'
        })
        //booking
        .when('/admin/booking-list', {
            templateUrl: 'app/component/admin/views/pages/booking/booking-list.html',
            controller: 'BookingControllerAD'
        })

        /**
         * Agent Hotel
         */
        .when('/business/register-business', {
            templateUrl: 'app/component/admin/views/pages/register-agent/business-information.html',
            controller: 'BusinessInformationController'
        })
        .when('/business/register-hotel', {
            templateUrl: 'app/component/agent/hotel/views/pages/register/register-hotel.html',
            controller: 'RegisterHotelControllerAG'
        })
        .when('/business/register-hotel-success', {
            templateUrl: 'app/component/agent/hotel/views/pages/register/register-success.html',
            controller: ''
        })
        .when('/business/amenities/hotel-amenities-list', {
            templateUrl: 'app/component/agent/hotel/views/pages/service/amenities/hotel-amenities-list.html',
            controller: 'HotelAmenitiesListController'
        })
        .when('/business/amenities/hotel-amenities-list/new', {
            templateUrl: 'app/component/agent/hotel/views/pages/service/amenities/hotel-amenities-add.html',
            controller: 'HotelAmenitiesAddController'
        })
        .when('/business/amenities/hotel-amenities-list/edit', {
            templateUrl: 'app/component/agent/hotel/views/pages/service/amenities/hotel-amenities-edit.html',
            controller: 'HotelAmenitiesAddController'
        })
        .when('/admin/amenities/booking-list', {
            templateUrl: 'app/component/agent/hotel/views/pages/service/booking/booking-list.html',
            controller: 'HotelAmenitiesListController'
        })
        /**
         * Agent Transport
         */
        .when('/business/register-transports', {
            templateUrl: 'app/component/agent/trans/views/pages/register-transport.html',
            controller: 'RegisterTransControllerAG'
        })
        .when('/business/register-transport-success', {
            templateUrl: 'app/component/agent/trans/views/pages/register-trans-success.html'
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
        .when('/business/register-visits-success', {
            templateUrl: 'app/component/agent/visits/views/pages/register-visits-success.html',
            controller: ''
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
        .when('/business/booking-visit/booking-list', {
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
        .when('/admin/type/hotel-type', {
            templateUrl: 'app/component/admin/views/pages/admin-form/typesAD/hotel-type.html',
            controller: 'HotelTypeControllerAD'
        })
        .when('/admin/type/location-type', {
            templateUrl: 'app/component/admin/views/pages/admin-form/typesAD/location-type.html',
            controller: 'LocationTypeControllerAD'
        })
        .when('/admin/type/tour-type', {
            templateUrl: 'app/component/admin/views/pages/admin-form/typesAD/tour-type.html',
            controller: 'TourTypeControllerAD'
        })
        .when('/admin/type/transportation-type', {
            templateUrl: 'app/component/admin/views/pages/admin-form/typesAD/transportation-type.html',
            controller: 'TransTypeControllerAD'
        })
        .when('/admin/type/hotel-utility', {
            templateUrl: 'app/component/admin/views/pages/admin-form/typesAD/hotel-utility.html',
            controller: 'HotelUtilityControllerAD'
        })
        .when('/admin/type/room-utility', {
            templateUrl: 'app/component/admin/views/pages/admin-form/typesAD/room-utility.html',
            controller: 'RoomUtilityControllerAD'
        })
        .when('/admin/staff/staff-list', {
            templateUrl: 'app/component/admin/views/pages/admin-form/staffAD/staff-list.html',
            controller: 'StaffControllerAD'
        })
        .when('/admin/staff/staff-list/staff-create', {
            templateUrl: 'app/component/admin/views/pages/admin-form/staffAD/staff-create.html',
            controller: 'StaffControllerAD'
        })
        .when('/admin/staff/staff-list/staff-update', {
            templateUrl: 'app/component/admin/views/pages/admin-form/staffAD/staff-update.html',
            controller: 'StaffControllerAD'
        })
        .when('/admin/agency/agency-list', {
            templateUrl: 'app/component/admin/views/pages/admin-form/agencyAD/agency-list.html',
            controller: 'AgencyControllerAD'
        })
        .when('/admin/agency/agency-list/agency-create', {
            templateUrl: 'app/component/admin/views/pages/admin-form/agencyAD/agency-create.html',
            controller: 'AgencyControllerAD'
        })
        .when('/admin/agency/agency-list/agency-update', {
            templateUrl: 'app/component/admin/views/pages/admin-form/agencyAD/agency-update.html',
            controller: 'AgencyControllerAD'
        })
        .when('/admin/report/revenue', {
            templateUrl: 'app/component/admin/views/pages/admin-form/reportAD/revenue.html',
            controller: 'RevenueControllerAD'
        })
        .when('/admin/report/statistical', {
            templateUrl: 'app/component/admin/views/pages/admin-form/reportAD/statistical.html',
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
            // resolve: {
            //     "check": function ($location, AuthService) {
            //         if (!AuthService.getToken()) {
            //             $location.path('/home');
            //         }
            //     }
            // }
        })
        .when('/information/change-password', {
            templateUrl: 'app/component/customers/views/pages/info/change-password.html',
            controller: 'ChangePasswordController',
            // resolve: {
            //     "check": function ($location, AuthService) {
            //         if (!AuthService.getToken()) {
            //             $location.path('/home');
            //         }
            //     }
            // }
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