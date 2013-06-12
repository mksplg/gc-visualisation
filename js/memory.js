var memory = {
	eden: [],
	survivor1: [],
	survivor2: [],
	old: []
}

var memOptions = {
	diagramBorder: 20,
	memAreaDistance: 20
}

var memData = {
	layoutRoot: {},
	size: {},
	eden: {},
	survivor1: {},
	survivor2: {},
	old: {}
}

function createMemGraph() {
	// Size of the diagram
    // var size = { width:$(containerName).outerWidth(), height: totalNodes * 80};
    memData.size = { width:$("#memory-container").outerWidth(), height: $("#memory-container").outerHeight()};

    // Graph
 	memData.layoutRoot = d3.select("#memory-container")
    	.append("svg:svg")
    	.attr("width", size.width)
    	.attr("height", size.height)
     	.append("svg:g")
     	.attr("class", "container")
     	.attr("transform", "translate(" + memOptions.diagramBorder + "," + memOptions.diagramBorder + ")");

	var areaWidth = ((memData.size.width - 2 * memOptions.diagramBorder - 2 * memOptions.memAreaDistance) / 3);
	var areaHeight = memData.size.height - (2 * memOptions.diagramBorder);
    
    var areaXOffset = areaWidth + memOptions.memAreaDistance;
    
    var survivorHeight = (areaHeight - memOptions.memAreaDistance) / 2;
    var survivorYOffset = survivorHeight + memOptions.memAreaDistance;

    memData.eden.x = 0;
    memData.eden.y = 0;
    memData.eden.width = areaWidth;
    memData.eden.height = areaHeight;
    memData.eden.boxWidth = areaWidth;
    memData.eden.boxHeight = areaHeight / 10;

    memData.survivor1.x = areaXOffset;
    memData.survivor1.y = 0;
    memData.survivor1.width = areaWidth;
    memData.survivor1.height = survivorHeight;
    memData.survivor1.boxWidth = areaWidth;
    memData.survivor1.boxHeight = survivorHeight / 5;

    memData.survivor2.x = areaXOffset;
    memData.survivor2.y = survivorYOffset;
    memData.survivor2.width = areaWidth;
    memData.survivor2.height = survivorHeight;
    memData.survivor2.boxWidth = areaWidth;
    memData.survivor2.boxHeight = survivorHeight / 5;

    memData.old.x = 2 * areaXOffset;
    memData.old.y = 0;
    memData.old.width = areaWidth;
    memData.old.height = areaHeight;
    memData.old.boxWidth = areaWidth;
    memData.old.boxHeight = areaHeight / 10;

    // Memory area boxes
	memData.layoutRoot.append("rect")
  		.attr("x", memData.eden.x)
		.attr("y", memData.eden.y)
		.attr("width", memData.eden.width)
		.attr("height", memData.eden.height)
		.attr("class", "eden-area");

	memData.layoutRoot.append("rect")
  		.attr("x", memData.survivor1.x)
		.attr("y", memData.survivor1.y)
		.attr("width", memData.survivor1.width)
		.attr("height", memData.survivor1.height)
		.attr("class", "survivor-area");

	memData.layoutRoot.append("rect")
  		.attr("x", memData.survivor2.x)
		.attr("y", memData.survivor2.y)
		.attr("width", memData.survivor2.width)
		.attr("height", memData.survivor2.height)
		.attr("class", "survivor-area");

	memData.layoutRoot.append("rect")
  		.attr("x", memData.old.x)
		.attr("y", memData.old.y)
		.attr("width", memData.old.width)
		.attr("height", memData.old.height)
		.attr("class", "old-area");
}

function updateMemGraph() {
 	updateMemArea(memory.eden, memData.eden, "eden-node");
 	updateMemArea(memory.survivor1, memData.survivor1, "survivor1-node");
 	updateMemArea(memory.survivor2, memData.survivor2, "survivor2-node");
 	updateMemArea(memory.old, memData.old, "old-node");
}

