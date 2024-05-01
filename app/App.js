let travel_app = angular.module('travel_app', ['ngRoute', 'ngFileUpload']);

let BASE_API = 'http://localhost:8080/api/v1/'

travel_app.config(function ($routeProvider, $locationProvider) {
    $routeProvider
        /**
         * Config Error
         */
        .when('/admin/page-not-found', {
            templateUrl: 'app/component/error/404.html'
        })
        .when('/admin/internal-server-error', {
            templateUrl: 'app/component/error/500.html'
        })
        .when('/admin/page-forbidden', {
            templateUrl: 'app/component/error/403.html'
        })

        /**
         * Super Admin
         */
        .when('/login-admin', {
            templateUrl: 'app/component/admin/views/pages/auth/login.html',
            controller: 'LoginControllerAD'
        })
        .when('/admin/dashboard', {
            templateUrl: 'app/component/admin/views/pages/dashboard/dashboard.html',
            controller: 'DashboardControllerAD',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_STAFF", "ROLE_ADMIN", "ROLE_SUPERADMIN", "ROLE_GUIDE"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/admin/decentralized-staff-management', {
            templateUrl: 'app/component/admin/views/pages/supper-admin/decentralization/decentralization-staff.html',
            controller: 'DecentralizationControllerStaffAD',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_SUPERADMIN"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/admin/decentralized-staff-management/create-staff-account', {
            templateUrl: 'app/component/admin/views/pages/supper-admin/account/staff-create.html',
            controller: 'DecentralizationControllerStaffAD',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_SUPERADMIN"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/admin/decentralized-staff-management/update-staff-account/:id', {
            templateUrl: 'app/component/admin/views/pages/supper-admin/account/staff-update.html',
            controller: 'DecentralizationControllerStaffAD',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_SUPERADMIN"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/admin/decentralized-agent-management', {
            templateUrl: 'app/component/admin/views/pages/supper-admin/decentralization/decentralization-agent.html',
            controller: 'DecentralizationControllerAgentAD',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_SUPERADMIN"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/admin/decentralized-agent-management/create-agency-account', {
            templateUrl: 'app/component/admin/views/pages/supper-admin/agent/agent-create.html',
            controller: 'DecentralizationControllerAgentAD',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_SUPERADMIN"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/admin/decentralized-agent-management/update-agency-account/:id', {
            templateUrl: 'app/component/admin/views/pages/supper-admin/agent/agent-update.html',
            controller: 'DecentralizationControllerAgentAD',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_SUPERADMIN"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })

        /**
         * Admin Tour
         */
        .when('/admin/basic-tour-list', {
            templateUrl: 'app/component/admin/views/pages/staff/tour-management/basic-tour/basic-tour-list.html',
            controller: 'BasicTourControllerAD',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_STAFF"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/admin/basic-tour-list/basic-tour-create', {
            templateUrl: 'app/component/admin/views/pages/staff/tour-management/basic-tour/basic-tour-create.html',
            controller: 'BasicTourControllerAD',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_STAFF"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/admin/basic-tour-list/basic-tour-update/:id', {
            templateUrl: 'app/component/admin/views/pages/staff/tour-management/basic-tour/basic-tour-update.html',
            controller: 'BasicTourControllerAD',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_STAFF"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/admin/detail-tour-list', {
            templateUrl: 'app/component/admin/views/pages/staff/tour-management/detail-tour/detail-tour-list.html',
            controller: 'TourDetailControllerAD',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_STAFF"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/admin/detail-tour-list/detail-tour-create', {
            templateUrl: 'app/component/admin/views/pages/staff/tour-management/detail-tour/detail-tour-create.html',
            controller: 'TourDetailControllerAD',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_STAFF"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/admin/detail-tour-list/detail-tour-update/:id', {
            templateUrl: 'app/component/admin/views/pages/staff/tour-management/detail-tour/detail-tour-update.html',
            controller: 'TourDetailControllerAD',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_STAFF"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/admin/detail-tour-list/image-tour/:id', {
            templateUrl: 'app/component/admin/views/pages/staff/tour-management/detail-tour/tour-detail-image.html',
            controller: 'TourDetailsImageControllerAD',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_STAFF"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/admin/detail-tour-list/trips-tour-list/:tourDetailId', {
            templateUrl: 'app/component/admin/views/pages/staff/tour-management/trips-tour/trips-tour-list.html',
            controller: 'TripsTourControllerAD',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_STAFF"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/admin/detail-tour-list/trips-tour-list/trips-tour-create/:tourDetailId', {
            templateUrl: 'app/component/admin/views/pages/staff/tour-management/trips-tour/trips-tour-create.html',
            controller: 'TripsTourControllerAD',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_STAFF"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/admin/detail-tour-list/trips-tour-list/trips-tour-update/:tourTripsId', {
            templateUrl: 'app/component/admin/views/pages/staff/tour-management/trips-tour/trips-tour-update.html',
            controller: 'TripsTourControllerAD',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_STAFF"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })

        /**
         * Admin Partner Services
         */
        .when('/admin/detail-tour-list/:tourDetailId/service-list', {
            templateUrl: 'app/component/admin/views/pages/staff/partner-service/service-list.html',
            controller: 'ServiceListControllerAD',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_STAFF"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })

        .when('/admin/detail-tour-list/:tourDetailId/service-list/accommodation-information-list', {
            templateUrl: 'app/component/admin/views/pages/staff/tour-service/accommodation-information-list.html',
            controller: 'AccommodationInformationControllerAD',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_STAFF"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/admin/detail-tour-list/:tourDetailId/service-list/transportation-information-list', {
            templateUrl: 'app/component/admin/views/pages/staff/tour-service/transportation-information-list.html',
            controller: 'TransportationInformationControllerAD',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_STAFF"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/admin/detail-tour-list/:tourDetailId/service-list/visit-information-list', {
            templateUrl: 'app/component/admin/views/pages/staff/tour-service/visit-information-list.html',
            controller: 'VisitInformationControllerAD',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_STAFF"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })

        .when('/admin/detail-tour-list/:tourDetailId/service-list/hotel-list', {
            templateUrl: 'app/component/admin/views/pages/staff/partner-service/hotel/hotel-list.html',
            controller: 'HotelServiceControllerAD',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_STAFF"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/admin/detail-tour-list/:tourDetailId/service-list/hotel-list/:hotelId/room-type-list', {
            templateUrl: 'app/component/admin/views/pages/staff/partner-service/hotel/room-type-list.html',
            controller: 'RoomTypeControllerAD',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_STAFF"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/admin/detail-tour-list/:tourDetailId/service-list/hotel-list/:hotelId/room-type-list/hotel-payment', {
            templateUrl: 'app/component/admin/views/pages/staff/partner-service/hotel/hotel-payment.html',
            controller: 'HotelPaymentControllerAD',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_STAFF"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/admin/detail-tour-list/:tourDetailId/service-list/visit-location-list', {
            templateUrl: 'app/component/admin/views/pages/staff/partner-service/visit-location/visit-location-list.html',
            controller: 'VisitLocationControllerAD',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_STAFF"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/admin/detail-tour-list/:tourDetailId/service-list/visit-location-list/:visitLocationId/visit-location-payment', {
            templateUrl: 'app/component/admin/views/pages/staff/partner-service/visit-location/visit-location-payment.html',
            controller: 'VisitLocationPaymentControllerAD',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_STAFF"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/admin/detail-tour-list/:tourDetailId/service-list/transportation-list', {
            templateUrl: 'app/component/admin/views/pages/staff/partner-service/transportation/transportation-list.html',
            controller: 'TransportationSchedulesControllerAD',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_STAFF"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/admin/detail-tour-list/:tourDetailId/service-list/transportation-list/:transportationScheduleId/transportation-payment', {
            templateUrl: 'app/component/admin/views/pages/staff/partner-service/transportation/transportation-payment.html',
            controller: 'TransportationSchedulesPaymentControllerAD',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_STAFF"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })

        /**
         * Admin request booking transport
         */
        .when('/admin/request-booking-car', {
            templateUrl: 'app/component/admin/views/pages/staff/request-car/booking-car.html',
            controller: 'RequestCarControllerAD',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_STAFF"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/admin/request-booking-car/create-request-booking', {
            templateUrl: 'app/component/admin/views/pages/staff/request-car/booking-car-add.html',
            controller: 'RequestCarControllerAD',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_STAFF"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/admin/request-booking-car/update-request-booking/:requestCarId', {
            templateUrl: 'app/component/admin/views/pages/staff/request-car/booking-car-edit.html',
            controller: 'RequestCarControllerAD',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_STAFF"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })

        /**
         * Admin Schedule Management
         */
        .when('/admin/booking-list', {
            templateUrl: 'app/component/admin/views/pages/staff/booking/booking-list.html',
            controller: 'BookingControllerAD',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_STAFF"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })

        /**
         * travel schedule
         */
        .when('/admin/tour-is-going-list', {
            templateUrl: 'app/component/admin/views/pages/staff/travel-schedule/tour-is-going-list.html',
            controller: 'TourIsGoingControllerAD',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_STAFF"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/admin/customer-go-on-list', {
            templateUrl: 'app/component/admin/views/pages/staff/travel-schedule/customers-go-on-tour/customers-go-on-tour-list.html',
            controller: 'CustomersGoOnTourControllerAD',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_STAFF"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/admin/customer-go-on-list/:tourDetailId/customer-go-on-create', {
            templateUrl: 'app/component/admin/views/pages/staff/travel-schedule/customers-go-on-tour/customers-go-on-tour-create.html',
            controller: 'CustomersGoOnTourControllerAD',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_STAFF"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/admin/customer-go-on-list/customer-go-on-update/:id', {
            templateUrl: 'app/component/admin/views/pages/staff/travel-schedule/customers-go-on-tour/customers-go-on-tour-update.html',
            controller: 'CustomersGoOnTourControllerAD',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_STAFF"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/admin/bill-list', {
            templateUrl: 'app/component/admin/views/pages/staff/bill/bill-list.html',
            controller: 'BillControllerAD',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_STAFF"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/admin/customer-list', {
            templateUrl: 'app/component/admin/views/pages/staff/customer-management/customers-list.html',
            controller: 'CustomerControllerAD',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_STAFF"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/admin/customer-list/customer-create', {
            templateUrl: 'app/component/admin/views/pages/staff/customer-management/customers-create.html',
            controller: 'CustomerControllerAD',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_STAFF"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/admin/customer-list/customer-update/:id', {
            templateUrl: 'app/component/admin/views/pages/staff/customer-management/customers-update.html',
            controller: 'CustomerControllerAD',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_STAFF"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/admin/chat', {
            templateUrl: 'app/component/agent/hotel/views/pages/chat/chat-agency.html',
            controller: 'ChatHotelController',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_STAFF"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })

        /**
         * Admin Agencies
         */
        .when('/admin/agency/agency-list', {
            templateUrl: 'app/component/admin/views/pages/admin-form/agency/agency-list.html',
            controller: 'AgencyControllerAD',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_ADMIN"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/admin/agency/agency-list/agency-update/:id', {
            templateUrl: 'app/component/admin/views/pages/admin-form/agency/agency-update.html',
            controller: 'AgencyControllerAD',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_ADMIN"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/admin/agency/agency-list-check', {
            templateUrl: 'app/component/admin/views/pages/admin-form/agency/agency-list-check.html',
            controller: 'AgencyControllerWaitingAD',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_ADMIN"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })

        /**
         * Admin kiểm duyệt bài đăng doanh nghiệp
         */
        .when('/admin/post/hotel-post-list', {
            templateUrl: 'app/component/admin/views/pages/admin-form/post/hotel/hotel-post-list.html',
            controller: 'HotelPostController',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_ADMIN"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/admin/post/hotel-post-list/room-list/:id', {
            templateUrl: 'app/component/admin/views/pages/admin-form/post/hotel/room-type-post-list.html',
            controller: 'RoomPostController',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_ADMIN"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })

        .when('/admin/post/brand-post-list', {
            templateUrl: 'app/component/admin/views/pages/admin-form/post/transportation/brand-post-list.html',
            controller: 'TransBrandPostController',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_ADMIN"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/admin/post/brand-post-list/transportation-post-list/:id', {
            templateUrl: 'app/component/admin/views/pages/admin-form/post/transportation/transportation-post-list.html',
            controller: 'TransportationPostController',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_ADMIN"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/admin/post/brand-post-list/transportation-list/transportation-schedule-post-list/:id', {
            templateUrl: 'app/component/admin/views/pages/admin-form/post/transportation/transportation-schedule-post-list.html',
            controller: 'SchedulePostController',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_ADMIN"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })

        .when('/admin/post/visit-post-list', {
            templateUrl: 'app/component/admin/views/pages/admin-form/post/visit/visit-post-list.html',
            controller: 'VisitPostController',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_ADMIN"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })

        /**
         * Admin doanh thu
         */
        .when('/admin/report/revenue', {
            templateUrl: 'app/component/admin/views/pages/admin-form/report/revenue.html',
            controller: 'RevenueControllerAD',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_ADMIN"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/admin/report/statistical', {
            templateUrl: 'app/component/admin/views/pages/admin-form/report/statistical.html',
            controller: 'StatisticalControllerAD',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_ADMIN"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })

        /**
         * Admin Information
         */
        .when('/admin/information-update/:id', {
            templateUrl: 'app/component/admin/views/pages/information/information-update.html',
            controller: 'CustomerControllerAD',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_STAFF", "ROLE_ADMIN", "ROLE_SUPERADMIN", "ROLE_GUIDE", "ROLE_AGENT_TRANSPORT", "ROLE_AGENT_HOTEL", "ROLE_AGENT_PLACE"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/admin/change-password/:id', {
            templateUrl: 'app/component/admin/views/pages/information/change-password.html',
            controller: 'InformationController',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_STAFF", "ROLE_ADMIN", "ROLE_SUPERADMIN", "ROLE_GUIDE", "ROLE_AGENT_TRANSPORT", "ROLE_AGENT_HOTEL", "ROLE_AGENT_PLACE"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })

        /**
         * Admin Template
         */
        .when('/admin/type/hotel-type-list', {
            templateUrl: 'app/component/admin/views/pages/admin-form/type/hotel-type/hotel-type-list.html',
            controller: 'HotelTypeControllerAD',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_ADMIN"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/admin/type/hotel-type-list/hotel-type-create', {
            templateUrl: 'app/component/admin/views/pages/admin-form/type/hotel-type/hotel-type-create.html',
            controller: 'HotelTypeControllerAD',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_ADMIN"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/admin/type/hotel-type-list/hotel-type-update/:id', {
            templateUrl: 'app/component/admin/views/pages/admin-form/type/hotel-type/hotel-type-update.html',
            controller: 'HotelTypeControllerAD',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_ADMIN"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })

        .when('/admin/type/visit-location-type-list', {
            templateUrl: 'app/component/admin/views/pages/admin-form/type/location-type/location-type-list.html',
            controller: 'VisitLocationTypeControllerAD',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_ADMIN"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/admin/type/visit-location-type-list/visit-location-type-create', {
            templateUrl: 'app/component/admin/views/pages/admin-form/type/location-type/location-type-create.html',
            controller: 'VisitLocationTypeControllerAD',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_ADMIN"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/admin/type/visit-location-type-list/visit-location-type-update/:id', {
            templateUrl: 'app/component/admin/views/pages/admin-form/type/location-type/location-type-update.html',
            controller: 'VisitLocationTypeControllerAD',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_ADMIN"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })

        .when('/admin/type/tour-type-list', {
            templateUrl: 'app/component/admin/views/pages/admin-form/type/tour-type/tour-type-list.html',
            controller: 'TourTypeControllerAD',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_ADMIN"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/admin/type/tour-type-list/tour-type-create', {
            templateUrl: 'app/component/admin/views/pages/admin-form/type/tour-type/tour-type-create.html',
            controller: 'TourTypeControllerAD',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_ADMIN"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/admin/type/tour-type-list/tour-type-update/:id', {
            templateUrl: 'app/component/admin/views/pages/admin-form/type/tour-type/tour-type-update.html',
            controller: 'TourTypeControllerAD',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_ADMIN"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/admin/type/transportation-type-list', {
            templateUrl: 'app/component/admin/views/pages/admin-form/type/transportation-type/transportation-type-list.html',
            controller: 'TransTypeControllerAD',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_ADMIN"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/admin/type/transportation-type-list/transportation-type-create', {
            templateUrl: 'app/component/admin/views/pages/admin-form/type/transportation-type/transportation-type-create.html',
            controller: 'TransTypeControllerAD',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_ADMIN"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/admin/type/transportation-type-list/transportation-type-update/:id', {
            templateUrl: 'app/component/admin/views/pages/admin-form/type/transportation-type/transportation-type-update.html',
            controller: 'TransTypeControllerAD',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_ADMIN"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })

        .when('/admin/type/transport-utilities-list', {
            templateUrl: 'app/component/admin/views/pages/admin-form/type/transportation-utilities/transportation-utilities-list.html',
            controller: 'TransportUtilityControllerAD',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_ADMIN"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/admin/type/transport-utilities-list/transport-utilities-create', {
            templateUrl: 'app/component/admin/views/pages/admin-form/type/transportation-utilities/transportation-utilities-create.html',
            controller: 'TransportUtilityControllerAD',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_ADMIN"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/admin/type/transport-utilities-list/transport-utilities-update/:transportUtilitiesId', {
            templateUrl: 'app/component/admin/views/pages/admin-form/type/transportation-utilities/transportation-utilities-update.html',
            controller: 'TransportUtilityControllerAD',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_ADMIN"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/admin/type/hotel-utility-list', {
            templateUrl: 'app/component/admin/views/pages/admin-form/type/hotel-utility/hotel-utility-list.html',
            controller: 'PlaceUtilityControllerAD',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_ADMIN"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/admin/type/hotel-utility-list/hotel-utility-create', {
            templateUrl: 'app/component/admin/views/pages/admin-form/type/hotel-utility/hotel-utility-create.html',
            controller: 'PlaceUtilityControllerAD',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_ADMIN"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/admin/type/hotel-utility-list/hotel-utility-update/:id', {
            templateUrl: 'app/component/admin/views/pages/admin-form/type/hotel-utility/hotel-utility-update.html',
            controller: 'PlaceUtilityControllerAD',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_ADMIN"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/admin/type/room-utility-list', {
            templateUrl: 'app/component/admin/views/pages/admin-form/type/room-utility/room-utility-list.html',
            controller: 'RoomUtilityControllerAD',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_ADMIN"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/admin/type/room-utility-list/room-utility-create', {
            templateUrl: 'app/component/admin/views/pages/admin-form/type/room-utility/room-utility-create.html',
            controller: 'RoomUtilityControllerAD',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_ADMIN"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/admin/type/room-utility-list/room-utility-update/:id', {
            templateUrl: 'app/component/admin/views/pages/admin-form/type/room-utility/room-utility-update.html',
            controller: 'RoomUtilityControllerAD',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_ADMIN"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/admin/type/bed-type-list', {
            templateUrl: 'app/component/admin/views/pages/admin-form/type/bed-type/bed-type-list.html',
            controller: 'BedTypeControllerAD',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_ADMIN"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/admin/type/bed-type-list/bed-type-create', {
            templateUrl: 'app/component/admin/views/pages/admin-form/type/bed-type/bed-type-create.html',
            controller: 'BedTypeControllerAD',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_ADMIN"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/admin/type/bed-type-list/bed-type-update/:id', {
            templateUrl: 'app/component/admin/views/pages/admin-form/type/bed-type/bed-type-update.html',
            controller: 'BedTypeControllerAD',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_ADMIN"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })

        /**
         * Guide
         */
        .when('/admin/guide-perfect', {
            templateUrl: 'app/component/admin/views/pages/guide/guide-perfect.html',
            controller: 'GuideController',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_GUIDE"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/admin/guide-continuous', {
            templateUrl: 'app/component/admin/views/pages/guide/guide-continuous.html',
            controller: 'GuideController',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_GUIDE"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/admin/guide-future', {
            templateUrl: 'app/component/admin/views/pages/guide/guide-future.html',
            controller: 'GuideController',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_GUIDE"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/admin/guide-cancel', {
            templateUrl: 'app/component/admin/views/pages/guide/guide-cancel.html',
            controller: 'GuideController',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_GUIDE"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/admin/guide-cancel/:id', {
            templateUrl: 'app/component/admin/views/pages/guide/service-tour-guide.html',
            controller: 'HotelForTourGuideController',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_GUIDE"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })

        /**
         * Agent
         */
        .when('/business/welcome-hotel', {
            templateUrl: 'app/component/agent/welcome.html',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_AGENT_HOTEL"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/business/welcome-transport', {
            templateUrl: 'app/component/agent/welcome.html',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_AGENT_TRANSPORT"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/business/welcome-place', {
            templateUrl: 'app/component/agent/welcome.html',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_AGENT_PLACE"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
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
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_AGENT_HOTEL", "ROLE_AGENT_TRANSPORT", "ROLE_AGENT_PLACE"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/business/register-business-success', {
            templateUrl: 'app/component/agent/business/register-business-success.html',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_AGENT_HOTEL", "ROLE_AGENT_TRANSPORT", "ROLE_AGENT_PLACE"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
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
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_AGENT_HOTEL", "ROLE_AGENT_TRANSPORT", "ROLE_AGENT_PLACE"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
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
            controller: 'RegisterHotelControllerAG',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_AGENT_HOTEL"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/business/hotel/home', {
            templateUrl: 'app/component/agent/hotel/views/pages/dashboard/hotels-management.html',
            controller: 'ListHotelControllerAG',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_AGENT_HOTEL"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/business/hotel/home/hotel/create', {
            templateUrl: 'app/component/agent/hotel/views/pages/hotel/hotel-information-add.html',
            controller: 'HotelInformationAddController',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_AGENT_HOTEL"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/business/hotel/home/hotel/update/:id', {
            templateUrl: 'app/component/agent/hotel/views/pages/hotel/hotel-information-edit.html',
            controller: 'HotelInformationEditController',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_AGENT_HOTEL"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/business/hotel/room-type-list', {
            templateUrl: 'app/component/agent/hotel/views/pages/service/room-type-list.html',
            controller: 'RoomTypeListController',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_AGENT_HOTEL"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/business/hotel/room-type-list/create', {
            templateUrl: 'app/component/agent/hotel/views/pages/service/room-type-add.html',
            controller: 'RoomTypeAddController',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_AGENT_HOTEL"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/business/hotel/room-type-list/update-info-room/:id', {
            templateUrl: 'app/component/agent/hotel/views/pages/service/room-type-info-room-edit.html',
            controller: 'RoomTypeInfoRoomEditController',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_AGENT_HOTEL"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/business/hotel/room-type-list/update-img-room/:id', {
            templateUrl: 'app/component/agent/hotel/views/pages/service/room-type-image-edit.html',
            controller: 'RoomTypeImageController',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_AGENT_HOTEL"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/business/hotel/room-type-list/update-utilities-room/:id', {
            templateUrl: 'app/component/agent/hotel/views/pages/service/room-type-utilities-edit.html',
            controller: 'RoomTypeUtilitiesEditController',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_AGENT_HOTEL"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/business/hotel/home/hotel-type-in/update/:id', {
            templateUrl: 'app/component/agent/hotel/views/pages/service/room-type-add.html',
            controller: 'HotelInformationEditController',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_AGENT_HOTEL"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/business/hotel/booking-list', {
            templateUrl: 'app/component/agent/hotel/views/pages/booking/booking-list.html',
            controller: 'BookingListController',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_AGENT_HOTEL"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/business/hotel/booking-list/add-booking-hotel', {
            templateUrl: 'app/component/agent/hotel/views/pages/booking/booking-add.html',
            controller: 'BookingAddControllerAG',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_AGENT_HOTEL"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/business/hotel/order-visit-list/create', {
            templateUrl: 'app/component/agent/hotel/views/pages/booking/booking-add.html',
            controller: 'HotelAmenitiesListControllerAG',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_AGENT_HOTEL"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/business/hotel/order-visit-list/update', {
            templateUrl: 'app/component/agent/hotel/views/pages/booking/booking-edit.html',
            controller: 'HotelAmenitiesListControllerAG',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_AGENT_HOTEL"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/business/hotel/accommodation-location-information/update', {
            templateUrl: 'app/component/agent/hotel/views/pages/hotel/accommodation-location-information-edit.html',
            controller: 'AccommodationLocationInformationEditController',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_AGENT_HOTEL"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/business/hotel/room-type-information-update', {
            templateUrl: 'app/component/agent/hotel/views/pages/hotel/room-type-information-edit.html',
            controller: 'AccommodationLocationInformationEditController',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_AGENT_HOTEL"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/business/hotel/room-modal-update', {
            templateUrl: 'app/component/agent/hotel/views/pages/hotel/room-amenities.html',
            controller: 'AccommodationLocationInformationEditController',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_AGENT_HOTEL"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/business/hotel/chat', {
            templateUrl: 'app/component/agent/hotel/views/pages/chat/chat-agency.html',
            controller: 'ChatHotelController',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_AGENT_HOTEL"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/business/hotel/statistical', {
            templateUrl: 'app/component/agent/hotel/views/pages/statistical/statistical-hotel.html',
            controller: 'StatisticalHotelControllerAG',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_AGENT_HOTEL"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/business/hotel/restore-room-type', {
            templateUrl: 'app/component/agent/hotel/views/pages/restore/restore-room-type.html',
            controller: 'RestoreRoomTypeController',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_AGENT_HOTEL"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })

        /**
         * Agent Transport
         */
        .when('/business/register-transports', {
            templateUrl: 'app/component/agent/trans/views/pages/register-transport.html',
            controller: 'RegisterTransControllerAG',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_AGENT_TRANSPORT"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/business/transport/home', {
            templateUrl: 'app/component/agent/trans/views/pages/dashboard/management-transport.html',
            controller: 'ListTransportBrandControllerAG',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_AGENT_TRANSPORT"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })

        /**
         * Transport brand
         */
        .when('/business/transport/home/create-transport', {
            templateUrl: 'app/component/agent/trans/views/pages/transport-brand/create-transport.html',
            controller: 'RegisterTransControllerAG',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_AGENT_TRANSPORT"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/business/transport/home/update-transport/:id', {
            templateUrl: 'app/component/agent/trans/views/pages/transport-brand/update-transport.html',
            controller: 'RegisterTransControllerAG',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_AGENT_TRANSPORT"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })

        /**
         * Transportation
         */
        .when('/business/transport/transport-management', {
            templateUrl: 'app/component/agent/trans/views/pages/transports/transport-list.html',
            controller: 'TransportControllerAG',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_AGENT_TRANSPORT"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/business/transport/transport-management/transport-image/:id', {
            templateUrl: 'app/component/agent/trans/views/pages/transports/transport-detail-image.html',
            controller: 'TransportDetailsImageControllerAD',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_AGENT_TRANSPORT"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/business/transport/transport-management/create-transport', {
            templateUrl: 'app/component/agent/trans/views/pages/transports/transport-create.html',
            controller: 'TransportControllerAG',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_AGENT_TRANSPORT"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/business/transport/transport-management/update-transport/:id', {
            templateUrl: 'app/component/agent/trans/views/pages/transports/transport-update.html',
            controller: 'TransportControllerAG',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_AGENT_TRANSPORT"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })

        /**
         * Order Transport
         */
        .when('/business/transport/schedules-management/order-transport-management/:scheduleId', {
            templateUrl: 'app/component/agent/trans/views/pages/bookings/booking-list.html',
            controller: 'OrderTransportControllerAG',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_AGENT_TRANSPORT"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/business/transport/schedules-management/order-transport-management/:scheduleId/create-order-visit', {
            templateUrl: 'app/component/agent/trans/views/pages/bookings/booking-create.html',
            controller: 'OrderTransportControllerAG',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_AGENT_TRANSPORT"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/business/transport/schedules-management/order-transport-management/:scheduleId/update-order-visit/:id', {
            templateUrl: 'app/component/agent/trans/views/pages/bookings/booking-update.html',
            controller: 'OrderTransportControllerAG',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_AGENT_TRANSPORT"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })

        /**
         * Transport Schedule Management
         */
        .when('/business/transport/schedules-management', {
            templateUrl: 'app/component/agent/trans/views/pages/schedules/schedules-list.html',
            controller: 'SchedulesControllerAG',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_AGENT_TRANSPORT"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/business/transport/schedules-management/create-schedules', {
            templateUrl: 'app/component/agent/trans/views/pages/schedules/schedules-create.html',
            controller: 'SchedulesControllerAG',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_AGENT_TRANSPORT"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/business/transport/schedules-management/update-schedules/:id', {
            templateUrl: 'app/component/agent/trans/views/pages/schedules/schedules-update.html',
            controller: 'SchedulesControllerAG',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_AGENT_TRANSPORT"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })

        /**
         * Transport Request Car From TravelTour
         */
        .when('/business/transport/notification-request-car', {
            templateUrl: 'app/component/agent/trans/views/pages/request-car/notification-request-car.html',
            controller: 'RequestCarControllerAG',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_AGENT_TRANSPORT"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/business/transport/notification-request-car/select-car/:requestCarId', {
            templateUrl: 'app/component/agent/trans/views/pages/request-car/select-car.html',
            controller: 'SelectCarControllerAG',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_AGENT_TRANSPORT"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/business/transport/history-request-car', {
            templateUrl: 'app/component/agent/trans/views/pages/request-car/history-request-car.html',
            controller: 'HistoryRequestCarControllerAG',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_AGENT_TRANSPORT"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })

        /**
         * Transport Thống kê
         */
        .when('/business/transport/statistical', {
            templateUrl: 'app/component/agent/trans/views/pages/statistical/statistical-transport.html',
            controller: 'StatisticalTransportControllerAG',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_AGENT_TRANSPORT"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })

        /**
         * Agent Visit
         */
        .when('/business/register-visit', {
            templateUrl: 'app/component/agent/visits/views/pages/register-visits.html',
            controller: 'RegisterVisitsControllerAG',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_AGENT_PLACE"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/business/visit/home', {
            templateUrl: 'app/component/agent/visits/views/pages/dashboard/management-visit.html',
            controller: 'ListVisitControllerAG',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_AGENT_PLACE"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/business/visit/home/create-visit-location', {
            templateUrl: 'app/component/agent/visits/views/pages/visit-location/create-visits.html',
            controller: 'RegisterVisitsControllerAG',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_AGENT_PLACE"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/business/visit/home/update-visit-location/:id', {
            templateUrl: 'app/component/agent/visits/views/pages/visit-location/update-visits.html',
            controller: 'RegisterVisitsControllerAG',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_AGENT_PLACE"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/business/visit/visit-ticket-management', {
            templateUrl: 'app/component/agent/visits/views/pages/visit-ticket/ticket-list.html',
            controller: 'VisitControllerAG',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_AGENT_PLACE"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/business/visit/visit-ticket-management/create-visit-ticket', {
            templateUrl: 'app/component/agent/visits/views/pages/visit-ticket/ticket-create.html',
            controller: 'VisitControllerAG',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_AGENT_PLACE"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/business/visit/visit-ticket-management/update-visit-ticket/:id', {
            templateUrl: 'app/component/agent/visits/views/pages/visit-ticket/ticket-update.html',
            controller: 'VisitControllerAG',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_AGENT_PLACE"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/business/visit/order-visit-management', {
            templateUrl: 'app/component/agent/visits/views/pages/bookings/booking-visit-list.html',
            controller: 'OrderVisitControllerAG',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_AGENT_PLACE"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/business/visit/order-visit-management/create-order-visit', {
            templateUrl: 'app/component/agent/visits/views/pages/bookings/booking-visit-create.html',
            controller: 'OrderVisitControllerAG',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_AGENT_PLACE"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/business/visit/order-visit-management/update-order-visit/:id', {
            templateUrl: 'app/component/agent/visits/views/pages/bookings/booking-visit-update.html',
            controller: 'OrderVisitControllerAG',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_AGENT_PLACE"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })
        .when('/business/visit/statistical', {
            templateUrl: 'app/component/agent/visits/views/pages/statistical/statistical-visit.html',
            controller: 'StatisticalVisitControllerAG',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_AGENT_PLACE"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/login-admin');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/login-admin');
                    }
                }
            }
        })

        /**
         * Customer Form
         */
        .when('/home', {
            templateUrl: 'app/component/customers/views/pages/home/home.html',
            controller: 'HomeCusController'
        })
        .when('/payment-policy', {
            templateUrl: 'app/component/customers/views/pages/home/payment-policy.html',
            controller: 'MainController'
        })
        .when('/home/see-ticket-informatione/:orderTransportId', {
            templateUrl: 'app/component/customers/views/pages/home/home.html',
            controller: 'TicketController'
        })
        .when('/information/:id', {
            templateUrl: 'app/component/customers/views/pages/info/information.html',
            controller: 'InformationController',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_CUSTOMER"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/home');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/home');
                    }
                }
            }
        })
        .when('/change-password/:id', {
            templateUrl: 'app/component/customers/views/pages/info/change-password.html',
            controller: 'InformationController',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_CUSTOMER"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/home');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/home');
                    }
                }
            }
        })
        .when('/history-order/:id', {
            templateUrl: 'app/component/customers/views/pages/info/history-order.html',
            controller: 'BookingTourCustomerController',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_CUSTOMER"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/home');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/home');
                    }
                }
            }
        })
        .when('/favourites/:id', {
            templateUrl: 'app/component/customers/views/pages/info/favourite.html',
            controller: 'FavoritesController',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_CUSTOMER"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/home');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/home');
                    }
                }
            }
        })
        .when('/order-visit', {
            templateUrl: 'app/component/customers/views/pages/tour/booking.html',
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
            controller: 'TourCusController'
        })
        .when('/tours/tour-detail/:id', {
            templateUrl: 'app/component/customers/views/pages/tour/tour-details.html',
            controller: 'TourDetailCusController'
        })
        .when('/tourism-location', {
            templateUrl: 'app/component/customers/views/pages/location/location-tour.html',
            controller: 'LocationCusController'
        })
        .when('/tourism-location/tourism-location-detail/:id', {
            templateUrl: 'app/component/customers/views/pages/location/location-tour-detail.html',
            controller: 'LocationDetailCusController'
        })
        .when('/hotel', {
            templateUrl: 'app/component/customers/views/pages/hotel/hotel.html',
            controller: 'HotelCustomerController'
        })
        .when('/hotel/hotel-detail/:encryptedData', {
            templateUrl: 'app/component/customers/views/pages/hotel/hotel-detail.html',
            controller: 'HotelDetailController'
        })
        .when('/chat/:id', {
            templateUrl: 'app/component/customers/views/pages/chat/chat.html',
            controller: 'ChatCustomerController',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_CUSTOMER"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/home');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/home');
                    }
                }
            }
        })
        .when('/hotel/hotel-details/payment', {
            templateUrl: 'app/component/customers/views/pages/hotel/payment-hotel.html',
            controller: 'PaymentHotelController'
        })
        .when("/hotel/hotel-details/payment/payment-successful/:orderStatus/:paymentMethod/:orderId", {
            templateUrl: 'app/component/customers/views/pages/hotel/payment-hotel-success.html',
            controller: 'PaymentSuccessHotelController'
        })
        .when('/chat', {
            templateUrl: 'app/component/customers/views/pages/chat/chat.html',
            controller: 'ChatCustomerController',
            resolve: {
                "check": function ($location, AuthService) {
                    let userRoles = AuthService.getUser();

                    if (userRoles !== null) {
                        let requiredRoles = ["ROLE_CUSTOMER"];
                        let roles = userRoles.roles ? userRoles.roles.map(role => role.nameRole) : [];

                        if (!roles.some(role => requiredRoles.includes(role))) {
                            $location.path('/home');
                            AuthService.clearAuthData();
                        }
                    } else {
                        $location.path('/home');
                    }
                }
            }
        })

        /**
         * Booking transport customer
         */
        .when('/drive-move', {
            templateUrl: 'app/component/customers/views/pages/transport/transport.html',
            controller: 'TransportCusController'
        })
        .when('/drive-move/drive-transport-detail/:brandId', {
            templateUrl: 'app/component/customers/views/pages/transport/transport-detail.html',
            controller: 'TransportDetailCusController'
        })
        .when('/drive-move/drive-transport-detail/:brandId/booking-confirmation/:scheduleId', {
            templateUrl: 'app/component/customers/views/pages/transport/transport-booking.html',
            controller: 'TransBookingCusController'
        })
        .when('/drive-move/drive-transport-detail/booking-confirmation/booking-successfully', {
            templateUrl: 'app/component/customers/views/pages/transport/transport-booking-success.html',
            controller: 'TransBookingSuccessCusController'
        })

        /**
         * Booking tour customer
         */
        .when('/tours/tour-detail/:id/booking-tour', {
            templateUrl: 'app/component/customers/views/pages/tour/booking.html',
            controller: 'BookingTourCusController'
        })
        .when('/tours/tour-detail/:id/booking-tour/customer-information', {
            templateUrl: 'app/component/customers/views/pages/tour/booking-info-customer.html',
            controller: 'BookingTourCusController'
        })
        .when('/tours/tour-detail/booking-tour/customer-information/payment-success', {
            templateUrl: 'app/component/customers/views/pages/tour/booking-tour-success.html',
            controller: 'BookingTourSuccessCusController'
        })

        /**
         * Booking locations
         */
        .when('/tourism-location/tourism-location-detail/:id/booking-location', {
            templateUrl: 'app/component/customers/views/pages/location/booking-location.html',
            controller: 'BookingLocationCusController'
        })
        .when('/tourism-location/tourism-location-detail/:id/booking-location/customer-information', {
            templateUrl: 'app/component/customers/views/pages/location/booking-location-info-customer.html',
            controller: 'BookingLocationCusController'
        })
        .when('/tourism-location/tourism-location-detail/:id/booking-location/customer-information/check-information', {
            templateUrl: 'app/component/customers/views/pages/location/booking-location-check-info.html',
            controller: 'BookingLocationSuccessCusController'
        })
        .when('/tourism-location/tourism-location-detail/:id/booking-location/customer-information/check-information/payment-success', {
            templateUrl: 'app/component/customers/views/pages/location/booking-location-check-info.html',
            controller: 'BookingLocationSuccessCusController'
        })

        /**
         * Register Agencies
         */
        .when('/register-agency', {
            templateUrl: 'app/component/customers/views/pages/register-agency/register-agency-home.html'
        })
        .when('/register-agency/register', {
            templateUrl: 'app/component/customers/views/pages/register-agency/register-agency-otp.html',
            controller: 'RegisterAgencyCusController',
        })
        .when('/register-agency/register/information', {
            templateUrl: 'app/component/customers/views/pages/register-agency/register-agency-form.html',
            controller: 'RegisterAgencyFormCusController',
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
        .when('/admin-forgot-password', {
            templateUrl: 'app/component/admin/views/pages/password/forgot.html',
            controller: 'ForgotPwController'
        })
        .when('/verify-success/:token', {
            templateUrl: 'app/component/customers/views/pages/auth/verify-success.html',
            controller: 'VerifyEmail'
        })
        .when('/account/forgot-pass', {
            templateUrl: 'app/component/customers/views/pages/password/failed-time.html',
            controller: ''
        })
        .when('/account/forgot-pass/:verifyCode', {
            templateUrl: 'app/component/customers/views/pages/password/new-password.html',
            controller: 'ChangePwController'
        })
        .when('/admin-account/forgot-pass', {
            templateUrl: 'app/component/admin/views/pages/password/failed-time.html',
            controller: ''
        })
        .when('/admin-account/forgot-pass/:verifyCode', {
            templateUrl: 'app/component/admin/views/pages/password/new-password.html',
            controller: 'ChangePassAdminController'
        })
        .when('/', {
            redirectTo: '/home'
        })
        .otherwise({
            redirectTo: '/admin/page-not-found'
        });

    if (window.history && window.history.pushState) {
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    }
});