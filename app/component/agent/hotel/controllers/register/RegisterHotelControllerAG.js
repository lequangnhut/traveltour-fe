travel_app.controller("RegisterHotelControllerAG", function($scope) {
    $scope.currentStep = 1;

    $scope.nextStep = function() {
        if ($scope.currentStep < 6) {
            $scope.currentStep++;
        }
    };

    $scope.prevStep = function() {
        if ($scope.currentStep <= 6) {
            $scope.currentStep--;
        }
    };
})