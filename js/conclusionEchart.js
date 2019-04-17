// jquery 使用echart 构建 conclusion 热力图
$(document.getElementById("conclusion-echart")).ready(function () {
    console.log("conclusion-echart contruct")

    let conclusionChart = echarts.init(document.getElementById('conclusion-echart'))

    // 加载 序列化后的结果文件
    //D3 (目测异步)的加载csv
    d3.text('../data/result_top100_heatmap_normalize.csv', function (data) {
        let csvData = d3.csv.parseRows(data)

        // 坐标轴
        // let xArray = Array.from({
        //     length: 15
        // }, (_, index) => (index + 1)).concat(
        //     Array.from({
        //         length: 10
        //     }, (_, index) => (91 + index))
        // )
        //电影1-25
        let xArray = Array.from({
            length: 25
        },(_,index) => (index)+1)


        // 分层抽样1，6，11...
        
        //let xArray = Array.from({
        //  length: 20
        //}, (_, index) => (index * 5) + 1)



        // 格式:movie_id,movie_title,score,actor_experience,director_ability,director_experience,company,genre,budget,runtime,month
        let yArray = csvData.shift().slice(2).reverse()
        // yLength 应该为9（行数）
        let yLength = yArray.length

        // 数据 9行*N列
        heatmapData = []
        movieIdData = []
        movieTitleData = []
        for (let x of xArray) {
            // line 内容是从y轴上到下, 共9个元素
            let line = csvData[x-1]
            movieIdData.push(line[0])
            movieTitleData.push(line[1])
            for (let y = 0; y < yLength; y++) {
                // x轴坐标, y轴坐标, 数值
                heatmapData.push([xArray.indexOf(x), y, line[yLength + 1 - y]])
            }
        }

        let option = getHeatmapOption(xArray, yArray, heatmapData, movieTitleData)
        conclusionChart.setOption(option);
    })
    // 配置热力图option
    function getHeatmapOption(xArray, yArray, heatmapData, movieTitleData) {
        let option = {
            tooltip: {
                position: 'top',
                formatter: function (obj) {
                    // 显示 电影名 + value
                    let cardValue = obj.value
                    let cardName = movieTitleData[cardValue[0]]
                    return "<div style='font-size: 18px;margin: 7px'>" + cardName + "</div>" +
                        "<span style='display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:rgba(246,239,166,1);'></span>" +
                        "<p style='display:inline-block'>" + cardValue[2] + "</p>"
                }
            },
            animation: false,
            grid: {
                height: '65%',
                left: 120,
                y: '15%'
            },
            xAxis: {
                type: 'category',
                data: xArray,
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
                data: yArray,
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
                //inRange: {
                //     color: ['blue', 'rgba(3,4,5,0.4)', 'red'],
                //     // symbolSize: [50, 100]
                // }
            },
            series: [{
                // name: 'Punch Card',
                type: 'heatmap',
                data: heatmapData,
                label: {
                    normal: {
                        show: true
                    }
                },
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }]
        };

        return option;
    }
});