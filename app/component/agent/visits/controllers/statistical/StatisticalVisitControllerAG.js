travel_app.controller('StatisticalVisitControllerAG', function ($scope, RevenueServiceAD, $filter, StatisticalVisitServiceAG, $location, $routeParams, OrderVisitServiceAG, LocalStorageService, StatisticalHotelServiceAG) {
    $scope.yearOfTheStackedColumnChart = new Date().getFullYear();
    $scope.yearOfLineBarChart = new Date().getFullYear();
    $scope.yearForPieChart = new Date().getFullYear();
    $scope.currentYearData = new Array(12).fill(0);
    $scope.previousYearData = new Array(12).fill(0);

    const visitId = LocalStorageService.get('brandId');

    StatisticalVisitServiceAG.getAllOrderVisitYear().then((repo) => {
        $scope.selectYearOrderVisitList = repo.data.data;
    }).catch((err) => {
        console.error(err);
    })

    async function fetchStatisticsClassifyingAdultAndChildTicketsData(year, visitId) {
        try {
            const response = await StatisticalVisitServiceAG.statisticsClassifyingAdultAndChildTickets(year, visitId);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async function fetchStatisticalBookingVisitLocationData(year, visitId) {
        try {
            const response = await StatisticalVisitServiceAG.statisticalBookingVisitLocation(year, visitId);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async function fetchRevenueOfTouristAttractionsData(year, visitId) {
        try {
            const response = await StatisticalVisitServiceAG.getRevenueOfTouristAttractions(year, visitId);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    const initCharts = async () => {
        try {
            const [statisticsClassifyingAdultAndChildTicketsData,
                statisticalBookingVisitLocationData,
                revenueOfTouristAttractionsData] = await Promise.all([
                fetchStatisticsClassifyingAdultAndChildTicketsData($scope.yearOfTheStackedColumnChart, visitId),
                fetchStatisticalBookingVisitLocationData($scope.yearForPieChart, visitId),
                fetchRevenueOfTouristAttractionsData($scope.yearOfLineBarChart, visitId)
            ]);

            projectionVsActualChartInit(statisticsClassifyingAdultAndChildTicketsData);
            stackedLineChartInit(revenueOfTouristAttractionsData);
            pieChartInit(statisticalBookingVisitLocationData);

        } catch (error) {
            console.error(error);
        }
    };

    const updateStackedColumnChart = async () => {
        try {
            const revenueData = await fetchStatisticsClassifyingAdultAndChildTicketsData($scope.yearOfTheStackedColumnChart, visitId);
            projectionVsActualChartInit(revenueData);
        } catch (error) {
            console.error(error);
        }
    };


    const updateLineBarChart = async () => {
        try {
            const revenueData = await fetchRevenueOfTouristAttractionsData($scope.yearOfLineBarChart, visitId);
            stackedLineChartInit(revenueData);
        } catch (error) {
            console.error(error);
        }
    }

    const updatedPieChart = async () => {
        try {
            const percentageData = await fetchStatisticalBookingVisitLocationData($scope.yearForPieChart, visitId);
            pieChartInit(percentageData);
        } catch (error) {
            console.error(error);
        }
    }

    const {merge: merge} = window._;
    const echartSetOption = (e, t, o, n) => {
        const {breakpoints: r, resize: a} = window.phoenix.utils, s = t => {
            Object.keys(t).forEach((o => {
                window.innerWidth > r[o] && e.setOption(t[o]);
            }));
        }, i = document.body;
        e.setOption(merge(o(), t));
        const c = document.querySelector(".navbar-vertical-toggle");
        c && c.addEventListener("navbar.vertical.toggle", (() => {
            e.resize(), n && s(n);
        })), a((() => {
            e.resize(), n && s(n);
        })), n && s(n), i.addEventListener("clickControl", (({detail: {control: n}}) => {
            "phoenixTheme" === n && e.setOption(window._.merge(o(), t));
        }));
    };

    function formatNumberWithMillion(value) {
        const millions = value / 1000000; // Chia cho 1 triệu
        const formatted = new Intl.NumberFormat('en-US', {
            maximumFractionDigits: 1 // Số lượng số thập phân tối đa là 1
        }).format(millions);
        return `${formatted} Tr`; // Thêm đơn vị Triệu
    }

    const tooltipFormatterColumnChart = (params) => {
        let tooltipContent = `<div>
        <p class='mb-2 text-600 fw-bold'>
            ${params[0].axisValue}
        </p>
        <div class="ms-1">`;

        params.forEach(el => {
            tooltipContent += `
            <h6 class="text-700 mb-2">
                <span class="fas fa-circle me-1 fs--2" style="color:${el.borderColor ? el.borderColor : el.color}"></span>
                ${el.seriesName} : ${typeof el.value === 'object' ? el.value[1] : el.value}
            </h6>`;
        });

        tooltipContent += `</div>
        </div>`;

        return tooltipContent;
    };

    const tooltipFormatterLineChart = (params) => {
        let tooltipItem = ``;
        params.forEach(el => {
            tooltipItem += `<div class='ms-1'>
       <h6 class="text-700"><span class="fas fa-circle me-1 fs--2" style="color:${
                el.borderColor ? el.borderColor : el.color
            }"></span>
          ${el.seriesName} : ${$filter('vnCurrency')(("object" == typeof el.value ? el.value[1] : el.value))}
        </h6>
      </div>`;
        });
        return `<div>
            <p class='mb-2 text-600'> Tháng
              ${parseInt(params[0].axisValue.replace("T", ""))}
            </p>
            ${tooltipItem}
          </div>`;
    };


    // Hàm để khởi tạo biểu đồ
    function projectionVsActualChartInit(response) {
        const {getColor, getData} = window.phoenix.utils;
        const $projectionVsActualChartEl = document.querySelector('.echart-projection-actual');

        if ($projectionVsActualChartEl) {
            const chart = window.echarts.init($projectionVsActualChartEl);
            const userOptions = getData($projectionVsActualChartEl, 'echarts');

            // Dữ liệu ảo cho số lượng vé người lớn và trẻ em cho 12 tháng của năm hiện tại
            const currentYearAdultTickets = response.data.currentYearAdultTickets; // Vé người lớn cho 12 tháng của năm hiện tại
            const currentYearChildTickets = response.data.currentYearChildTickets; // Vé trẻ em cho 12 tháng của năm hiện tại

            // Dữ liệu ảo cho số lượng vé người lớn và trẻ em cho 12 tháng của năm trước đó
            const previousYearAdultTickets = response.data.previousYearAdultTickets; // Vé người lớn cho 12 tháng của năm trước đó
            const previousYearChildTickets = response.data.previousYearChildTickets // Vé trẻ em cho 12 tháng của năm trước đó

            const months = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];

            const getDefaultOptions = () => ({
                color: [getColor('primary'), getColor('info-200'), getColor('success'), getColor('success-300')],
                tooltip: {
                    trigger: 'axis',
                    padding: [7, 10],
                    backgroundColor: getColor('gray-100'),
                    borderColor: getColor('gray-300'),
                    textStyle: {color: getColor('dark')},
                    borderWidth: 1,
                    transitionDuration: 0,
                    axisPointer: {type: 'none'},
                    formatter: params => tooltipFormatterColumnChart(params)
                },
                xAxis: {
                    type: 'category', axisLabel: {
                        color: getColor('gray-800'), fontFamily: 'Roboto, sans-serif', fontWeight: 600, fontSize: 12.8
                    }, data: months, axisLine: {
                        lineStyle: {color: getColor('gray-300')}
                    }, axisTick: false
                },
                yAxis: {
                    type: 'value',
                    axisPointer: {type: 'none'},
                    axisTick: 'none',
                    splitLine: {
                        interval: 5,
                        lineStyle: {color: getColor('gray-200')}
                    },
                    axisLine: {show: false},
                    axisLabel: {
                        fontFamily: 'Nunito Sans',
                        fontWeight: 600,
                        fontSize: 13.8,
                        color: getColor('gray-800'),
                        margin: 20,
                        verticalAlign: 'bottom',
                        formatter: function (value) {
                            return value.toLocaleString('en-US', {maximumFractionDigits: 0}); // Sử dụng toLocaleString để hiển thị số nguyên
                        }
                    },
                    min: 0, // Đảm bảo giá trị nhỏ nhất của trục y là 0
                    max: function (value) {
                        // Kiểm tra nếu giá trị lớn nhất của dữ liệu nhỏ hơn 5, thì đặt giá trị lớn nhất của trục y là 5
                        return Math.max(value.max, 5);
                    }
                },
                series: [{
                    name: `Năm ${$scope.yearOfTheStackedColumnChart} (Vé Người Lớn)`,
                    type: 'bar',
                    stack: 'currentYear',
                    barWidth: '20%',
                    barGap: '30%',
                    data: currentYearAdultTickets,
                    label: {show: false}, // Ẩn số liệu
                    itemStyle: {
                        color: getColor('primary'), barBorderRadius: [0, 0, 100, 100]
                    }
                }, {
                    name: `Năm ${$scope.yearOfTheStackedColumnChart} (Vé Trẻ Em)`,
                    type: 'bar',
                    stack: 'currentYear',
                    barWidth: '20%',
                    barGap: '30%',
                    data: currentYearChildTickets,
                    label: {show: false}, // Ẩn số liệu
                    itemStyle: {
                        color: getColor('info-200'), barBorderRadius: [100, 100, 0, 0]
                    }
                }, {
                    name: `Năm ${$scope.yearOfTheStackedColumnChart - 1} (Vé Người Lớn)`,
                    type: 'bar',
                    stack: 'previousYear',
                    barWidth: '20%',
                    barGap: '30%',
                    data: previousYearAdultTickets,
                    label: {show: false}, // Ẩn số liệu
                    itemStyle: {
                        color: getColor('success'), barBorderRadius: [0, 0, 100, 100]
                    }
                }, {
                    name: `Năm ${$scope.yearOfTheStackedColumnChart - 1} (Vé Trẻ Em)`,
                    type: 'bar',
                    stack: 'previousYear',
                    barWidth: '20%',
                    barGap: '30%',
                    data: previousYearChildTickets,
                    label: {show: false}, // Ẩn số liệu
                    itemStyle: {
                        color: getColor('success-300'), barBorderRadius: [100, 100, 0, 0]
                    }
                }
                ],
                animation: false
            });

            echartSetOption(chart, userOptions, getDefaultOptions);

            chart.on('legendselectchanged', function (params) {
                const selected = params.selected;
                const defaultOptions = getDefaultOptions();
                const series = defaultOptions.series;
                let index = -1;
                for (let i = 0; i < series.length; i++) {
                    const name = series[i].name;

                    if (!selected[name]) {
                        index = (i % 2 === 0) ? (i + 1) : (i - 1);
                        series[index].itemStyle.barBorderRadius = [100, 100, 100, 100];
                    } else if (i !== index) {
                        if (i % 2 === 0) {
                            series[i].itemStyle.barBorderRadius = [0, 0, 100, 100];
                        } else {
                            series[i].itemStyle.barBorderRadius = [100, 100, 0, 0];
                        }
                    }
                }
                chart.setOption(defaultOptions);
            });

            function hideLegendOnSmallScreen() {
                if (window.innerWidth <= 768) {
                    const defaultOptions = getDefaultOptions();
                    defaultOptions.legend = {
                        show: false
                    };
                    chart.setOption(defaultOptions);
                } else {
                    const defaultOptions = getDefaultOptions();
                    defaultOptions.legend = {
                        show: true,
                        top: 3,
                        textStyle: {
                            color: getColor('gray-800'), fontFamily: 'Roboto, sans-serif', fontWeight: 600, fontSize: 13
                        },
                    };
                    chart.setOption(defaultOptions);
                }
            }

            hideLegendOnSmallScreen();

            window.addEventListener('resize', function () {
                hideLegendOnSmallScreen();
            });

        }
    }

    const pieChartInit = (response) => {
        const {getColor, getData, rgbaColor} = window.phoenix.utils;
        const $chartEl = document.querySelector('.echart-pie-chart-example');

        if ($chartEl) {
            const userOptions = getData($chartEl, 'echarts');
            const chart = window.echarts.init($chartEl);

            const pendingPayment = response.data[0]
            const completePayment = response.data[1]
            const cancelTransaction = response.data[2]

            const getDefaultOptions = () => ({
                legend: {
                    left: 12, textStyle: {
                        color: getColor('gray-600')
                    }
                }, series: [{
                    type: 'pie', radius: window.innerWidth < 530 ? '45%' : '60%', label: {
                        color: getColor('gray-700'), formatter: '{b}: {c}%'
                    }, center: ['50%', '55%'], data: [{
                        value: pendingPayment, name: 'Chờ thanh toán', itemStyle: {
                            color: getColor('warning')
                        }
                    }, {
                        value: completePayment, name: 'Đã thanh toán', itemStyle: {
                            color: getColor('success')
                        }
                    }, {
                        value: cancelTransaction, name: 'Hủy giao dịch', itemStyle: {
                            color: getColor('danger')
                        }
                    },], emphasis: {
                        itemStyle: {
                            shadowBlur: 20, shadowOffsetX: 0, shadowColor: rgbaColor(getColor('gray-600'), 0.5)
                        }
                    },
                }], tooltip: {
                    trigger: 'item',
                    padding: [10, 15],
                    backgroundColor: '#f8f9fa',
                    borderColor: '#ced4da',
                    borderWidth: 1,
                    textStyle: {
                        color: '#343a40', fontSize: 14, fontWeight: 'bold'
                    },
                    transitionDuration: 0.5,
                    axisPointer: {
                        type: 'shadow'
                    },
                    formatter: function (params) {
                        return `<div style="display:flex; align-items:center;">
                                    <div style="width:15px; height:15px; border-radius:50%; background-color:${params.color}; margin-right:8px;"></div>
                                    <div>${params.name}: ${params.value}%</div>
                                </div>`;
                    }
                }

            });

            const responsiveOptions = {
                xs: {
                    series: [{
                        radius: '45%'
                    }]
                }, sm: {
                    series: [{
                        radius: '60%'
                    }]
                }
            };

            echartSetOption(chart, userOptions, getDefaultOptions, responsiveOptions);
        }
    };

    const stackedLineChartInit = (response) => {
        const {getColor, getData} = window.phoenix.utils;
        const $chartEl = document.querySelector('.echart-stacked-line-chart');

        if ($chartEl) {
            const userOptions = getData($chartEl, 'echarts');
            const chart = window.echarts.init($chartEl);

            const currentYear = response.data.currentYear; // Vé người lớn cho 12 tháng của năm hiện tại
            const previousYear = response.data.previousYear; // Vé trẻ em cho 12 tháng của năm hiện tại
            const month = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];

            const getDefaultOptions = () => ({
                tooltip: {
                    trigger: 'axis',
                    padding: [7, 10],
                    backgroundColor: getColor('gray-100'),
                    borderColor: getColor('gray-300'),
                    textStyle: {color: getColor('dark')},
                    borderWidth: 1,
                    transitionDuration: 0,
                    axisPointer: {
                        type: 'none'
                    },
                    formatter: params => tooltipFormatterLineChart(params)
                }, xAxis: {
                    type: 'category',
                    data: month,
                    boundaryGap: false, axisLine: {
                        lineStyle: {
                            color: getColor('gray-300'), type: 'solid'
                        }
                    }, axisTick: {show: false}, axisLabel: {
                        color: getColor('gray-400'), margin: 15, formatter: value => value.substring(0, 3)
                    }, splitLine: {
                        show: false
                    }
                }, yAxis: {
                    type: 'value', splitLine: {
                        lineStyle: {
                            color: getColor('gray-200'), type: 'dashed'
                        }
                    }, boundaryGap: false, axisLabel: {
                        show: true, color: getColor('gray-400'), margin: 15,
                        formatter: function (value) {
                            return formatNumberWithMillion(value);
                        },
                    }, axisTick: {show: false}, axisLine: {show: false}
                }, series: [
                    {
                        name: `Doanh thu năm ${$scope.yearOfLineBarChart}`,
                        type: 'line',
                        smooth: 0.4,
                        symbolSize: 10,
                        itemStyle: {
                            color: getColor('white'),
                            borderColor: getColor('success'),
                            borderWidth: 2
                        },
                        lineStyle: {
                            color: getColor('success')
                        },
                        symbol: 'circle',
                        data: currentYear
                    },
                    {
                        name: `Doanh thu năm ${$scope.yearOfLineBarChart - 1}`,
                        type: 'line',
                        smooth: 0.4,
                        symbolSize: 10,
                        itemStyle: {
                            color: getColor('white'),
                            borderColor: getColor('warning'),
                            borderWidth: 2
                        },
                        lineStyle: {
                            color: getColor('warning')
                        },
                        symbol: 'circle',
                        data: previousYear
                    },
                ], grid: {right: 10, left: 5, bottom: 5, top: 8, containLabel: true}
            });
            echartSetOption(chart, userOptions, getDefaultOptions);
        }
    };

    $scope.$watch('yearOfTheStackedColumnChart', async (newValue, oldValue) => {
        if (newValue !== oldValue) {
            updateStackedColumnChart();
        }
    });

    $scope.$watch('yearOfLineBarChart', async (newValue, oldValue) => {
        if (newValue !== oldValue) {
            updateLineBarChart();
        }
    });

    $scope.$watch('yearForPieChart', async (newValue, oldValue) => {
        if (newValue !== oldValue) {
            updatedPieChart();
        }
    });

    const {docReady: docReady} = window.phoenix.utils;
    docReady(() => {
        initCharts();
    });

});