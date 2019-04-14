// jquery   使用echart 构建company 柱状图
$(document.getElementById("company-echart")).ready(function () {
    console.log("company-echart contruct")

    let companyChart = echarts.init(document.getElementById('company-echart'))
    let option = getBarOption()
    companyChart.setOption(option);
    
})

// 配置柱状体option
function getBarOption() {

    let option = {
        dataset: {
            source: [
                ['score', 'Revenue_m', 'company'],
                [100, 1376.6269897, 'Walt Disney Pictures'],
                [49, 683.9013140, 'Universal Pictures'],
                [47, 651.8895667, 'Paramount Pictures'],
                [42, 585.2068099, 'WingNut Films'],
                [34, 469.4113111, 'Marvel Studios'],
                [26, 360.0595784, 'Lucasfilm'],
                [20, 278.7965087, 'Ingenious Film Partners'],
                [19, 264.2968586 , '1492 Pictures'],
                [18, 258.8564640, 'Warner Bros'],
                [18, 253.0468007, '21th Century Fox Film Corporation'],
                [14, 204.8988651, 'Pixar Animation Studios'],
                [13, 191.0471863, 'Legendary Pictures'],
                [12, 173.3775786, 'Columbia Pictures'],
                [10, 153.3929251, 'DreamWorks SKG'],
                [10, 151.3528810, 'Universal Studios'],
                [10, 147.4985498, 'Village Roadshow Pictures'],
                [8, 115.3304495, 'Studio Babelsberg'],
                [7, 110.4001807, 'DreamWorks Animation'],
                [7, 100.4558444, 'DC Comics'],
                [6, 89.5921036, 'Patalex IV Productions Limited'],
                [5, 84.7423452, 'Lionsgate'],
                [4, 71.0644566, 'Ingenious Media'],
                [4, 67.2806292, 'Spyglass Entertainment'],
                [4, 59.9045960, 'Eon Productions'],
                [3, 52.0000000, 'Lightstorm Entertainment'],
                [3, 50.9635550, 'Studio Ghibli'],
                [2, 42.4208848, 'Tig Productions'],
                [2, 40.0176459, 'Selznick International Pictures'],
                [2, 37.3304070, 'Miramax Films'],
                [2, 32.7311859, 'New Line Cinema'],
                [2, 31.2941469, 'Castle Rock Entertainment'],
                
                [1, 28.9847354, 'Vertigo Entertainment'],
                [1, 27.2742922, 'Orion Pictures'],
                [1, 23.5860116, 'Touchstone Pictures'],
                [1, 23.3555708, 'Black Bear Pictures']
                
            ]
        },

        grid: {containLabel: true},
        xAxis: {name: 'Revenue_m'},
        yAxis: {type: 'category'},
        //yAxis: {name: 'category'},
        visualMap: {
            orient: 'horizontal',
            left: 'center',
            min: 0,
            max: 50,
            text: ['Highest Revenue(million)', 'Lowest Revenue(million)'],
            // Map the score column to color
            textStyle: {
                color: 'white'          // 图例文字颜色
           },
            dimension: 0,
            inRange: {
                //color: ['#1976D2','#B71C1C']
                color:['#0066FF','#CC0000'],
            }
        },

        textStyle: {
            color: 'white'          // 图例文字颜色
        },
        series: [
            {
                type: 'bar',
                encode: {
                    // Map the "amount" column to X axis.
                    x: 'Revenue_m',
                    // Map the "product" column to Y axis
                    y: 'company'
                }
            }
        ]

        
    };
    return option
}