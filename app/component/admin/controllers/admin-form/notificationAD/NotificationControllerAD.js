travel_app.controller('NotificationControllerAD',
    function ($scope, $http, $location, $sce, $rootScope, $routeParams, $timeout, NotificationsServiceAD) {
        $scope.maxVisibleNotifications = 5;
        $scope.visibleNotifications = [];

        function errorCallback() {
            $location.path('/admin/internal-server-error')
        }

        $scope.init = function () {
            $scope.isLoading = true;

            NotificationsServiceAD.findAllNote().then(function successCallback(response) {
                $scope.showNotifications = false;
                $scope.allNotification = response.data.data;
                if ($scope.allNotification == null) {
                    return
                }

                for (let i = 0; i < $scope.allNotification.length; i++) {
                    if ($scope.allNotification[i].isSeen === false) {
                        $scope.showNotifications = true;
                    }
                }
                $scope.updateVisibleNotifications();
            }, errorCallback).finally(function () {
                $scope.isLoading = false;
            });
        }

        setInterval(function () {
            $scope.init();
        }, 3000);

        $scope.init();

        $scope.showMore = function (event) {
            $scope.maxVisibleNotifications += 10;
            $scope.updateVisibleNotifications();
            event.stopPropagation();
            //$scope.$apply();
        };

        $scope.hideMore = function (event) {
            $scope.maxVisibleNotifications = 5;
            $scope.updateVisibleNotifications();
            event.stopPropagation();
        };

        $scope.updateVisibleNotifications = function () {
            $scope.visibleNotifications = $scope.allNotification.slice(0, $scope.maxVisibleNotifications);
        };

        $scope.seenNotification = function (id) {
            $scope.isLoading = true;

            NotificationsServiceAD.seenNote(id).then(function (response) {
                if (response.status === 200) {
                    $scope.loadData();
                } else {
                    $location.path('/admin/page-not-found');
                }
            }, errorCallback).finally(function () {
                $scope.isLoading = false;
            });
        }

        $scope.seenNotificationAndGo = function (id) {
            $scope.isLoading = true;

            NotificationsServiceAD.seenNote(id).then(function (response) {
                if (response.status === 200) {
                    $scope.loadData();
                    $scope.setActiveNavItem('register-list');
                    $location.path('/admin/agency/agency-list-check');
                } else {
                    $location.path('/admin/page-not-found');
                }
            }, errorCallback).finally(function () {
                $scope.isLoading = false;
            });
        }

        $scope.deleteNotification = function (id) {
            $scope.isLoading = true;

            NotificationsServiceAD.deleteNote(id).then(function (response) {
                if (response.status === 200) {
                    $scope.loadData();
                } else {
                    $location.path('/admin/page-not-found');
                }
            }, errorCallback).finally(function () {
                $scope.isLoading = false;
            });
        }

        $scope.loadData = function () {
            $scope.isLoading = true;

            NotificationsServiceAD.findAllNote().then(function successCallback(response) {
                if (response.status === 200) {
                    $scope.showNotifications = false;
                    $scope.allNotification = response.data.data;

                    if (response.data.data === null) {
                        $scope.showNotifications = false;
                        return;
                    }

                    for (let i = 0; i < $scope.allNotification.length; i++) {
                        if ($scope.allNotification[i].isSeen === false) {
                            $scope.showNotifications = true;
                            break;
                        }
                    }

                    $scope.updateVisibleNotifications();
                } else {
                    $location.path('/admin/page-not-found');
                }
            }, errorCallback).finally(function () {
                $scope.isLoading = false;
            });
        }
    });