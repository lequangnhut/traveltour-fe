travel_app.controller('BookingEditController', function($scope) {
    $scope.booking = {
        roomType: null,
        imageFiles: null,
    }

    $scope.validateImageFiles = function() {
        var maxImages = 10;

        if ($scope.booking.imageFiles && $scope.booking.imageFiles.length > maxImages) {
            $scope.register_hotel.imageFiles.$setValidity('maxImages', false);
        } else {
            $scope.register_hotel.imageFiles.$setValidity('maxImages', true);
        }
    };

    $scope.checkboxes = [
        { id: 'checkbox1', label: 'Example checkbox 1', checked: false },
        { id: 'checkbox2', label: 'Example checkbox 2', checked: false },
        // ... thêm checkbox cần thiết
    ];

    $scope.checkboxCount = 0;

    $scope.updateCheckboxCount = function() {
        $scope.checkboxCount = $scope.checkboxes.filter(function(checkbox) {
            return checkbox.checked;
        }).length;
    };

    /**
     * Upload hình ảnh và lưu vào biến business_images
     * @param file
     */
    $scope.uploadBusinessImage = function (file) {
        if (file && !file.$error) {
            $scope.agent.business_images = file;
        }
    };
})