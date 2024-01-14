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

        /**
         * Agent Transport
         */
        .when('/business/register-transports', {
            templateUrl: 'app/component/agent/trans/views/pages/register-transport.html',
            controller: 'RegisterTransControllerAG'
        })
        .when('/business/transports-list', {
            templateUrl: 'app/component/agent/trans/views/pages/transports/transport-list.html',
            controller: ''
        })
        .when('/business/transports-create', {
            templateUrl: 'app/component/agent/trans/views/pages/transports/transport-create.html',
            controller: ''
        })
        .when('/business/transports-update', {
            templateUrl: 'app/component/agent/trans/views/pages/transports/transport-update.html',
            controller: ''
        })
        .when('/business/bookings-list', {
            templateUrl: 'app/component/agent/trans/views/pages/bookings/booking-list.html',
            controller: ''
        })
        .when('/business/bookings-create', {
            templateUrl: 'app/component/agent/trans/views/pages/bookings/booking-create.html',
            controller: ''
        })
        .when('/business/bookings-update', {
            templateUrl: 'app/component/agent/trans/views/pages/bookings/booking-update.html',
            controller: ''
        })
        .when('/business/trips-list', {
            templateUrl: 'app/component/agent/trans/views/pages/trips/trip-list.html',
            controller: ''
        })
        .when('/business/trips-create', {
            templateUrl: 'app/component/agent/trans/views/pages/trips/trip-create.html',
            controller: ''
        })
        .when('/business/trips-update', {
            templateUrl: 'app/component/agent/trans/views/pages/trips/trip-update.html',
            controller: ''
        })
        .when('/admin/register-transport-success', {
            templateUrl: 'app/component/agent/trans/views/pages/register-trans-success.html',
            controller: ''
        })
        /**
         * Agent Visit
         */
        .when('/business/register-visit', {
            templateUrl: 'app/component/agent/visits/views/pages/register-visits.html',
            controller: 'RegisterVisitsControllerAG'
        })
        .when('/business/visit-list', {
            templateUrl: 'app/component/agent/visits/views/pages/visit-list.html',
            controller: ''
        })
        .when('/business/register-visits-success', {
            templateUrl: 'app/component/agent/visits/views/pages/register-visits-success.html',
            controller: ''
        })

        /**
         * Admin Template
         */
        .when('/admin/hotel-type', {
            templateUrl: 'app/component/admin/views/pages/typesAD/hotel-type.html',
            controller: 'HotelTypeControllerAD'
        })
        .when('/admin/location-type', {
            templateUrl: 'app/component/admin/views/pages/typesAD/location-type.html',
            controller: 'LocationTypeControllerAD'
        })
        .when('/admin/tour-type', {
            templateUrl: 'app/component/admin/views/pages/typesAD/tour-type.html',
            controller: 'TourTypeControllerAD'
        })
        .when('/admin/transportation-type', {
            templateUrl: 'app/component/admin/views/pages/typesAD/transportation-type.html',
            controller: 'TransTypeControllerAD'
        })
        .when('/admin/hotel-utility', {
            templateUrl: 'app/component/admin/views/pages/typesAD/hotel-utility.html',
            controller: 'HotelUtilityControllerAD'
        })
        .when('/admin/room-utility', {
            templateUrl: 'app/component/admin/views/pages/typesAD/room-utility.html',
            controller: 'RoomUtilityControllerAD'
        })
        .when('/admin/staff-add', {
            templateUrl: 'app/component/admin/views/pages/staffAD/staff-add.html',
            controller: 'StaffControllerAD'
        })
        .when('/admin/staff-edit', {
            templateUrl: 'app/component/admin/views/pages/staffAD/staff-edit.html',
            controller: 'StaffControllerAD'
        })
        .when('/admin/staff-list', {
            templateUrl: 'app/component/admin/views/pages/staffAD/staff-list.html',
            controller: 'StaffControllerAD'
        })
        .when('/admin/agency-add', {
            templateUrl: 'app/component/admin/views/pages/agencyAD/agency-add.html',
            controller: 'AgencyControllerAD'
        })
        .when('/admin/agency-edit', {
            templateUrl: 'app/component/admin/views/pages/agencyAD/agency-edit.html',
            controller: 'AgencyControllerAD'
        })
        .when('/admin/agency-list', {
            templateUrl: 'app/component/admin/views/pages/agencyAD/agency-list.html',
            controller: 'AgencyControllerAD'
        })
        .when('/admin/revenue', {
            templateUrl: 'app/component/admin/views/pages/reportAD/revenue.html',
            controller: 'RevenueControllerAD'
        })
        .when('/admin/statistical', {
            templateUrl: 'app/component/admin/views/pages/reportAD/statistical.html',
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