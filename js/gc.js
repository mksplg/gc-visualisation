var gcOptions = {
	timeout: 500
}

var gcData = {
	source: memory.survivor2,
	target: memory.survivor1,
	markTimeout: 0,
	copyTimeout: 0
}

function tenureGC() {
	gcData.markTimeout = 0;
	gcData.copyTimeout = 0;
	tenureGC_mark();
}

function tenureGC_mark() {
	clearMarked(memory.eden);
	clearMarked(memory.survivor1);
	clearMarked(memory.survivor2);
	clearMarked(memory.old);
	
	mark(treeData, true);
}

function clearMarked(data) {
	for (var i = 0; i < data.length; i++) {
    	data[i].treeObject.marked = false;
	}
}

function mark(parent, root) {
	if (!parent) return;

	if (!parent.deleted) {
		gcData.markTimeout += gcOptions.timeout;
		setTimeout(function() {
			parent.marked = true;
			updateGraphs();
		}, gcData.markTimeout);

		var children = (parent.contents && parent.contents.length > 0) ? parent.contents : null;
		if (children) {
			for(var i = 0; i < children.length; i++) {
				mark(children[i], false);
			}
		}
	}

	if (root) {
		gcData.markTimeout += gcOptions.timeout;
		setTimeout(function() {
			tenureGC_copyEden();
		}, gcData.markTimeout);
	}
}

function tenureGC_copyEden() {
	copy(memory.eden, gcData.target, memory.old, 4, function() {
		tenureGC_clearEden();
	});
}

function tenureGC_clearEden() {
	clear(memory.eden);
	updateGraphs();
	setTimeout(function() {tenureGC_copySurvivor()}, gcOptions.timeout);
}

function tenureGC_copySurvivor() {
	copy(gcData.source, gcData.target, memory.old, 4, function() {
		tenureGC_clearSurvivor();
	});
}

function tenureGC_clearSurvivor() {
	clear(gcData.source);
	updateGraphs();
	setTimeout(function() {tenureGC_switch()}, gcOptions.timeout);
}

function tenureGC_switch() {
	var tmp = gcData.source;
	gcData.source = gcData.target;
	gcData.target = tmp;

	clearMarked(memory.eden);
	clearMarked(memory.survivor1);
	clearMarked(memory.survivor2);
	clearMarked(memory.old);

	removeDeleted(treeData);

	updateGraphs();
}

function removeDeleted(parent) {
	if (!parent) return;

	var children = (parent.contents && parent.contents.length > 0) ? parent.contents : null;
	if (children) {
		for(var i = 0; i < children.length; i++) {
			removeDeleted(children[i]);
			if (children[i].deleted) {
				parent.contents.splice(i, 1)
				i--;
			}
		}
	}
}

function fullGC() {
	// timeoutData.value = 0;

	// mark(treeData, memory);
	
	// copy(memory.old, memory.tmp, memory.trash, 0);
	// clear(memory.old);
	// clear(memory.trash);
	// memory.old = memory.tmp;
}

function copy(source, target, old, count, continueFn) {
	gcData.copyTimeout = 0;
	for (var i = 0; i < source.length; i++) {
    	if (source[i].treeObject.marked) {
				gcData.copyTimeout += gcOptions.timeout;
				(function(index) {
					setTimeout(function() {
    					source[index].treeObject.gcCount = (source[index].treeObject.gcCount) ? source[index].treeObject.gcCount + 1 : 1;
    					if (source[index].treeObject.gcCount < count) {
					    	target.push(source[index]);
					    } else {
							old.push(source[index]);
					    }
				    	updateGraphs();
				    }, gcData.copyTimeout);
			    })(i);
    	}
	}
	gcData.copyTimeout += gcOptions.timeout;
	setTimeout(continueFn, gcData.copyTimeout);
}

function clear(data) {
	data.length = 0;
	updateGraphs();
}