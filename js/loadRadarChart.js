// jquery
$(document).ready(function () {

    //D3 (目测异步)的加载csv
    d3.text('../data/6D.csv', function (data) {
        let csvData = d3.csv.parseRows(data)
        // shift 方法可移除数组中的第一个元素并返回该元素。
        let header = csvData.shift()
        // 解析并生成6纬图数据
        let values = []

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
            // var checkbox = "<div class='radar-checkbox' name='a'>" +
            //     "<input type='checkbox' id='" + element[0] +
            //     "'>" + element[0] + "</input></div>";
            var checkbox = "<label class='radar-checkbox'><input type='checkbox' name='a' id='" + element[0] +
                "'>" + element[0] + "</input></label>";

            $("#radar-btns").append(checkbox);
        });

        // 画画
        drawRadarChart(values)

        $("input[name='a']").click(function () { //checkbox的input标签点击事件
            console.log(this.id);
            $("input[name='a']").attr('disabled', true); //设置name为'a' 的input标签的属性为true,表示不可选
            if ($("input[name='a']:checked").length >= 3) { //选中个数大于3
                $("input[name='a']:checked").attr('disabled', false);
            } else {
                $("input[name='a']").attr('disabled', false);
            }
        });
    })

    // 加载6维图数据, 用的是d3 v3 版本, 使用其他版本注意解决冲突
    function drawRadarChart(values) {
        console.log("6维图加载条数:" + values.length);

        // 导演名
        let name = values.map(x => x.name);
        // 6维图数据
        let data = values.map(x => x.value);

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
        let color = d3.scale.ordinal().range(["#EDC951", "#CC333F", "#00A0B0"]);

        let radarChartOptions = {
            w: width,
            h: height,
            margin: margin,
            maxValue: 1,
            levels: 5,
            roundStrokes: true, //true: 曲线; false:直线
            color: color
        };
        //Call function to draw the Radar chart
        RadarChart(".radarChart", name, data, radarChartOptions);
    }

})