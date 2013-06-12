var memory = {
	eden: [],
	survivor1: [],
	survivor2: [],
	old: []
}

var memOptions = {
	diagramBorder: 20,
	memAreaDistance: 20,
	numOfSlots: 16
}

var memLayout = {
	layoutRoot: {},
	size: {},
	eden: {},
	survivor1: {},
	survivor2: {},
	old: {}
}

function initMem() {
	var newMemObject = {};
	newMemObject.id = treeData.id;
	newMemObject.treeObject = treeData;
	memory.old.push(newMemObject);

	createMemGraph();
}

function createMemGraph() {
	// Size of the diagram
    // var size = { width:$(containerName).outerWidth(), height: totalNodes * 80};
    memLayout.size = { width:$("#memory-container").outerWidth(), height: $("#memory-container").outerHeight()};

    // Graph
 	memLayout.layoutRoot = d3.select("#memory-container")
    	.append("svg:svg")
    	.attr("width", memLayout.size.width)
    	.attr("height", memLayout.size.height)
     	.append("svg:g")
     	.attr("class", "container")
     	.attr("transform", "translate(" + memOptions.diagramBorder + "," + memOptions.diagramBorder + ")");

	var areaWidth = ((memLayout.size.width - 2 * memOptions.diagramBorder - 2 * memOptions.memAreaDistance) / 3);
	var areaHeight = memLayout.size.height - (2 * memOptions.diagramBorder);
    
    var areaXOffset = areaWidth + memOptions.memAreaDistance;
    
    var survivorHeight = (areaHeight - memOptions.memAreaDistance) / 2;
    var survivorYOffset = survivorHeight + memOptions.memAreaDistance;

    memLayout.eden.x = 0;
    memLayout.eden.y = 0;
    memLayout.eden.width = areaWidth;
    memLayout.eden.height = areaHeight;
    memLayout.eden.boxWidth = areaWidth;
    memLayout.eden.boxHeight = areaHeight / memOptions.numOfSlots;

    memLayout.survivor1.x = areaXOffset;
    memLayout.survivor1.y = 0;
    memLayout.survivor1.width = areaWidth;
    memLayout.survivor1.height = survivorHeight;
    memLayout.survivor1.boxWidth = areaWidth;
    memLayout.survivor1.boxHeight = survivorHeight / (memOptions.numOfSlots / 2);

    memLayout.survivor2.x = areaXOffset;
    memLayout.survivor2.y = survivorYOffset;
    memLayout.survivor2.width = areaWidth;
    memLayout.survivor2.height = survivorHeight;
    memLayout.survivor2.boxWidth = areaWidth;
    memLayout.survivor2.boxHeight = survivorHeight / (memOptions.numOfSlots / 2);

    memLayout.old.x = 2 * areaXOffset;
    memLayout.old.y = 0;
    memLayout.old.width = areaWidth;
    memLayout.old.height = areaHeight;
    memLayout.old.boxWidth = areaWidth;
    memLayout.old.boxHeight = areaHeight / memOptions.numOfSlots;

    // Memory area boxes
	memLayout.layoutRoot.append("rect")
  		.attr("x", memLayout.eden.x)
		.attr("y", memLayout.eden.y)
		.attr("width", memLayout.eden.width)
		.attr("height", memLayout.eden.height)
		.attr("class", "eden-area");

	memLayout.layoutRoot.append("rect")
  		.attr("x", memLayout.survivor1.x)
		.attr("y", memLayout.survivor1.y)
		.attr("width", memLayout.survivor1.width)
		.attr("height", memLayout.survivor1.height)
		.attr("class", "survivor-area");

	memLayout.layoutRoot.append("rect")
  		.attr("x", memLayout.survivor2.x)
		.attr("y", memLayout.survivor2.y)
		.attr("width", memLayout.survivor2.width)
		.attr("height", memLayout.survivor2.height)
		.attr("class", "survivor-area");

	memLayout.layoutRoot.append("rect")
  		.attr("x", memLayout.old.x)
		.attr("y", memLayout.old.y)
		.attr("width", memLayout.old.width)
		.attr("height", memLayout.old.height)
		.attr("class", "old-area");
}

function updateMemGraph() {
 	updateMemArea(memory.eden, memLayout.eden, "eden-node");
 	updateMemArea(memory.survivor1, memLayout.survivor1, "survivor1-node");
 	updateMemArea(memory.survivor2, memLayout.survivor2, "survivor2-node");
 	updateMemArea(memory.old, memLayout.old, "old-node");
}

function updateMemArea(data, layoutData, clazz) {
	var t = memLayout.layoutRoot.transition()
      	.duration(1000);

	// Update data
	var nodes = memLayout.layoutRoot.selectAll("." + clazz)
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

      	g.append("rect")
      		.attr("x", -(layoutData.boxWidth / 2))
 			.attr("y", -(layoutData.boxHeight / 2))
			.attr("width", layoutData.boxWidth)
			.attr("height", layoutData.boxHeight);

		if(d.treeObject.type == 'user' || d.treeObject.type == 'gallery' || d.treeObject.type == 'platform') {
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
		} else {
			g.append("svg:image")
				.attr("xlink:href", d.treeObject.name)
				.attr("x", - (layoutData.boxWidth / 2))
				.attr("y", 1 - (layoutData.boxHeight / 2))
				.attr("width", layoutData.boxWidth)
				.attr("height", layoutData.boxHeight - 2);
		}

	    	// Common
		    g.select("rect").attr("class", function(d) {
		  		return "node-" + d.treeObject.type;
			});

			// Marked marker
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

			// Count marker
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

    memLayout.layoutRoot.selectAll(".marked-marker, .marked-text").attr("style", function(d) {
			return d.treeObject.marked ? "" : "display: none";
		});

    memLayout.layoutRoot.selectAll(".count-text")
    	.text(function(d) {
     		return d.treeObject.gcCount ? d.treeObject.gcCount : "0";
		});
}
