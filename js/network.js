// jquery
$(document).ready(function () {
    console.log("页面已经加载完毕");

    // 加载 网络图数据
    $(document.getElementById("network-chart")).ready(function () {
        load_json();
    })
})

function load_json() {
    console.log("load json");
    // <script type="text/javascript" src="../json/network_vis.json"></script>
    // obj = JSON.parse();
    $.getJSON("./json/network_vis.json", function (json) {
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
    var options = {
        nodes: {
            // color: '#ff0000',
            size:10,
            shape:'diamond',
            // fixed: true //不可移动node
        },
        // edges: {
        //     // arrows: 'to, from',
        //     // color: 'red',
        //     // font: '12px arial #ff0000',
        //     scaling: {
        //         label: true,
        //     },
        //     // shadow: true,
        //     // smooth: true,
        // },

        // groups: {
        //     useDefaultGroups: false,
        //     0: {
        //         color: {
        //             background: 'red'
        //         },
        //         borderWidth: 3
        //     }
        // },

        autoResize: true, //自适应大小，true，则网络将自动检测其容器的大小，并自动重绘
        // physics: {
        //     enabled: false,
            // barnesHut: {
            //     gravitationalConstant: -2000,
            //     centralGravity: 0.3,
            //     springLength: 95,
            //     springConstant: 0.04,
            //     damping: 0.09,
            //     avoidOverlap: 0
            // },
            // forceAtlas2Based: {
            //     gravitationalConstant: -50,
            //     centralGravity: 0.01,
            //     springConstant: 0.08,
            //     springLength: 100,
            //     damping: 0.4,
            //     avoidOverlap: 0
            // },
            // repulsion: {
            //     centralGravity: 0.2,
            //     springLength: 200,
            //     springConstant: 0.05,
            //     nodeDistance: 100,
            //     damping: 0.09
            // },
            // hierarchicalRepulsion: {
            //     centralGravity: 0.0,
            //     springLength: 100,
            //     springConstant: 0.01,
            //     nodeDistance: 120,
            //     damping: 0.09
            // },
            // maxVelocity: 50,
            // minVelocity: 0.1,
            // solver: 'barnesHut',
            // stabilization: {
            //     enabled: true,
            //     iterations: 1000,
            //     updateInterval: 100,
            //     onlyDynamicEdges: false,
            //     fit: true
            // },
            // timestep: 0.5,
            // adaptiveTimestep: true
        // },
        // layout: {
        //     randomSeed: undefined,
        //     improvedLayout: true,
        //     hierarchical: {
        //         enabled: false,
        //         levelSeparation: 150,
        //         nodeSpacing: 100,
        //         treeSpacing: 200,
        //         blockShifting: true,
        //         edgeMinimization: true,
        //         parentCentralization: true,
        //         direction: 'UD', // UD, DU, LR, RL
        //         sortMethod: 'hubsize' // hubsize, directed
        //     }
        // },
        // configure: {
        //     // enabled: false,
        //     // filter: 'physics',
        //     // showButton: false
        // },
        height: '100%',
        width: '100%',
        locale: 'en',
        clickToUse: false
    };

    // initialize your network!
    var network = new vis.Network(container, data, options);

    console.log(network.getSeed())
}