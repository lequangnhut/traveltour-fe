travel_app.filter('phoneNumber', function () {
    return function (input) {
        if (!input) return '';

        // Xóa các ký tự không phải số khỏi chuỗi số điện thoại
        var phoneNumber = input.replace(/\D/g, '');

        // Định dạng số điện thoại theo mẫu: (XXX) XXX-XXXX
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
