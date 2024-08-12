travel_app.controller('RevenueControllerAD', function ($scope,$filter, RevenueServiceAD) {
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
            const [revenueData, percentageData] = await Promise.all([
                fetchRevenueData($scope.yearForTheChartColumn),
                fetchPercentageData($scope.yearForPieChart)
            ]);

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

    const projectionVsActualChartInit = async (currentYearData, previousYearData) => {
        const {getColor, getData} = window.phoenix.utils;
        const $projectionVsActualChartEl = document.querySelector('.echart-projection-actual');

        if ($projectionVsActualChartEl) {
            const userOptions = getData($projectionVsActualChartEl, 'echarts');
            const chart = window.echarts.init($projectionVsActualChartEl);

            const getDefaultOptions = () => ({
                color: [getColor('primary'), getColor('gray-300')],
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
                },
                xAxis: {
                    type: 'category',
                    axisLabel: {
                        color: getColor('gray-800'),
                        fontFamily: 'Nunito Sans',
                        fontWeight: 600,
                        fontSize: 12.8
                    },
                    data: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
                    axisLine: {
                        lineStyle: {
                            color: getColor('gray-300')
                        }
                    },
                    axisTick: false
                },
                yAxis: {
                    axisPointer: {type: 'none'},
                    axisTick: 'none',
                    splitLine: {
                        interval: 5,
                        lineStyle: {
                            color: getColor('gray-200')
                        }
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
                            return formatNumberWithK(value);
                        },
                    }
                },
                series: [
                    {
                        name: `${$scope.year - 1}`,
                        type: 'bar',
                        barWidth: '6px',
                        data: previousYearData,
                        barGap: '30%',
                        label: {show: false},
                        itemStyle: {
                            borderRadius: [2, 2, 0, 0],
                            color: getColor('info-200')
                        }
                    },
                    {
                        name: `${$scope.year}`,
                        type: 'bar',
                        data: currentYearData,
                        barWidth: '6px',
                        barGap: '30%',
                        label: {show: false},
                        z: 10,
                        itemStyle: {
                            borderRadius: [2, 2, 0, 0],
                            color: getColor('primary')
                        }
                    }
                ],
                grid: {
                    right: 0,
                    left: 3,
                    bottom: 0,
                    top: '15%',
                    containLabel: true
                },
                animation: false
            });

            echartSetOption(chart, userOptions, getDefaultOptions);
        }
    };

    const pieChartInit = (hotelPercentage, visitLocationPercentage, transportBrandPercentage) => {
        const {getColor, getData, rgbaColor} = window.phoenix.utils;
        const $chartEl = document.querySelector('.echart-pie-chart-example');

        if ($chartEl) {
            const userOptions = getData($chartEl, 'echarts');
            const chart = window.echarts.init($chartEl);
            const getDefaultOptions = () => ({
                legend: {
                    left: 12,
                    textStyle: {
                        color: getColor('gray-600')
                    }
                },
                series: [
                    {
                        type: 'pie',
                        radius: window.innerWidth < 530 ? '45%' : '60%',
                        label: {
                            color: getColor('gray-700'),
                            formatter: '{b}: {c}%'
                        },
                        center: ['50%', '55%'],
                        data: [
                            {
                                value: hotelPercentage,
                                name: 'Khách sạn',
                                itemStyle: {
                                    color: getColor('danger')
                                }
                            },
                            {
                                value: transportBrandPercentage,
                                name: 'Phương tiện',
                                itemStyle: {
                                    color: getColor('info')
                                }
                            },
                            {
                                value: visitLocationPercentage,
                                name: 'Tham quan',
                                itemStyle: {
                                    color: getColor('success')
                                }
                            },
                        ],
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 20,
                                shadowOffsetX: 0,
                                shadowColor: rgbaColor(getColor('gray-600'), 0.5)
                            }
                        },
                    }
                ],
                tooltip: {
                    trigger: 'item',
                    padding: [10, 15],
                    backgroundColor: '#f8f9fa',
                    borderColor: '#ced4da',
                    borderWidth: 1,
                    textStyle: {
                        color: '#343a40',
                        fontSize: 14,
                        fontWeight: 'bold'
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
                    series: [
                        {
                            radius: '45%'
                        }
                    ]
                },
                sm: {
                    series: [
                        {
                            radius: '60%'
                        }
                    ]
                }
            };

            echartSetOption(chart, userOptions, getDefaultOptions, responsiveOptions);
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
});
