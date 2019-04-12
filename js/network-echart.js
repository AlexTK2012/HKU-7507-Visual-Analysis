$(document.getElementById("network-echart")).ready(function () {
    console.log("network-echart contruct")

    // $.get('../tmp/network_echart_top100.json', function (networkJson) {
    // $.get('../tmp/network_echart_top30.json', function (networkJson) {
    // $.get('../tmp/network_echart_5_actor.json', function (networkJson) {
    // $.get('../tmp/network_echart_director_top30.json', function (networkJson) {
    $.get('../json/network_echart_main_actor.json', function (networkJson) {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('network-echart'));

        option = {
            legend: {
                data: ['Actor', 'Director']
            },
            animation: true,
            tooltip: { //提示框浮层,可完全自定义
                formatter: function (obj) {
                    // 计算此人共事人数:此处计算规则要和python 里一致
                    let value = (obj.data.symbolSize - 4) / 2
                    return '<div style="font-size: 18px;margin: 7px">' +
                        obj.data.job + ' ' + obj.name + ' has worked with ' + value + ' people.</div>';
                }
            },
            legendHoverLink: false, //是否启用图例 hover 时的联动高亮。
            markLine: {
                label: {
                    show: false,
                },
                emphasis: {
                    label: {
                        show: false,
                    }
                }
            },
            series: [{
                type: 'graph',
                layout: 'force',
                symbol: 'circle', // 点形状circle, rect, roundRect, triangle, diamond, pin, arrow, none，可以为图片
                animation: true,
                roam: true,
                label: {
                    normal: {
                        position: 'right',
                        formatter: '{b}'
                    },
                    // emphasis: {}     // 悬停点时的文字样式
                },
                edgeLabel: {
                    show: false,
                },
                draggable: true, //节点是否可拖拽，只在使用力引导布局的时候有用。
                data: networkJson.nodes, // 点
                edges: networkJson.links, // 边
                categories: networkJson.categories, //分类
                focusNodeAdjacency: true, //是否在鼠标移到节点上的时候突出显示节点以及节点的边和邻接节点。
                force: {
                    // initLayout: 'circular'
                    edgeLength: [10, 50], //边的两个节点之间的距离，这个距离也会受 repulsion。支持设置成数组表达边长的范围
                    repulsion: 140, //节点之间的斥力因子。值越大则斥力越大
                    gravity: 0.2, //节点受到的向中心的引力因子。该值越大节点越往中心点靠拢。
                    layoutAnimation: true, //节点数据较多（>100）的时候不建议关闭
                },
                lineStyle: {
                    normal: {
                        // width: 1, // 线宽，越宽代表两人合作次数越多
                        curveness: 0, //线曲线度
                        opacity: 1 //透明度
                    }
                }
            }]
        };

        myChart.setOption(option);
    });
})