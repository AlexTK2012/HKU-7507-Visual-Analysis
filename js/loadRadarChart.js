// jquery
$(document).ready(function () {

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

    // 定义颜色和颜色计数器
    let color = d3.scale.ordinal().range(["#EDC951", "#CC333F", "#00A0B0"]);
    let colorIndex = 0;
    
    let radarChartOptions = {
        w: width,
        h: height,
        margin: margin,
        maxValue: 1, //最大值1, js代码里有校验, 以 Max(maxValue, data中的最大值) 作为实际MaxValue
        levels: 5, // 5层同心圆
        roundStrokes: true, //true: 曲线; false:直线
        color: color,
        opacityArea: 0.35,
        strokeWidth: 2,
        dotRadius: 4
    };
    /************ over */

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
            // let checkbox = "<div class='radar-checkbox' name='a'>" +
            //     "<input type='checkbox' id='" + element[0] +
            //     "'>" + element[0] + "</input></div>";
            let checkbox = "<label class='radar-checkbox'><input type='checkbox' name='a' id='" + element[0] +
                "'>" + element[0] + "</input></label>";

            $("#radar-btns").append(checkbox);
        });

        // 初始化雷达图, 这儿的入参 values 实际未使用，不想改radarChart.js校验了，故保留
        initRadarChart(values)

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
                console.log("添加" + this.id)
                let data = values.filter(x => x.name == this.id)
                addNewLayer(this.id, data)
            } else {
                console.log("删除" + this.id)
                removeLayer(this.id)
            }
            console.log(colorIndex);
        });
    })

    // 加载6维图数据, 用的是d3 v3 版本, 使用其他版本注意解决冲突
    function initRadarChart(values) {
        // 导演名
        // let name = values.map(x => x.name);

        // 6维图数据
        let data = values.map(x => x.value);

        //Call function to draw the Radar chart
        RadarChart(".radarChart", data, radarChartOptions);
    }

    // 添加一层
    function addNewLayer(name, data) {
        let g = d3.select("transform");

        //Create a wrapper for the blobs
        let blobWrapper = g.selectAll(".radarWrapper")
            .data(data)
            .enter().append("g")
            .attr("class", "radarWrapper")
            .attr("id", name);

        //Append the backgrounds	
        blobWrapper
            .append("path")
            .attr("class", "radarArea")
            .attr("d", function (d, i) {
                return radarLine(d);
            })
            .style("fill", color(colorIndex))
            .style("fill-opacity", radarChartOptions.opacityArea)
            .on('mouseover', function (d, i) {
                //Dim all blobs
                d3.selectAll(".radarArea")
                    .transition().duration(200)
                    .style("fill-opacity", 0.1);
                //Bring back the hovered over blob
                d3.select(this)
                    .transition().duration(200)
                    .style("fill-opacity", 0.7);
            })
            .on('mouseout', function () {
                //Bring back all blobs
                d3.selectAll(".radarArea")
                    .transition().duration(200)
                    .style("fill-opacity", radarChartOptions.opacityArea);
            });

        //Create the outlines	
        blobWrapper.append("path")
            .attr("class", "radarStroke")
            .attr("d", function (d, i) {
                return radarLine(d);
            })
            .style("stroke-width", radarChartOptions.strokeWidth + "px")
            .style("stroke", color(colorIndex))
            .style("fill", "none")
            .style("filter", "url(#glow)");

        //Append the circles
        blobWrapper.selectAll(".radarCircle")
            .data(function (d, i) {
                return d;
            })
            .enter().append("circle")
            .attr("class", "radarCircle")
            .attr("r", radarChartOptions.dotRadius)
            .attr("cx", function (d, i) {
                return rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2);
            })
            .attr("cy", function (d, i) {
                return rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2);
            })
            .style("fill", color(colorIndex))
            .style("fill-opacity", 0.8);

        colorIndex++;
    }

    // 删除一层
    function removeLayer(name) {
        let g = d3.select("transform");
        g.select(name).remove();

        colorIndex--;
    }
})