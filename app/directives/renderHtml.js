travel_app.directive('renderHtml', function($sce) {
    return {
        restrict: 'A',
        scope: {
            htmlText: '='
        },
        link: function(scope, element) {
            scope.$watch('htmlText', function(newVal) {
                if (newVal) {
                    var html = $sce.trustAsHtml(newVal);
                    element.html(html);
                }
            });
        }
    };
});