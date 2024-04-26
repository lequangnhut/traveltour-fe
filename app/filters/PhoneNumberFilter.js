travel_app.filter('phoneNumber', function () {
    return function (input) {
        if (!input) return 'Chưa có dữ liệu';
        let phoneNumber = input.replace(/\D/g, '');

        return phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    };
});

travel_app.filter('trustHtml', ['$sce', function ($sce) {
    return function (html) {
        if (typeof html === 'string') {
            return $sce.trustAsHtml(html);
        } else {
            return html;
        }
    };
}]);
