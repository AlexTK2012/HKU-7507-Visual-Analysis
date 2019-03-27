// jquery
$(document).ready(function () {
    console.log("页面已经加载完毕");

    // 加载 网络图数据
    $(document.getElementById("network-chart")).ready(function () {
        load_json();
        vis_create_network();
    })
})

function load_json() {
    console.log("load json");
    // obj = JSON.parse();
    // <script type="text/javascript" src="../json/network_vis.json"></script>
    $.getJSON("./json/network_vis.json", function (json) {
        // console.log("vis_create_network");
        // vis_create_network(json);
    }).done(function(json){
        console.log("vis_create_network");
        vis_create_network(json);
    });
}

function d3_create_network() {

}

function vis_create_network(json) {
    var nodes = json.nodes;

    // create an array with edges
    var edges = json.links;

    // create a network
    var container = document.getElementById('network-chart');

    // provide the data in the vis format
    var data = {
        nodes: nodes,
        edges: edges
    };
    var options = {};

    // initialize your network!
    var network = new vis.Network(container, data, options);
}