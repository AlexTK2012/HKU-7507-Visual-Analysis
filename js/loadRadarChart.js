// d3.js 使用radarChart.js 绘画雷达图
$(document.getElementById("radar-chart")).ready(function () {
    console.log("radar-chart contruct")
    // 这边强烈个人适配了，建议阅读源码，Git 地址在ReadMe中
    /******** radarChart 基本参数设置 */
    // 设置图表显示大小
    let margin = {
        top: 100,
        right: 100,
        bottom: 100,
        left: 100
    };
    let width = 400;
    let height = 400;

    // 定义颜色
    // let color = d3.scale.ordinal().range(["#EDC951", "#CC333F", "#00A0B0"]);
    let colors = ["#B71C1C", "#AD1457", "#8E24AA", "#F4D03F", "#3F51B5", "#F1948A", "#0097A7", "#388E3C", "#FFEE58", "#EEEEEE"]

    let radarChartOptions = {
        w: width,
        h: height,
        margin: margin,
        maxValue: 1, //最大值1, js代码里有校验, 以 Max(maxValue, data中的最大值) 作为实际MaxValue
        levels: 5, // 5层同心圆
        roundStrokes: true, //true: 曲线; false:直线
        axisAll: ["Works_quantity", "genre", "Sum_revenue", "Mean_vote", "Highest_vote"]
    };

    /************ over */

    let csvData = initRadarData()

    //D3 异步的加载csv
    // d3.text('../data/6D.csv', function (data) {
    //     let csvData = d3.csv.parseRows(data)
    
    // shift 方法可移除数组中的第一个元素并返回该元素。
    let header = csvData.shift()
    // 解析并生成6纬图数据
    let values = []
    // 展示的 values
    let displayValues = []

    // slice 方法返回一个 Array 对象，其中包含了 arrayObj 的指定部分。
    // 参数：start，截取数组开始下标。end截止的下标，但不包括end元素
    // csvData.slice(1).forEach()

    csvData.forEach(element => {
        let directorValue = []
        for (let i = 1; i < header.length; i++) {
            directorValue.push({
                axis: header[i],
                value: element[i]
            });
        }

        // 添加导演 到values数组里
        values.push({
            name: element[0],
            value: directorValue
        });

        // 添加checkbox 复选框
        // let checkbox = "<div class='radar-checkbox' name='a'>" +
        //     "<input type='checkbox' id='" + element[0] +
        //     "'>" + element[0] + "</input></div>";
        let checkbox = "<label class='radar-checkbox'><input type='checkbox' name='a' id='" + element[0] +
            "'>" + element[0] + "</input></label>";

        $("#radar-btns").append(checkbox);
    });

    // 初始化雷达图
    // 加载6维图数据, 用的是d3 v3 版本, 使用其他版本注意解决冲突
    RadarChart(".radarChart", displayValues.map(x => x.color), displayValues.map(x => x.name), displayValues.map(x => x.value), radarChartOptions);
    // RadarChart(".radarChart", [], [], radarChartOptions);

    //checkbox的input标签点击事件,不可选的checkbox不会触发此点击事件
    $("input[name='a']").click(function () {
        //设置name为'a' 的input标签的属性为true,表示不可选
        $("input[name='a']").prop('disabled', true);

        if ($("input[name='a']:checked").length >= 10) {
            //选中个数大于10, 只有已被选中的可以点击
            $("input[name='a']:checked").prop('disabled', false);
        } else {
            //所有checkbox都点击
            $("input[name='a']").prop('disabled', false);
        }

        // 点击触发选上
        if (this.checked) {
            // console.log("添加" + this.id)
            let data = values.filter(x => x.name == this.id)[0]
            data.color = colors.shift()
            displayValues.push(data);
        } else {
            // console.log("删除" + this.id)
            let data = values.filter(x => x.name == this.id)[0]
            colors.push(data.color)

            // let index = displayValues.indexOf(data)
            // displayValues.splice(index, 1)
            displayValues = displayValues.filter(x => x.name != this.id)
        }
        RadarChart(".radarChart", displayValues.map(x => x.color), displayValues.map(x => x.name), displayValues.map(x => x.value), radarChartOptions);
    });

    // 全选按钮
    $("input[name='all']").click(function () {
        if (this.checked) {
            //jquery 不包括:unchecked 选择器，需要反转 :checked 选择器
            $("input[name='a']:not(:checked)").map(function () {
                let data = values.filter(x => x.name == this.id)[0]
                data.color = colors.shift()
                displayValues.push(data)
            })
            $("input[name='a']").prop('checked', true)
        } else {
            displayValues.forEach(data => {
                colors.push(data.color)
            })
            displayValues = []
            $("input[name='a']").prop('checked', false)
        }
        RadarChart(".radarChart", displayValues.map(x => x.color), displayValues.map(x => x.name), displayValues.map(x => x.value), radarChartOptions);
    });
    // })

})

function initRadarData(){
    let data = [["Director","Works_quantity","genre","Sum_revenue","Mean_vote","Highest_vote"],["Steven Spielberg","1","1","1","0.47","0.9"],["Martin Scorsese","0.73","0.58","0.19","0.61","0.86"],["Robert Zemeckis","0.46","0.83","0.38","0.44","0.86"],["Christopher Nolan","0.27","0.5","0.45","0.83","0.86"],["Clint Eastwood","0.73","0.83","0.25","0.42","0.67"],["Quentin Tarantino","0.27","0.67","0.14","0.82","0.9"],["Ridley Scott","0.58","0.75","0.33","0.35","0.71"],["Peter Jackson","0.31","0.17","0.7","0.62","0.81"],["James Cameron","0.23","0.5","0.63","0.62","0.62"],["David Fincher","0.35","0.5","0.21","0.63","0.9"]]
    return data
}