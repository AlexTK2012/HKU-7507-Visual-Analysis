$(document.getElementById("network-echart")).ready(function () {
    console.log("network-echart contruct")

    // $.get('../tmp/network_echart_top100.json', function (networkJson) {
    // $.get('../tmp/network_echart_top30.json', function (networkJson) {
    $.get('../tmp/network_echart_5_actor.json', function (networkJson) {
    // $.get('../tmp/network_echart_director_top30.json', function (networkJson) {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('network-echart'));

        option = {
            // legend: {
            //     data: ['Actor','Director']
            // },
            animation: false,
            series: [{
                type: 'graph',
                layout: 'force',
                animation: false,
                roam: true,
                label: {
                    normal: {
                        position: 'right',
                        formatter: '{b}'
                    }
                },
                draggable: false,   //节点是否可拖拽，只在使用力引导布局的时候有用。
                data: networkJson.nodes,
                categories: networkJson.categories,
                force: {
                    // initLayout: 'circular'
                    edgeLength: 5,  //边的两个节点之间的距离，这个距离也会受 repulsion。
                    repulsion: 20,  //节点之间的斥力因子。
                    gravity: 0.2    //节点受到的向中心的引力因子。该值越大节点越往中心点靠拢。
                },
                edges: networkJson.links
            }]
        };

        myChart.setOption(option);
    });
})