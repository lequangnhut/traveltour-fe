travel_app.controller("FavoritesController", function ($scope, $routeParams, $location, $timeout, AuthService, UserLikeService) {
    let user;
    user = AuthService.getUser();

    $scope.userIdEncrypt = $routeParams.id;
    $scope.tours = {}
    $scope.hotels = {}
    $scope.transportationBrands = {}
    $scope.visitLocations = {}

    $scope.selectedTab = 0;

    $scope.selectTab = function (setTab) {
        $scope.selectedTab = setTab;
    };

    /**
     * Phương thức hiển thị danh sách yêu thích của dịch vụ
     */
    if (user != null && user) {
        UserLikeService.findAllUserLikeByUserId(user.id).then(function (response) {
            if (response.status === 200) {
                if (response.data.status === "200") {
                    $scope.tours = response.data.data.tours
                    $scope.hotels = response.data.data.hotels
                    $scope.transportationBrands = response.data.data.transportationBrands
                    $scope.visitLocations = response.data.data.visitLocations
                }
            }
        })
    } else {
        console.log("lỗi")
    }
})