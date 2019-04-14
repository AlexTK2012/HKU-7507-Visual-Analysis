// jquery 使用echart 构建 conclusion 热力图
$(document.getElementById("conclusion-echart")).ready(function () {
    console.log("conclusion-echart contruct")

    let conclusionChart = echarts.init(document.getElementById('conclusion-echart'))
    let option = getHeatmapOption()
    conclusionChart.setOption(option);


    // 配置热力图option
    function getHeatmapOption() {
        let hours = ['ab', 'bc', '2a', '3a', '4a', '5a', '6a',
            '7a', '8a', '9a', '10a', '11a',
            '12p', '1p', '2p', '3p', '4p', '5p',
            '6p', '7p', '8p', '9p', '10p', '11p'
        ];
        let days = ['Saturday', 'Friday', 'Thursday',
            'Wednesday', 'Tuesday', 'Monday', 'Sunday12'
        ];

        let data = [
            [0, 0, 1.2],
        ];

        // data1 = data.map(function (item) {
        //     return [item[1], item[0], item[2] || '-'];
        // });

        let option = {
            tooltip: {
                position: 'top'
            },
            animation: false,
            grid: {
                height: '65%',
                y: '15%'
            },
            xAxis: {
                type: 'category',
                data: hours,
                axisLine: {
                    lineStyle: {
                        color: '#fff',
                    },
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        // 使用深浅的间隔色
                        color: ['#aaa', '#ddd']
                    }
                }
            },
            yAxis: {
                type: 'category',
                data: days,
                axisLine: {
                    lineStyle: {
                        color: '#fff',
                    },
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        // 使用深浅的间隔色
                        color: ['#aaa', '#ddd']
                    }
                }
            },
            visualMap: {
                min: 0,
                max: 10,
                calculable: true,
                orient: 'horizontal',
                left: 'center',
                bottom: '5%',
                textStyle: {
                    color: '#fff'
                },
                // show: false,
                // inRange: {
                //     color: ['blue', 'rgba(3,4,5,0.4)', 'red'],
                //     // symbolSize: [50, 100]
                // }
            },
            series: [{
                name: 'Punch Card',
                type: 'heatmap',
                data: data,
                // label: {
                //     normal: {
                //         show: true
                //     }
                // },
                // itemStyle: {
                //     emphasis: {
                //         shadowBlur: 10,
                //         shadowColor: 'rgba(0, 0, 0, 0.5)'
                //     }
                // }
            }]
        };

        return option;
    }
});