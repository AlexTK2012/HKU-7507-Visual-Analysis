// jquery   使用echart 构建company 柱状图
$(document.getElementById("network-echart")).ready(function () {
    console.log("company-echart contruct")

    let companyChart = echarts.init(document.getElementById('company-echart'))
    let option = getBarOption()
    companyChart.setOption(option)
})

// 配置柱状体option
function getBarOption() {

    let option = {
        
    };
    return option
}