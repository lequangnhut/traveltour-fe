travel_app.controller('RegisterAgencyController', function ($scope, $http, $window,$interval, AuthService) {
    $scope.dynamicWord = "Chỗ nghỉ";
    var index = 0;
    var words = ["Khách sạn", "Xe", "Điểm tham quan"];

    var changeWord = function() {
        $scope.dynamicWord = words[index % words.length];
        index++;
    };

    var intervalPromise = $interval(changeWord, 2000);

    $scope.$on('$destroy', function() {
        // Hủy bỏ promise khi controller bị hủy
        if (angular.isDefined(intervalPromise)) {
            $interval.cancel(intervalPromise);
            intervalPromise = undefined;
        }
    });
})