travel_app.directive('richTextEditor', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            // Tạo code AngularJS cho Rich Text Editor ở đây
            var optionsButtons = element[0].querySelectorAll(".option-button");
            var advancedOptionButton = element[0].querySelectorAll(".adv-option-button");
            var fontName = element[0].querySelector("#fontName");
            var fontSizeRef = element[0].querySelector("#fontSize");
            var writingArea = element[0].querySelector("#text-input");
            var createTableButton = element[0].querySelector("#createTable");

            // Khởi tạo font và size
            var fontList = ["Arial", "Verdana", "Times New Roman", "Garamond", "Georgia", "Courier New", "cursive"];

            fontList.forEach(function(font) {
                var option = document.createElement("option");
                option.value = font;
                option.innerHTML = font;
                fontName.appendChild(option);
            });

            for (var i = 1; i <= 7; i++) {
                var option = document.createElement("option");
                option.value = i;
                option.innerHTML = i;
                fontSizeRef.appendChild(option);
            }

            fontSizeRef.value = 3;

            // Xử lý sự kiện cho các nút
            Array.prototype.forEach.call(optionsButtons, function(button) {
                button.addEventListener('click', function() {
                    modifyText(button.id);
                });
            });

            Array.prototype.forEach.call(advancedOptionButton, function(button) {
                button.addEventListener('change', function() {
                    modifyText(button.id, button.value);
                });
            });

            // Tạo bảng
            createTableButton.addEventListener('click', function() {
                var numRows = prompt("Nhập số hàng:");
                var numCols = prompt("Nhập số cột:");
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
                var tableHtml = "<table class='table'>";
                for (var i = 0; i < rows; i++) {
                    tableHtml += "<tr>";
                    for (var j = 0; j < cols; j++) {
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