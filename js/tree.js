var treeData = {
    name: "Platform",
    type: "platform"
};

var options = {
    nodeRadius: 5,
    fontSize: 12,
    boxWidth: 140,
    boxHeight: 40,
    platformWidth: 70,
    platformBorder: 30,
    imageWidth: 140,
    imageHeight: 60
};

var layoutRoot;
var size;

function visit(parent, visitFn, childrenFn) {
    if (!parent) return;

    visitFn(parent);

    var children = childrenFn(parent);
    if (children) {
        var count = children.length;
        for (var i = 0; i < count; i++) {
            visit(children[i], visitFn, childrenFn);
        }
    }
}



/* Create initial graph structure */
function createTreeGraph() {
	// Size of the diagram
    // var size = { width:$(containerName).outerWidth(), height: totalNodes * 80};
    size = { width:$("#tree-container").outerWidth(), height: $("#tree-container").outerHeight()};

    // Graph
 	layoutRoot = d3.select("#tree-container")
    	.append("svg:svg")
    	.attr("width", size.width)
    	.attr("height", size.height)
     	.append("svg:g")
     	.attr("class", "container")
     	.attr("transform", "translate(" + options.platformBorder + ",0)");

    treeData.parent = treeData;
    treeData.px = treeData.x;
    treeData.py = treeData.y;

    /* Platform - Blue rectangle*/
    layoutRoot.append("rect")
        .attr("x", 0)
        .attr("y", options.platformBorder)
        .attr("width", options.platformWidth)
        .attr("height", size.height - options.platformBorder * 2)
        .attr("class", "node-platform");
}






/* Update build/update graph according to data */
function updateTreeGraph() {
    
    // Calculate total nodes, max label length
    // var totalNodes = 0;
    // var maxLabelLength = 0;
    // visit(treeData, function(d) {
    //     totalNodes++;
    //     maxLabelLength = Math.max(d.name.length, maxLabelLength);
    // }, function(d) {
    //     return (d.contents && d.contents.length > 0) ? d.contents : null;
    // });


	// Create tree layout
    var tree = d3.layout.tree()
        .sort(null)
        .size([size.height, size.width - options.boxWidth])
        .children(function(d) {
            return (!d.contents || d.contents.length === 0) ? null : d.contents;
        });

    // Get nodes/links
    var nodes = tree.nodes(treeData);
    var links = tree.links(nodes);

	// Transition object 
	var t = layoutRoot.transition()
      	.duration(1000);


	/* Edges  */
    // Link position function for enter
 	var linkEnter = d3.svg.diagonal()
 		.source(function(d) {
 			var corrected = {
 				x: d.source.px,
 				y: d.source.py + options.boxWidth / 2
 			}
 			return corrected;
 		})
 		.target(function(d) {
 			var corrected = {
 				x: d.source.px,
 				y: d.source.py + options.boxWidth / 2
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
 				y: d.source.y + options.boxWidth / 2
 			}
 			return corrected;
 		})
 		.target(function(d) {
 			var corrected = {
 				x: d.target.x,
 				y: d.target.y - options.boxWidth / 2
 			}
 			return corrected;
 		})
    	.projection(function(d) {
			return [d.y, d.x];
     	});


    // Update data
	var linkGroup = layoutRoot.selectAll(".link")
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
     	.attr("d", linkUpdate);



    /* Nodes */
    // Update data
	var nodeGroup = layoutRoot.selectAll("g.node")
    	.data(nodes, function(d) { return d.id; });

    // Add
    nodeGroup.enter().append("svg:g")
     	.attr("class", "node")
     	.attr("transform", function(d) {
     		var x = d.parent == null ? d.px : (d.parent.py + options.boxWidth);
     		var y = d.parent == null ? d.py : d.parent.px;
         	return "translate(" + x + "," + y + ")";
		})
		.each(function(d, i) {
	    var g = d3.select(this);
	    if(d.type == 'platform') {
	    	// Platform drawn separately
	    } else if(d.type == 'user')  {
	      	g.append("rect")
	      		.attr("x", -(options.boxWidth / 2))
	 			.attr("y", -(options.boxHeight / 2))
				.attr("width", options.boxWidth)
				.attr("height", options.boxHeight);

			g.append("svg:text")
    			.attr("text-anchor", "middle")
     			.attr("dx", function(d) {
        			return 0;
				})
     			.attr("dy", function(d) {
        			return ".35em";
				})
     			.text(function(d) {
         			return d.name;
				});
	    } else if(d.type == 'gallery')  {
	      	g.append("rect")
	      		.attr("x", -(options.boxWidth / 2))
	 			.attr("y", -(options.boxHeight / 2))
				.attr("width", options.boxWidth)
				.attr("height", options.boxHeight);

			g.append("svg:text")
    			.attr("text-anchor", "middle")
     			.attr("dx", function(d) {
        			return 0;
				})
     			.attr("dy", function(d) {
        			return ".35em";
				})
     			.text(function(d) {
         			return d.name;
				});
	    } else if(d.type == 'image')  {
	      	g.append("rect")
	      		.attr("x", -(options.imageWidth / 2))
	 			.attr("y", -(options.imageHeight / 2))
				.attr("width", options.imageWidth)
				.attr("height", options.imageHeight);

			g.append("svg:image")
			.attr("xlink:href", d.name)
			.attr("x", 3 - (options.imageWidth / 2))
			.attr("y", 3 - (options.imageHeight / 2))
			.attr("width", options.imageWidth - 6)
			.attr("height", options.imageHeight - 6);
	    }

	    // Common
	    g.select("rect").attr("class", function(d) {
	  		return "node-" + d.type;
		});

        if (d.marked) {
            g.append("svg:text")
                .attr("text-anchor", "middle")
                .attr("dx", function(d) {
                    return options.boxWidth;
                })
                .attr("dy", function(d) {
                    return ".35em";
                })
                .text(function(d) {
                    return d.gcCount;
                });
        }
	});

    // Remove
    nodeGroup.exit().remove();

    // Update all
    t.selectAll(".node").attr("transform", function(d) {
    		d.px = d.x;
    		d.py = d.y;
         	return "translate(" + d.y + "," + d.x + ")";
	});


}





