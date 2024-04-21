travel_app.controller('StatisticalVisitControllerAG', function ($scope, RevenueServiceAD, $filter, $sce, $location, $routeParams, OrderVisitServiceAG, LocalStorageService) {
    $scope.yearForTheChartColumn = new Date().getFullYear();
    $scope.yearForPieChart = new Date().getFullYear();
    $scope.currentYearData = new Array(12).fill(0);
    $scope.previousYearData = new Array(12).fill(0);

    RevenueServiceAD.getAllYearColumn().then((repo) => {
        $scope.selectYearListColumn = repo.data.data;
    }).catch((err) => {
        console.error(err);
    })

    RevenueServiceAD.getAllYearPie().then((repo) => {
        $scope.selectYearListPie = repo.data.data;
    }).catch((err) => {
        console.error(err);
    })

    async function fetchRevenueData(year) {
        try {
            const response = await RevenueServiceAD.revenueOf12MonthsOfTheYearFromTourBooking(year);
            return response.data.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async function fetchPercentageData(year) {
        try {
            const response = await RevenueServiceAD.percentageOfEachTypeOfService(year);
            return response.data.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    const initCharts = async () => {
        try {
            const [revenueData, percentageData] = await Promise.all([fetchRevenueData($scope.yearForTheChartColumn), fetchPercentageData($scope.yearForPieChart)]);

            $scope.currentYearData = revenueData.currentYearRevenue;
            $scope.previousYearData = revenueData.previousYearIsRevenue;

            $scope.hotelPercentage = percentageData.hotelPercentage;
            $scope.visitLocationPercentage = percentageData.visitLocationPercentage;
            $scope.transportBrandPercentage = percentageData.transportBrandPercentage;

            if ($scope.currentYearData.length > 0 && $scope.previousYearData.length > 0) {
                projectionVsActualChartInit($scope.currentYearData, $scope.previousYearData);
            }

            if ($scope.hotelPercentage !== undefined && $scope.visitLocationPercentage !== undefined && $scope.transportBrandPercentage !== undefined) {
                pieChartInit($scope.hotelPercentage, $scope.visitLocationPercentage, $scope.transportBrandPercentage);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const updateColumnChart = async () => {
        try {
            const revenueData = await fetchRevenueData($scope.yearForTheChartColumn);
            $scope.currentYearData = revenueData.currentYearRevenue;
            $scope.previousYearData = revenueData.previousYearIsRevenue;

            if ($scope.currentYearData.length > 0 && $scope.previousYearData.length > 0) {
                projectionVsActualChartInit($scope.currentYearData, $scope.previousYearData);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const updatedPieChart = async () => {
        try {
            const percentageData = await fetchPercentageData($scope.yearForPieChart);
            $scope.hotelPercentage = percentageData.hotelPercentage;
            $scope.visitLocationPercentage = percentageData.visitLocationPercentage;
            $scope.transportBrandPercentage = percentageData.transportBrandPercentage;

            if ($scope.hotelPercentage !== undefined && $scope.visitLocationPercentage !== undefined && $scope.transportBrandPercentage !== undefined) {
                pieChartInit($scope.hotelPercentage, $scope.visitLocationPercentage, $scope.transportBrandPercentage);
            }
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

    function formatNumberWithK(value) {
        const thousands = value / 1000;
        const formatted = new Intl.NumberFormat('en-US', {
            maximumFractionDigits: 0
        }).format(thousands);
        return `${formatted} k`;
    }

    const tooltipFormatter = (params) => {
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


    // Hàm để khởi tạo biểu đồ
    function projectionVsActualChartInit() {
        const {getColor, getData} = window.phoenix.utils;
        const $projectionVsActualChartEl = document.querySelector('.echart-projection-actual');

        if ($projectionVsActualChartEl) {
            const chart = window.echarts.init($projectionVsActualChartEl);
            const userOptions = getData($projectionVsActualChartEl, 'echarts');

            // Dữ liệu ảo cho số lượng vé người lớn và trẻ em cho 12 tháng của năm hiện tại
            const currentYearAdultTickets = [100, 120, 150, 130, 110, 140, 160, 180, 170, 150, 140, 130]; // Vé người lớn cho 12 tháng của năm hiện tại
            const currentYearChildTickets = [80, 90, 100, 90, 80, 100, 110, 120, 130, 110, 100, 90]; // Vé trẻ em cho 12 tháng của năm hiện tại

            // Dữ liệu ảo cho số lượng vé người lớn và trẻ em cho 12 tháng của năm trước đó
             const previousYearAdultTickets = [90, 110, 130, 0, 100, 130, 150, 170, 160, 140, 130, 120]; // Vé người lớn cho 12 tháng của năm trước đó
             const previousYearChildTickets = [70, 80, 90, 0, 70, 90, 100, 110, 120, 100, 90, 80]; // Vé trẻ em cho 12 tháng của năm trước đó
            // const previousYearAdultTickets = new Array(12).fill(0);
            // const previousYearChildTickets = new Array(12).fill(0);

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
                    formatter: params => tooltipFormatter(params)
                },
                xAxis: {
                    type: 'category', axisLabel: {
                        color: getColor('gray-800'), fontFamily: 'Roboto, sans-serif', fontWeight: 600, fontSize: 12.8
                    }, data: months, axisLine: {
                        lineStyle: {color: getColor('gray-300')}
                    }, axisTick: false
                },
                yAxis: {
                    type: 'value', axisPointer: {type: 'none'}, axisTick: 'none', splitLine: {
                        interval: 5, lineStyle: {color: getColor('gray-200')}
                    }, axisLine: {show: false}, axisLabel: {
                        fontFamily: 'Nunito Sans',
                        fontWeight: 600,
                        fontSize: 13.8,
                        color: getColor('gray-800'),
                        margin: 20,
                        verticalAlign: 'bottom',
                        formatter: function (value) {
                            return value.toFixed(0); // Định dạng hiển thị số liệu
                        },
                    }
                },
                series: [{
                    name: `Năm ${$scope.yearForTheChartColumn} (Vé Người Lớn)`,
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
                    name: `Năm ${$scope.yearForTheChartColumn} (Vé Trẻ Em)`,
                    type: 'bar',
                    stack: 'currentYear',
                    barWidth: '20%',
                    data: currentYearChildTickets,
                    label: {show: false}, // Ẩn số liệu
                    itemStyle: {
                        color: getColor('info-200'), barBorderRadius: [100, 100, 0, 0]
                    }
                }, {
                    name: `Năm ${$scope.yearForTheChartColumn - 1} (Vé Người Lớn)`,
                    type: 'bar',
                    stack: 'previousYear',
                    barWidth: '20%',
                    data: previousYearAdultTickets,
                    label: {show: false}, // Ẩn số liệu
                    itemStyle: {
                        color: getColor('success'), barBorderRadius: [0, 0, 100, 100]
                    }
                }, {
                    name: `Năm ${$scope.yearForTheChartColumn - 1} (Vé Trẻ Em)`,
                    type: 'bar',
                    stack: 'previousYear',
                    barWidth: '20%',
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

    const pieChartInit = (hotelPercentage, visitLocationPercentage, transportBrandPercentage) => {
        const {getColor, getData, rgbaColor} = window.phoenix.utils;
        const $chartEl = document.querySelector('.echart-pie-chart-example');

        if ($chartEl) {
            const userOptions = getData($chartEl, 'echarts');
            const chart = window.echarts.init($chartEl);
            const getDefaultOptions = () => ({
                legend: {
                    left: 12, textStyle: {
                        color: getColor('gray-600')
                    }
                }, series: [{
                    type: 'pie', radius: window.innerWidth < 530 ? '45%' : '60%', label: {
                        color: getColor('gray-700'), formatter: '{b}: {c}%'
                    }, center: ['50%', '55%'], data: [{
                        value: hotelPercentage, name: 'Khách sạn', itemStyle: {
                            color: getColor('danger')
                        }
                    }, {
                        value: transportBrandPercentage, name: 'Phương tiện', itemStyle: {
                            color: getColor('info')
                        }
                    }, {
                        value: visitLocationPercentage, name: 'Tham quan', itemStyle: {
                            color: getColor('success')
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

    const stackedLineChartInit = () => {
        const {getColor, getData} = window.phoenix.utils;
        const $chartEl = document.querySelector('.echart-stacked-line-chart');
        const month = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];

        if ($chartEl) {
            const userOptions = getData($chartEl, 'echarts');
            const chart = window.echarts.init($chartEl);
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
                    formatter: params => tooltipFormatter(params)
                }, xAxis: {
                    type: 'category', data: month, boundaryGap: false, axisLine: {
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
                        show: true, color: getColor('gray-400'), margin: 15
                    }, axisTick: {show: false}, axisLine: {show: false}
                }, series: [{
                    name: 'Milk Tea',
                    type: 'line',
                    symbolSize: 10,
                    itemStyle: {
                        color: getColor('white'), borderColor: getColor('success'), borderWidth: 2
                    },
                    lineStyle: {
                        color: getColor('success')
                    },
                    symbol: 'circle',
                    stack: 'product',
                    data: [220, 182, 191, 234, 290, 330, 310, 182, 191, 234, 290, 330]
                },

                    {
                        name: 'Cheese Brownie',
                        type: 'line',
                        symbolSize: 10,
                        itemStyle: {
                            color: getColor('white'), borderColor: getColor('warning'), borderWidth: 2
                        },
                        lineStyle: {
                            color: getColor('warning')
                        },
                        symbol: 'circle',
                        stack: 'product',
                        data: [320, 332, 301, 334, 390, 330, 320, 332, 301, 334, 390, 330]
                    },], grid: {right: 10, left: 5, bottom: 5, top: 8, containLabel: true}
            });
            echartSetOption(chart, userOptions, getDefaultOptions);
        }
    };

    initCharts();

    $scope.$watch('yearForTheChartColumn', async (newValue, oldValue) => {
        if (newValue !== oldValue) {
            updateColumnChart();
        }
    });

    // Update charts when the selected year changes for the pie chart
    $scope.$watch('yearForPieChart', async (newValue, oldValue) => {
        if (newValue !== oldValue) {
            updatedPieChart();
        }
    });

    const {docReady: docReady} = window.phoenix.utils;
    docReady(projectionVsActualChartInit);
    docReady(pieChartInit);
    docReady(stackedLineChartInit);

});