var treeData = {};

var treeOptions = {
    platformWidth: 70,
    platformBorder: 20,
    boxWidth: 140,
    boxHeight: 40,
    markerRadius: 12
};

var treeLayout = {
    layoutRoot: {},
    size: {}
}


function initTree() {
    treeData.id = generateUID();
    treeData.name = "Platform";
    treeData.type = "platform";
    treeData.gcCount = 4;

    createTreeGraph();
}

/* Create initial graph structure */
function createTreeGraph() {
	// Size of the diagram
    // var size = { width:$(containerName).outerWidth(), height: totalNodes * 80};
    treeLayout.size = { width:$("#tree-container").outerWidth(), height: $("#tree-container").outerHeight()};

    // Graph
 	treeLayout.layoutRoot = d3.select("#tree-container")
    	.append("svg:svg")
    	.attr("width", treeLayout.size.width)
    	.attr("height", treeLayout.size.height)
     	.append("svg:g")
     	.attr("class", "container")
     	.attr("transform", "translate(" + treeOptions.platformBorder + ",0)");

    treeData.parent = treeData;
    treeData.px = treeData.x;
    treeData.py = treeData.y;

    /* Platform - Blue rectangle*/
    treeLayout.layoutRoot.append("rect")
        .attr("x", 0)
        .attr("y", treeOptions.platformBorder)
        .attr("width", treeOptions.platformWidth)
        .attr("height", treeLayout.size.height - treeOptions.platformBorder * 2)
        .attr("class", "node-platform");

    // Marked marker
    treeLayout.layoutRoot.append("svg:circle")
        .attr("class", "platform-marked-marker")
        .attr("cx", treeOptions.platformWidth)
        .attr("cy", treeOptions.platformBorder)
        .attr("r", treeOptions.markerRadius);
    treeLayout.layoutRoot.append("svg:text")
        .attr("class", "platform-marked-text")
        .attr("text-anchor", "middle")
        .attr("dx", treeOptions.platformWidth)
        .attr("dy", treeOptions.platformBorder + 10)
        .text("*");

}

/* Update build/update graph according to data */
function updateTreeGraph() {
    
	// Create tree layout
    var tree = d3.layout.tree()
        .sort(null)
        .size([treeLayout.size.height, treeLayout.size.width - treeOptions.boxWidth])
        .children(function(d) {
            return (!d.contents || d.contents.length === 0) ? null : d.contents;
        });

    // Get nodes/links
    var nodes = tree.nodes(treeData);
    var links = tree.links(nodes);

	// Transition object 
	var t = treeLayout.layoutRoot.transition()
      	.duration(1000);

	/* Edges  */
    // Link position function for enter
 	var linkEnter = d3.svg.diagonal()
 		.source(function(d) {
 			var corrected = {
 				x: d.source.px,
 				y: d.source.py + treeOptions.boxWidth / 2
 			}
 			return corrected;
 		})
 		.target(function(d) {
 			var corrected = {
 				x: d.source.px,
 				y: d.source.py + treeOptions.boxWidth / 2
 			}
 			return corrected;
 		})
    	.projection(function(d) {
			return [d.y, d.x];
     	});

	// Link position function for update
 	var linkUpdate = d3.svg.diagonal()
 		.source(function(d) {
 			var corrected = {
 				x: d.source.x,
 				y: d.source.y + treeOptions.boxWidth / 2
 			}
 			return corrected;
 		})
 		.target(function(d) {
 			var corrected = {
 				x: d.target.x,
 				y: d.target.y - treeOptions.boxWidth / 2
 			}
 			return corrected;
 		})
    	.projection(function(d) {
			return [d.y, d.x];
     	});


    // Update data
	var linkGroup = treeLayout.layoutRoot.selectAll(".link")
    	.data(links, function(d) { return d.source.id + "-" + d.target.id; });
    	
    // Add
   	linkGroup.enter()
    	.append("svg:path")
     	.attr("class", "link")
     	.attr("d", linkEnter);

    // Remove
	linkGroup.exit().remove();

	// Update all
    t.selectAll(".link")
     	.attr("d", linkUpdate)
        .attr("style", function(d) {
            return d.target.deleted ? "display: none;" : "";
        });


    /* Nodes */
    // Update data
	var nodeGroup = treeLayout.layoutRoot.selectAll(".node")
    	.data(nodes, function(d) {
            return d.id;
        });

    // Add
    nodeGroup.enter().append("svg:g")
     	.attr("class", "node")
     	.attr("transform", function(d) {
     		var x = d.parent == null ? d.px : (d.parent.py + treeOptions.boxWidth);
     		var y = d.parent == null ? d.py : d.parent.px;
         	return "translate(" + x + "," + y + ")";
		})
		.each(function(d, i) {
	    var g = d3.select(this);
        // if (d.type == 'user' || d.type == 'gallery' || d.type == 'image')  {

            if (d.type == 'platform') {
                    g.append("svg:text")
                        .attr("text-anchor", "center")
						.attr("class", "rotate")
                        .attr("dx", "-2.10em")
                        .attr("dy", "2.00em")
                        .text(function(d) {
                            return "Platform";
                        });
            } else {
                g.append("rect")
                    .attr("x", -(treeOptions.boxWidth / 2))
                    .attr("y", -(treeOptions.boxHeight / 2))
                    .attr("width", treeOptions.boxWidth)
                    .attr("height", treeOptions.boxHeight);

                if (d.type == 'user' || d.type == 'gallery') {
                    g.append("svg:text")
                        .attr("text-anchor", "middle")
                        .attr("dx", 0)
                        .attr("dy", ".35em")
                        .text(function(d) {
                            return d.name;
                        });
                } else {
                    g.append("svg:image")
                    .attr("xlink:href", d.name)
                    .attr("x", 2 - (treeOptions.boxWidth / 2))
                    .attr("y", 2 - (treeOptions.boxHeight / 2))
                    .attr("width", treeOptions.boxWidth - 4)
                    .attr("height", treeOptions.boxHeight - 4);
                }

                // Marked marker
                g.append("svg:circle")
                    .attr("class", "marked-marker")
                    .attr("cx", treeOptions.boxWidth / 2)
                    .attr("cy", - treeOptions.boxHeight / 2)
                    .attr("r", treeOptions.markerRadius);
                g.append("svg:text")
                    .attr("class", "marked-text")
                    .attr("text-anchor", "middle")
                    .attr("dx", treeOptions.boxWidth / 2)
                    .attr("dy", "-.5em")
                    .text("*");
            }

            // Common
            g.select("rect").attr("class", function(d) {
                return "node-" + d.type;
            });
	});

    // Remove
    nodeGroup.exit().remove();

    // Update all
    t.selectAll(".node").attr("transform", function(d) {
    		d.px = d.x;
    		d.py = d.y;
         	return "translate(" + d.y + "," + d.x + ")";
	});

    treeLayout.layoutRoot.selectAll(".marked-marker, .marked-text").attr("style", function(d) {
            return d.marked ? "" : "display: none";
        });

    treeLayout.layoutRoot.selectAll(".platform-marked-marker, .platform-marked-text").attr("style", function(d) {
            return treeData.marked ? "" : "display: none";
        });
}