function updateMemArea(data, layoutData, clazz) {
	var t = memData.layoutRoot.transition()
      	.duration(1000);

	// Update data
	var nodes = memData.layoutRoot.selectAll("." + clazz)
    	.data(data, function(d) {
    		return d.id;
    	});


    nodes.enter().append("svg:g")
     	.attr("class", clazz)
     	.attr("transform", function(d, i) {
     		var x = layoutData.x + layoutData.boxWidth / 2;
     		var y = layoutData.y + i * layoutData.boxHeight + layoutData.boxHeight / 2;
         	return "translate(" + x + "," + y + ")";
		})
		.each(function(d, i) {
	    var g = d3.select(this);
	    if(d.treeObject.type == 'platform') {
	    	// Ignore type
	    } else if(d.treeObject.type == 'user' || d.treeObject.type == 'gallery')  {
	      	g.append("rect")
	      		.attr("x", -(layoutData.boxWidth / 2))
	 			.attr("y", -(layoutData.boxHeight / 2))
				.attr("width", layoutData.boxWidth)
				.attr("height", layoutData.boxHeight);

			g.append("svg:text")
    			.attr("text-anchor", "middle")
     			.attr("dx", function(d) {
        			return 0;
				})
     			.attr("dy", function(d) {
        			return ".35em";
				})
     			.text(function(d) {
         			return d.treeObject.name;
				});
	    } else if(d.treeObject.type == 'image')  {
	      	g.append("rect")
	      		.attr("x", -(layoutData.boxWidth / 2))
	 			.attr("y", -(layoutData.boxHeight / 2))
				.attr("width", layoutData.boxWidth)
				.attr("height", layoutData.boxHeight);

			g.append("svg:image")
			.attr("xlink:href", d.treeObject.name)
			.attr("x", - (layoutData.boxWidth / 2))
			.attr("y", - (layoutData.boxHeight / 2))
			.attr("width", layoutData.boxWidth)
			.attr("height", layoutData.boxHeight);
	    }

	    // Common
	    g.select("rect").attr("class", function(d) {
	  		return "node-" + d.treeObject.type;
		});

	    g.append("svg:circle")
	    	.attr("class", "marked-marker")
	    	.attr("cx", layoutData.boxWidth / 2 - layoutData.boxHeight / 2 - layoutData.boxHeight + 4)
	    	.attr("cy", 0)
	    	.attr("r", layoutData.boxHeight / 2 - 4)
			.attr("style", function(d) {
				return d.treeObject.marked ? "" : "display: none";
			});
	    g.append("svg:text")
	    	.attr("class", "marked-text")
			.attr("text-anchor", "middle")
 			.attr("dx", layoutData.boxWidth / 2 - layoutData.boxHeight / 2 - layoutData.boxHeight + 4)
 			.attr("dy", ".5em")
 			.text("*")
 			.attr("style", function(d) {
				return d.treeObject.marked ? "" : "display: none";
			});

	    g.append("svg:circle")
	    	.attr("class", "count-marker")
	    	.attr("cx", layoutData.boxWidth / 2 - layoutData.boxHeight / 2)
	    	.attr("cy", 0)
	    	.attr("r", layoutData.boxHeight / 2 - 4);
	    g.append("svg:text")
	    	.attr("class", "count-text")
			.attr("text-anchor", "middle")
 			.attr("dx", layoutData.boxWidth / 2 - layoutData.boxHeight / 2)
 			.attr("dy", ".35em");
	});

    // Remove
    nodes.exit().remove();

    // Update all
    t.selectAll("." + clazz).attr("transform", function(d, i) {
     		var x = layoutData.x + layoutData.boxWidth / 2;
     		var y = layoutData.y + i * layoutData.boxHeight + layoutData.boxHeight / 2;
         	return "translate(" + x + "," + y + ")";
	});

    memData.layoutRoot.selectAll(".marked-marker, .marked-text").attr("style", function(d) {
			return d.treeObject.marked ? "" : "display: none";
		});

    memData.layoutRoot.selectAll(".count-text")
    	.text(function(d) {
     		return d.treeObject.gcCount ? d.treeObject.gcCount : "0";
		});
}
