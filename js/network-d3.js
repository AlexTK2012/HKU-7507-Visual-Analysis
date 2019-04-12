// jquery
$(document.getElementById("network-d3")).ready(function () {
    console.log("network-d3 contruct")

    let color = d3.scaleOrdinal(d3.schemeCategory20);
    let colors = ["#EDC951", "#CC333F", "#00A0B0"]

    let svg = d3.select("svg")
        .call(d3.zoom().on("zoom", function () {
            svg.attr("transform", d3.event.transform)
        }))
        .append("g");

    let width = +svg.attr("width");
    let height = +svg.attr("height");


    let simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function (d) {
            return d.id;
        }))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2));

    // d3.json("../json/network.json", function (error, graph) {
    // d3.json("../tmp/network_d3_top30.json", function (error, graph) {
    // d3.json("../tmp/network_d3_director_top100.json", function (error, graph) {
    d3.json("../json/network_d3_main_actor.json", function (error, graph) {
        if (error) throw error;

        let link = svg.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(graph.links)
            .enter().append("line");

        let node = svg.append("g")
            .attr("class", "nodes")
            .selectAll("g")
            .data(graph.nodes)
            .enter().append("g")

        node.append("circle")
            .attr("r", 5)
            .attr("fill", function (d) {
                if (d.group == 0) {
                    return colors[1]
                } else {
                    return colors[0]
                }
            })
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

        node.append("title")
            .text(function (d) {
                return d.id;
            });

        simulation
            .nodes(graph.nodes)
            .on("tick", ticked);

        simulation.force("link")
            .links(graph.links);

        function ticked() {
            link
                .attr("x1", function (d) {
                    return d.source.x;
                })
                .attr("y1", function (d) {
                    return d.source.y;
                })
                .attr("x2", function (d) {
                    return d.target.x;
                })
                .attr("y2", function (d) {
                    return d.target.y;
                });

            // node
            //     .attr("cx", function (d) {
            //         return d.x;
            //     })
            //     .attr("cy", function (d) {
            //         return d.y;
            //     });
            node
                .attr("transform", function (d) {
                    return "translate(" + d.x + "," + d.y + ")";
                })
        }
    });

    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
})