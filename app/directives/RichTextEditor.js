travel_app.directive('richTextEditor', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            // Tạo code AngularJS cho Rich Text Editor ở đây
            let optionsButtons = element[0].querySelectorAll(".option-button");
            let advancedOptionButton = element[0].querySelectorAll(".adv-option-button");
            let fontName = element[0].querySelector("#fontName");
            let fontSizeRef = element[0].querySelector("#fontSize");
            let writingArea = element[0].querySelector("#text-input");
            let createTableButton = element[0].querySelector("#createTable");

            // Khởi tạo font và size
            let fontList = ["Arial", "Verdana", "Times New Roman", "Garamond", "Georgia", "Courier New", "cursive"];

            fontList.forEach(function (font) {
                let option = document.createElement("option");
                option.value = font;
                option.innerHTML = font;
                fontName.appendChild(option);
            });

            for (let i = 1; i <= 7; i++) {
                let option = document.createElement("option");
                option.value = i;
                option.innerHTML = i;
                fontSizeRef.appendChild(option);
            }

            fontSizeRef.value = 3;

            // Xử lý sự kiện cho các nút
            Array.prototype.forEach.call(optionsButtons, function (button) {
                button.addEventListener('click', function () {
                    modifyText(button.id);
                });
            });

            Array.prototype.forEach.call(advancedOptionButton, function (button) {
                button.addEventListener('change', function () {
                    modifyText(button.id, button.value);
                });
            });

            // Tạo bảng
            createTableButton.addEventListener('click', function () {
                let numRows = prompt("Nhập số hàng:");
                let numCols = prompt("Nhập số cột:");
                if (numRows && numCols) {
                    createTable(numRows, numCols);
                }
            });

            // Hàm thay đổi text
            function modifyText(command, value) {
                document.execCommand(command, false, value);
            }

            // Hàm tạo bảng
            function createTable(rows, cols) {
                let tableHtml = "<table class='table'>";
                for (let i = 0; i < rows; i++) {
                    tableHtml += "<tr>";
                    for (let j = 0; j < cols; j++) {
                        tableHtml += "<td>Text</td>";
                    }
                    tableHtml += "</tr>";
                }
                tableHtml += "</table>";
                writingArea.innerHTML += tableHtml;
            }
        }
    };
});

travel_app.directive('customTooltip', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            // Lấy nội dung tooltip từ thuộc tính tooltip-content
            let customTooltip = attrs.customTooltip;

            // Thiết lập tooltip sử dụng nội dung từ tooltip-content
            let tooltip = $(element).tooltip({
                title: customTooltip,
                placement: attrs.placement || 'top',
                trigger: 'hover'
            });

            scope.$on('$destroy', function () {
                tooltip.tooltip('dispose');
            });
        }
    };
});
