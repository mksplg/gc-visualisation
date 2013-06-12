var memory = {
	eden: [],
	survivor1: [],
	survivor2: [],
	old: []
}

var memOptions = {
	diagramBorder: 30,
	memAreaDistance: 30,
	memAreaWidth: 100
}

var memData = {
	layoutRoot: {},
	size: {}
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

    // Memory area boxes
	memData.layoutRoot.append("rect")
  		.attr("x", 0)
		.attr("y", 0)
		.attr("width", areaWidth)
		.attr("height", areaHeight)
		.attr("class", "eden-area");

	memData.layoutRoot.append("rect")
  		.attr("x", areaXOffset)
		.attr("y", 0)
		.attr("width", areaWidth)
		.attr("height", survivorHeight)
		.attr("class", "survivor-area");

	memData.layoutRoot.append("rect")
  		.attr("x", areaXOffset)
		.attr("y", survivorYOffset)
		.attr("width", areaWidth)
		.attr("height", survivorHeight) 
		.attr("class", "survivor-area");

	memData.layoutRoot.append("rect")
  		.attr("x", 2 * areaXOffset)
		.attr("y", 0)
		.attr("width", areaWidth)
		.attr("height", areaHeight)
		.attr("class", "old-area");
}

function updateMemGraph() {

	// Update data
	var nodeGroup = memData.layoutRoot.selectAll("g.node")
    	.data(nodes, function(d) { return d.id; });

    
}