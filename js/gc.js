var gcData = {
	source: memory.survivor2,
	target: memory.survivor1
}

var timeoutData = {
	value: 0
}


function visit(parent, visitFn, childrenFn) {
    if (!parent) return;

    timeoutData.value += 1000;
    setTimeout(function() {
    	visitFn(parent)
    }, timeoutData.value);

    var children = childrenFn(parent);
    if (children) {
        var count = children.length;
        for(i = 0; i < count; i++) {
        	visit(children[i], visitFn, childrenFn);
        }
    }
}

function tenureGC() {
	tenureGC_mark();
}

function tenureGC_mark() {
	mark(treeData, memory);
	setTimeout(function() {tenureGC_copyEden()}, 1000);
}

function tenureGC_copyEden() {
	copy(memory.eden, gcData.target, memory.old, 4);
	setTimeout(function() {tenureGC_clearEden()}, 1000);
}

function tenureGC_clearEden() {
	clear(memory.eden);
	setTimeout(function() {tenureGC_copySurvivor()}, 1000);
}

function tenureGC_copySurvivor() {
	copy(gcData.source, gcData.target, memory.old, 4);
	setTimeout(function() {tenureGC_clearSurvivor()}, 1000);
}

function tenureGC_clearSurvivor() {
	clear(gcData.source);
	setTimeout(function() {tenureGC_switch()}, 1000);
}

function tenureGC_switch() {
	var tmp = gcData.source;
	gcData.source = gcData.target;
	gcData.target = tmp;
}

function fullGC() {
	timeoutData.value = 0;

	mark(treeData, memory);
	
	copy(memory.old, memory.tmp, memory.trash, 0);
	clear(memory.old);
	clear(memory.trash);
	memory.old = memory.tmp;
}

function mark(objectHierarchy, memoryAreas) {
	clearMarked(memoryAreas.eden);
	clearMarked(memoryAreas.survivor1);
	clearMarked(memoryAreas.survivor2);
	clearMarked(memoryAreas.old);

	visit(objectHierarchy, function(d) {
        d.marked = true;
        updateMemGraph();
    }, function(d) {
        return (d.contents && d.contents.length > 0) ? d.contents : null;
    });
}

function mark2(parent, root) {
	if (!parent) return;

	var children = (d.contents && d.contents.length > 0) ? parent.contents : null;
	var accTimeout
	if (children) {
		for(var i = 0; i < children.length; i++) {

		}
	}

	if (root) {

	}
}

function clearMarked(data) {
	for (var i = 0; i < data.length; i++) {
    	data[i].treeObject.marked = false;
	}
}

function copy(source, target, old, count) {
	for (var i = 0; i < source.length; i++) {
    	if (source[i].treeObject.marked) {
    		source[i].treeObject.gcCount = (source[i].treeObject.gcCount) ? source[i].treeObject.gcCount + 1 : 1;
    		if (source[i].treeObject.gcCount < count) {
			    timeoutData.value += 1000;
			    setTimeout(function() {
			    	target.push(source[i]);
			    	updateMemGraph();
			    }, timeoutData.value);
    		} else {
    			setTimeout(function() {
    				old.push(source[i]);
    				updateMemGraph();
    			}, timeoutData.value);
    		}
    		

    		
    	}
	}
}

function clear(data) {
	data.length = 0;
	updateMemGraph();
}