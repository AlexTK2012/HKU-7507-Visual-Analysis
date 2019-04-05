// jquery
$(document).ready(function () {
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
    let colors = ["#EDC951", "#CC333F", "#00A0B0"]

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

    //D3 (目测异步)的加载csv
    d3.text('../data/6D.csv', function (data) {
        let csvData = d3.csv.parseRows(data)
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
            $("input[name='a']").attr('disabled', true);

            if ($("input[name='a']:checked").length >= 3) {
                //选中个数大于3, 只有已被选中的可以点击
                $("input[name='a']:checked").attr('disabled', false);
            } else {
                //所有checkbox都点击
                $("input[name='a']").attr('disabled', false);
            }

            // 点击触发选上
            if (this.checked) {
                // console.log("添加" + this.id)
                let data = values.filter(x => x.name == this.id)[0]
                data.color = colors.shift()

                displayValues.push(data);

                RadarChart(".radarChart", displayValues.map(x => x.color), displayValues.map(x => x.name), displayValues.map(x => x.value), radarChartOptions);

            } else {
                // console.log("删除" + this.id)
                let data = values.filter(x => x.name == this.id)[0]
                colors.push(data.color)
                
                // let index = displayValues.indexOf(data)
                // displayValues.splice(index, 1)

                displayValues = displayValues.filter(x => x.name != this.id)
                RadarChart(".radarChart", displayValues.map(x => x.color), displayValues.map(x => x.name), displayValues.map(x => x.value), radarChartOptions);
            }
        });
    })

})