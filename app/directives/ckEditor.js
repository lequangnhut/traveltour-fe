travel_app.directive('ckEditor', function () {
    return {
        require: '?ngModel',
        link: function (scope, element, attr, ngModel) {
            if (!ngModel) return;
            ClassicEditor
                .create(element[0])
                .then(editor => {
                    editor.model.document.on('change:data', () => {
                        ngModel.$setViewValue(editor.getData());
                        // Only `$apply()` when there are changes, otherwise it will be an infinite digest cycle
                        if (editor.getData() !== ngModel.$modelValue) {
                            scope.$apply();
                        }
                    });
                    ngModel.$render = () => {
                        editor.setData(ngModel.$modelValue);
                    };
                    scope.$on('$destroy', () => {
                        editor.destroy();
                    });
                });
        }
    };
})