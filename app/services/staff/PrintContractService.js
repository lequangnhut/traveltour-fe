travel_app.service('PrintContractService', ['$window', '$filter', function ($window, $filter) {
    this.printContracts = (data) => {
        let windowFeatures = 'left=300,right=200,top=100,toolbar=no,location=no,directories=no,menubar=no,scrollbars=no,width=900,height=600';
        let printWindow = $window.open('', '', windowFeatures);

        let bookingTour = data;
        let tours = data.toursByTourId;
        let tourDetail = data.tourDetailsByTourDetailId;
        let staffGuide = tourDetail.usersByGuideId;
        let contract = data.contractsById[0];

        let today = new Date();
        let customerPhone = $filter('phoneNumber')(bookingTour.customerPhone);
        let customerQuantityTotal = parseInt(bookingTour.capacityAdult) + parseInt(bookingTour.capacityKid);
        let guidePhone = $filter('phoneNumber')(staffGuide.phone);

        let tourDateLimit = $filter('calculateDaysAndNights')(tourDetail.departureDate, tourDetail.arrivalDate);
        let tourDepartureDate = $filter('formatDate')(tourDetail.departureDate);
        let tourArrivalDate = $filter('formatDate')(tourDetail.arrivalDate);
        let tourUnitPriceAdult = $filter('vnCurrency')(tourDetail.unitPrice);
        let tourUnitPriceKid = $filter('vnCurrency')(tourDetail.unitPrice * 0.3);

        let bookingTourCustomer = bookingTour.bookingTourCustomersById;
        let bookingTourTotal = $filter('vnCurrency')(bookingTour.orderTotal);
        let bookingTourTotalWord = $filter('vnCurrencyWord')(bookingTour.orderTotal);
        let bookingTourDatePayment = $filter('vietnameseDateTime')(contract.dateCreated);

        const tableRows = [];

        for (let i = 0; i < customerQuantityTotal; i++) {
            tableRows.push(`
                <tr>
                    <td class="px-4 py-2 border border-gray-300">${bookingTourCustomer.length + i + 1}</td>
                    <td class="px-4 py-2 border border-gray-300">&nbsp;</td>
                    <td class="px-4 py-2 border border-gray-300">&nbsp;</td>
                    <td class="px-4 py-2 border border-gray-300">&nbsp;</td>
                    <td class="px-4 py-2 border border-gray-300">&nbsp;</td>
                </tr>
            `);
        }
        const combinedTableRows = tableRows.join('');

        printWindow.document.open();
        printWindow.document.write(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Hợp đồng kinh doanh dịch vụ</title>
            <link href="https://fonts.googleapis.com/css?family=OpenSans:400,600,700&display=swap" rel="stylesheet">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
            
            <style>
                .invoice-bg {
                    background: #fff;
                }
              
                .faded-logo {
                    position: absolute;
                    top: 40%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    opacity: 0.3;
                    max-width: 50%;
                }
              
                .text-travel-tour {
                    position: fixed;
                    width: 100%;
                    top: 30%;
                    bottom: 50%;
                    opacity: 0.1;
                    font-size: 18.5vw;
                    transform: rotate(-20deg);
                    font-weight: 700;
                }
                
                @media print {
                    .text-travel-tour {
                        position: fixed;
                        width: 100%;
                        top: 40%; /* điều chỉnh khoảng cách từ đỉnh trang */
                        bottom: 50%;
                        opacity: 0.1;
                        font-size: 18.5vw;
                        transform: rotate(-20deg);
                        font-weight: 700;
                        z-index: 9999; /* để đảm bảo nằm trên các phần khác */
                    }
                
                    .faded-logo {
                        position: fixed;
                        top: 35%;
                        left: 50%;
                        transform: translateX(-50%);
                        opacity: 0.3;
                        max-width: 50%;
                        z-index: 9998; /* để đảm bảo nằm dưới phần nội dung */
                    }
                }
            </style>
            </head>
            <body class="invoice-bg font-sans antialiased">
            <div class="mx-auto">
                <div class="text-travel-tour">
                    TravelTour
                </div>
                <img src="/assets/admin/assets/img/logos/logo.png" alt="Faded Company Logo" class="faded-logo">
            </div>
           
            <header class="flex justify-between items-center pb-4">
                <div>
                    <h1 class="text-1xl font-bold">CÔNG TY DU LỊCH LỮ HÀNH</h1>
                    <p class="font-bold text-center">TRAVELTOUR</p>
                    <hr class="mt-3 mx-auto" style="width: 80px">
                </div>
                <div class="text-right">
                    <p class="font-medium">CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
                    <p class="font-bold text-center">Độc lập – Tự do – Hạnh phúc</p>
                    <hr class="mt-3 mx-auto" style="width: 80px">
                </div>
            </header>
            
            <div class="text-right">
                <p class="font-medium">
                    <i>Cần Thơ, ngày ${today.getDate()} tháng ${today.getMonth() + 1} năm ${today.getFullYear()}</i>
                </p>
            </div>
            
            <div class="mt-2">
                <h1 class="text-1xl font-bold text-center">HỢP ĐỒNG DỊCH VỤ LỮ HÀNH</h1>
                <h1 class="text-1xl font-bold text-center">${tourDetail.toursByTourId.tourName}</h1>
                
                <div class="content mt-3">
                    <div class="mb-2">
                        Căn cứ Luật thương mại được Quốc hội nước Cộng hòa xã hội chủ nghĩa Việt Nam khóa XI, kỳ họp thứ
                        VII thông qua ngày 14 tháng 06 năm 2005;
                    </div>
                    <div class="mb-2">
                        Căn cứ Bộ luật dân sự được Quốc hội nước Cộng hòa xã hội chủ nghĩa Việt Nam khóa XIII thông qua 
                        ngày 24 tháng 11 năm 2015;
                    </div>
                    <div class="mb-2">
                        Căn cứ nhu cầu và khả năng của các bên.
                    </div>
                    <div class="mb-2">
                        Hôm nay, ngày ${today.getDate()} tháng ${today.getMonth() + 1} năm ${today.getFullYear()}, 
                        vào lúc ${today.getHours()} giờ ${today.getMinutes()} phút ${today.getSeconds()} giây 
                        tại văn phòng Công ty Dịch vụ Du lịch và Lữ hành TravelTour,
                    </div>
                    <div class="mb-2">
                        Chúng tôi gồm có:
                        <div class="mb-2">
                            <span class="font-bold">Bên A: (KHÁCH DU LỊCH) ${bookingTour.customerName}</span> <br>
                            <span>Số căn cước công dân:</span> ${bookingTour.customerCitizenCard} <br>
                            <span>Điện thoại:</span> ${customerPhone} <br>
                            <span>Email:</span> ${bookingTour.customerEmail}
                        </div> 
                        
                        <div class="mb-2">
                            <span class="font-bold">Bên B: Công ty Dịch vụ Du lịch và Lữ hành Travel Tour</span> <br>
                            <span>Địa chỉ: 12/34/56 Đại lộ Hòa Bình, phường Tân An, quận Ninh Kiều, TP.Cần Thơ. <br>
                            
                            <div class="grid grid-cols-2 gap-4">
                                <div class="col-span-1">
                                    <span>Người đại diện:</span> Nuuyễn Dỹ Khang <br>
                                    <span>Điện thoại:</span> (037) 5780061 <br>
                                    <span>Giấy phép kinh doanh số:</span> 8605679857
                                </div>
                                <div class="col-span-1">
                                    <span>Chức vụ:</span> Giám đốc điều hành <br>
                                    <span>Fax:</span> 0292 365 159 <br>
                                    <span>Nơi cấp:</span> Thành phố Cần Thơ 
                                </div>
                            </div>
                            
                            <h2 class="font-bold underline">Hai bên thống nhất ký một số điều khoản phục vụ khách du lịch như sau:</h2>
                        </div> 
                        
                        <div class="mb-2">
                            <h1 class="font-bold">ĐIỀU 1: CHƯƠNG TRÌNH THAM QUAN DU LỊCH</h1>
                            
                            <div class="mb-2">
                                <h2>
                                    Bên B tổ chức cho bên A chương trình: ${tours.tourName}
                                </h2>
                                <ul class="list-inside">
                                    <li class="flex items-center">
                                        <span class="mr-2">•</span> 
                                        Phương tiện: Xe khách đời mới có nhiều tiện ích, lái xe nhiệt tình vui vẻ.
                                    </li>
                                    <li class="flex items-center">
                                        <span class="mr-2">•</span> 
                                        Mức ăn chính: 180.000đ/bữa/người, ăn sáng 50.000đ/bữa/người. 
                                    </li>
                                    <li class="flex items-center">
                                        <span class="mr-2">•</span> 
                                        Phòng nghỉ tiêu chuẩn, từ 2 - 4 người/phòng.
                                    </li>
                                    <li class="flex items-center">
                                        <span class="mr-2">•</span> 
                                        Hướng dẫn viên: Chuyên nghiệp, nhiệt tình, thành thạo, chu đáo suốt hành trình.
                                    </li>
                                     <li class="flex items-center">
                                        <span class="mr-2">•</span> 
                                        Vé thăm quan: Đã bao gồm trong chi phí tour, nếu có phát sinh thêm thì du khách tự chi trả theo giá vé được niêm yết của cơ sở kinh doanh tham quan.
                                    </li>
                                    <li class="flex items-center">
                                        <span class="mr-2">•</span> 
                                        Tàu thuyền tham quan theo chương trình.
                                    </li>
                                    <li class="flex items-center">
                                        <span class="mr-2">•</span> 
                                        Bảo hiểm du lịch theo quy định của Tổng Cục Du Lịch
                                    </li>
                                    <li class="flex items-center">
                                        <span class="mr-2">•</span> 
                                        Nón và nước uống trên xe.
                                    </li>
                                </ul>
                            </div>
                            
                            <div class="mb-2">
                                <h1 class="font-bold">ĐIỀU 2: SỐ LƯỢNG KHÁCH ĐÃ ĐẶT</h1>
                                
                                <h2>
                                    Tổng số lượng khách đã đặt: ${customerQuantityTotal} khách
                                </h2>
                                <ul class="list-inside">
                                    Trong đó:
                                    ${parseInt(bookingTour.capacityAdult) !== 0 ? `
                                    <li class="flex items-center">
                                        <span class="mr-2">•</span> 
                                        ${parseInt(bookingTour.capacityAdult)} khách người lớn.
                                    </li>` : ``}
                                    ${parseInt(bookingTour.capacityKid) !== 0 ? `
                                    <li class="flex items-center">
                                        <span class="mr-2">•</span> 
                                        ${parseInt(bookingTour.capacityKid)} khách trẻ em.
                                    </li>` : ``}
                                </ul>
                            </div>
                            
                            <div class="mb-2">
                                <h1 class="font-bold">ĐIỀU 3: THỜI GIAN THỰC HIỆN</h1>
                                
                                <ul class="list-inside">
                                    <li class="flex items-center">
                                        <span class="mr-2">1.</span> 
                                        Thời gian thực hiện: ${tourDateLimit}, từ ngày ${tourDepartureDate} đến ngày ${tourArrivalDate}
                                    </li>
                                    <li class="flex items-center">
                                        <span class="mr-2">2.</span> 
                                        Điểm khởi hành: ${tourDetail.fromLocation}
                                    </li>
                                    <li class="flex items-center">
                                        <span class="mr-2">3.</span> 
                                        Điểm đến cuối cùng: ${tourDetail.toLocation}
                                    </li>
                                    <li class="flex items-center">
                                        <span class="mr-2">4.</span> 
                                        Liên hệ hướng dẫn viên: ${staffGuide.fullName}
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        SĐT: ${guidePhone}
                                    </li>
                                </ul>
                                
                                <h2 class="font-bold">
                                    Để đảm bảo tài sản và sự an toàn của Quý Khách, lái xe của công ty sẽ trả khách tại điểm mà xe đón khách lúc đầu.
                                </h2>
                            </div>
                            
                            <div class="mb-2">
                                <h1 class="font-bold"><span class="underline">ĐIỀU 4</span>: GIÁ TRỊ HỢP ĐỒNG</h1>
                                
                                <ul class="list-inside">
                                    <li class="flex items-center">
                                        Giá cho 01 khách người lớn: ${tourUnitPriceAdult}. 
                                    </li>
                                    ${parseInt(bookingTour.capacityKid) !== 0 ? `
                                    <li class="flex items-center">
                                        Giá cho 01 khách trẻ em: ${tourUnitPriceKid}. 
                                    </li>
                                    ` : ``}
                                    <li class="flex items-center">
                                        Tổng số khách theo hợp đồng: ${customerQuantityTotal} người.
                                    </li>
                                    <li class="flex items-center">
                                        Tổng giá trị hợp đồng: ${bookingTourTotal} (đã gồm 10% VAT)
                                    </li>
                                     <li class="flex items-center">
                                        (Bằng chữ: ${bookingTourTotalWord})
                                    </li>
                                </ul>
                                
                                <h2 class="font-bold">
                                    Bảo hiểm du lịch: Mức đền bù tối đa 20.000.000 VNĐ / người/ vụ.
                                </h2>
                            </div>
                            
                            <div class="mb-2">
                                <h1 class="font-bold"><span class="underline">ĐIỀU 5</span>: THANH TOÁN</h1>
                                
                                <ul class="list-inside">
                                    <li class="flex items-center">
                                        <span class="mr-2">1.</span> 
                                        Bên A đã thanh toán cho bên B số tiền là: ${bookingTourTotal}
                                    </li>
                                    <li class="flex items-center font-bold">
                                        (Bằng chữ: ${bookingTourTotalWord})
                                    </li>
                                    <li class="flex items-center">
                                        <span class="mr-2">2.</span> 
                                        Hình thức thanh toán:
                                        ${bookingTour.paymentMethod === 0 ? `Thanh toán tại quầy` : ``}
                                        ${bookingTour.paymentMethod === 1 ? `Thanh toán bằng ví VNPay` : ``}
                                        ${bookingTour.paymentMethod === 2 ? `Thanh toán bằng ví ZaLoPay` : ``}
                                        ${bookingTour.paymentMethod === 3 ? `Thanh toán tại ví Momo` : ``}
                                    </li>
                                    <li class="flex items-center">
                                        <span class="mr-2">3.</span> 
                                        Thời gian thanh toán: ${bookingTourDatePayment}
                                    </li>
                                </ul>
                            </div>
                            
                            <div class="mb-2">
                                <h1 class="font-bold"><span class="underline">ĐIỀU 6</span>: ĐIỀU KIỆN PHẠT HUỶ</h1>
                                <h2 class="font-bold">Điều kiện hủy tour:</h2>
                                
                                <ul class="list-inside">
                                    <li class="flex items-center">
                                        <span class="mr-2">•</span> 
                                        Hủy vé trong vòng 24 giờ hoặc ngay ngày đi, phải trả 100% giá trị đơn hàng.
                                    </li>
                                    <li class="flex items-center">
                                        <span class="mr-2">•</span> 
                                        Hủy vé trước ngày khởi hành từ 2 - 7 ngày, phải trả 80% giá trị đơn hàng.
                                    </li>
                                     <li class="flex items-center">
                                        <span class="mr-2">•</span> 
                                        Hủy vé trước ngày khởi hành từ 8 - 14 ngày, phải trả 50% giá trị đơn hàng.
                                    </li>
                                    <li class="flex items-center">
                                        <span class="mr-2">•</span> 
                                        Hủy vé trước ngày khởi hành từ 15 - 25 ngày, phải trả 30% giá trị đơn hàng.
                                    </li>
                                    <li class="flex items-center">
                                        <span class="mr-2">•</span> 
                                        Hủy vé trước ngày khởi hành từ 26 - 29 ngày, phải trả 5% giá trị đơn hàng.
                                    </li>
                                    <li class="flex items-center">
                                        <span class="mr-2">•</span> 
                                        Hủy vé trước ngày khởi hành từ 30 ngày trở lên, phải trả 1% giá trị đơn hàng.
                                    </li>
                                </ul>
                                
                                <h2 class="font-bold">Lưu ý:</h2>
                                
                                <ul class="list-inside">
                                    <li class="flex items-center">
                                        <span class="mr-2">•</span> 
                                        Sau khi hủy tour, du khách vui lòng kiểm tra mail để xác nhận trong vòng 15 ngày kể từ ngày kết thúc tour. Chúng tôi chỉ thanh toán trong khoảng thời gian nói trên.
                                    </li>
                                    <li class="flex items-center">
                                        <span class="mr-2">•</span> 
                                        Lệ phí hủy tour sẽ thay đổi tùy thuộc vào từng tour tuyến quý khách đăng ký.
                                    </li>
                                    <li class="flex items-center">
                                        <span class="mr-2">•</span> 
                                        Thời gian hủy tour được tính cho ngày làm việc, không tính ngày Thứ Bảy, Chủ Nhật và các ngày nghỉ Lễ.
                                    </li>
                                    <li class="flex items-center">
                                        <span class="mr-2">•</span> 
                                        Các tour trong ngày lễ, tết sẽ áp dụng điều kiện hủy riêng.
                                    </li>
                                    <li class="flex items-center">
                                        <span class="mr-2">•</span> 
                                        Trong trường hợp vì một lý do bất khả kháng nào đó (bão lụt, hoả hoạn, thiên tai, chiến tranh…) hợp đồng không thể thực hiện thì các bên cùng nhau bàn bạc giải quyết trên tinh thần bình đẳng giữa hai bên.
                                    </li>
                                </ul>
                            </div>
                            
                            <div class="mb-3">
                                <h1 class="font-bold"><span class="underline">ĐIỀU 7</span>: THỰC HIỆN CỦA HAI BÊN</h1>
                                
                                <ul class="list-inside">
                                    <li class="flex items-center">
                                        <span class="mr-2">1.</span> 
                                        Bên A có trách nhiệm thông báo chi tiết và xác nhận về lượng khách kèm theo danh sách trích ngang, địa điểm, thời gian, và thông tin liên quan của đoàn khách trước 03 ngày khởi hành cho bên B. Bên B có trách nhiệm đưa đón, phục vụ đoàn khách của bên A đúng như trong lộ trình chi tiết của phụ lục kèm theo hợp đồng, bảo đảo chất lượng dịch vụ theo hợp đồng.
                                    </li>
                                    <li class="flex items-center">
                                        <span class="mr-2">2.</span> 
                                        Bên A thanh toán đầy đủ, đúng hạn cho bên B tổng giá trị hợp đồng theo phương thức đã nêu trên. Nếu phát sinh chi phí cho việc làm hay yêu cầu của bên A thì bên A phải thanh toán thêm khoản chi phí đó cho bên B.
                                    </li>
                                    <li class="flex items-center">
                                        <span class="mr-2">3.</span> 
                                        Trong quá trình thực hiên hợp đồng, mọi phát sinh tranh chấp đều được hai bên cùng nhau bàn bạc và giải quyết trên tinh thần bình đẳng hai bên đều có lợi.
                                    </li>
                                    <li class="flex items-center">
                                        <span class="mr-2">4.</span> 
                                        Những phụ lục hợp đồng kèm theo có giá trị pháp lý như bản hợp đồng này.
                                    </li>
                                    <li class="flex items-center">
                                        <span class="mr-2">5.</span> 
                                        Hai bên cam kết thực hiện đúng những điều khoản như trong hợp đồng, bên nào thực hiện sai gây tổn hại về thời gian, vật chất cho bên kia thì phải chịu trách nhiệm bồi hoàn phần tổn hại đó cho bên kia theo quy định trước pháp luật.
                                    </li>
                                    <li class="flex items-center">
                                        <span class="mr-2">6.</span> 
                                        Hợp đồng này gồm có 03 trang và được lập 02 bản, mỗi bên giữ 01 bản có giá trị pháp lý như nhau và có hiệu lực kể từ ngày ký.
                                    </li>
                                </ul>
                            </div>
                            
                            <div class="mb-2">
                                <h1 class="font-bold mb-1">DANH SÁCH KHÁCH HÀNG ĐI TOUR</h1>
                                <i>Lưu ý: quý khách vui lòng điền đúng và đủ các thông tin bên dưới.</i>
                                
                                <div class="overflow-x-auto">
                                    <table class="table-auto border-collapse border border-gray-300 w-full">
                                    <thead>
                                        <tr>
                                            <th class="px-4 py-2 border border-gray-300">STT</th>
                                            <th class="px-4 py-2 border border-gray-300">Họ và tên</th>
                                            <th class="px-4 py-2 border border-gray-300">Năm sinh</th>
                                            <th class="px-4 py-2 border border-gray-300">Số điện thoại</th>
                                            <th class="px-4 py-2 border border-gray-300">Ký tên</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${bookingTourCustomer.map((item, index) => `
                                            <tr>
                                                <td class="px-4 py-2 border border-gray-300">${index + 1}</td>
                                                <td class="px-4 py-2 border border-gray-300">${item.customerName}</td>
                                                <td class="px-4 py-2 border border-gray-300">${$filter('formatDate')(item.customerBirth)}</td>
                                                <td class="px-4 py-2 border border-gray-300">${item.customerPhone}</td>
                                                <td class="px-4 py-2 border border-gray-300">&nbsp;</td>
                                            </tr>
                                        `).join('')}
                                        ${combinedTableRows}
                                    </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </p>
                </div>
            </div>
            
            <table class="custom-table mt-10">
                <tr>
                    <td style="font-size:small; font-weight: bolder;text-align: center; width:45%">
                        ĐẠI DIỆN BÊN A
                    </td>
                    <td style="font-size:small; font-weight: bolder;text-align: center;width:10%"></td>
                    <td style="font-size:small; font-weight: bolder;text-align: center;width:45%">
                        ĐẠI DIÊN BÊN B
                    </td>
                </tr>
                <tr>
                    <td style="font-size:small;text-align: center; width:45%"></td>
                        <td style="font-size:small;text-align: center;width:10%"></td>
                        <td style="font-size:small;text-align: center;width:45%">
                        <div class="text-center d-flex">
                            <img src="https://i.imgur.com/V3ceaiz.png" width="40%" alt="stamp" class="stamp m-auto"><br>
                        </div>
                    </td>
                </tr>
                    <tr style="text-align: center;">
                    <td style="font-size:small;text-align: center; width:45%">${bookingTour.customerName}</td>
                    <td style="font-size:small;text-align: center;width:10%"></td>
                    <td style="font-size:small;text-align: center;width:45%">Công ty TNHH TravelTour</td>
                </tr>
            </table>
            
            <script src="https://cdn.tailwindcss.com"></script>
            </body>
            </html>
        `);

        printWindow.document.close();
        printWindow.onload = function () {
            setTimeout(function () {
                printWindow.print();
                printWindow.close();
            }, 500);
        };

        printWindow.document.title = 'HopDongKinhDoanhDichVu_' + $filter('vietnameseDateTime')(Date.now()) + '.pdf';
    }
}]);