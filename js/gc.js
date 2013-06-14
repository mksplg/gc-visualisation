var gcOptions = {
	timeout: 500
}

var gcData = {
	source: memory.survivor2,
	target: memory.survivor1,
	markTimeout: 0,
	copyTimeout: 0,
	fullGC: false
}

function tenureGC(full) {
	gcData.fullGC = full;

	if (gcData.fullGC) {
		d3.selectAll("#major-gc-code").style("display", "block");
		d3.selectAll("#major-gc-code").transition().duration(300).style("opacity", 1);
	} else {
		d3.selectAll("#minor-gc-code").style("display", "block");
		d3.selectAll("#minor-gc-code").transition().duration(300).style("opacity", 1);
	}

	gcData.markTimeout = 0;
	gcData.copyTimeout = 0;
	tenureGC_mark();
}

function tenureGC_mark() {
	clearMarked(memory.eden);
	clearMarked(memory.survivor1);
	clearMarked(memory.survivor2);
	clearMarked(memory.old);
	
	mark(treeData, true, false);
}

function clearMarked(data) {
	for (var i = 0; i < data.length; i++) {
    	data[i].treeObject.marked = false;
	}
}

function mark(parent, root, major) {
	d3.selectAll(".gc-mark").attr("class", "gc-mark highlighted");

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
			d3.selectAll(".gc-mark").attr("class", "gc-mark");
			tenureGC_copyEden();
			if(major){ 
				tenureGC_clearOld();
			}
			
		}, gcData.markTimeout);
	}
}

function tenureGC_copyEden() {
	d3.selectAll(".gc-copy-eden").attr("class", "gc-copy-eden highlighted");
	copy(memory.eden, gcData.target, memory.old, 4, function() {
		d3.selectAll(".gc-copy-eden").attr("class", "gc-copy-eden");
		tenureGC_clearEden();
	});
}

function tenureGC_clearEden() {
	d3.selectAll(".gc-clear-eden").attr("class", "gc-clear-eden highlighted");
	clear(memory.eden);
	updateGraphs();
	setTimeout(function() {
		d3.selectAll(".gc-clear-eden").attr("class", "gc-clear-eden");
		tenureGC_copySurvivor();
	}, gcOptions.timeout);
}

function tenureGC_copySurvivor() {
	d3.selectAll(".gc-copy-survivor").attr("class", "gc-copy-survivor highlighted");
	copy(gcData.source, gcData.target, memory.old, 4, function() {
		d3.selectAll(".gc-copy-survivor").attr("class", "gc-copy-survivor");
		tenureGC_clearSurvivor();
	});
}

function tenureGC_clearSurvivor() {
	d3.selectAll(".gc-clear-survivor").attr("class", "gc-clear-survivor highlighted");
	clear(gcData.source);
	updateGraphs();
	setTimeout(function() {
		d3.selectAll(".gc-clear-survivor").attr("class", "gc-clear-survivor");
		tenureGC_switch();
	}, gcOptions.timeout);
}

function tenureGC_switch() {
	d3.selectAll(".gc-switch").attr("class", "gc-switch highlighted");
	var tmp = gcData.source;
	gcData.source = gcData.target;
	gcData.target = tmp;
	
	setTimeout(function() {
		d3.selectAll(".gc-switch").attr("class", "gc-switch");
		if (gcData.fullGC) {
			tenureGC_clearOld();
		} else {
			tenureGC_finish();
		}
	}, gcOptions.timeout);

}

function tenureGC_finish() {
	d3.selectAll(".gc-finish").attr("class", "gc-finish highlighted");

	clearMarked(memory.eden);
	clearMarked(memory.survivor1);
	clearMarked(memory.survivor2);
	clearMarked(memory.old);

	removeDeleted(treeData);
	updateGraphs();

	setTimeout(function() {
		d3.selectAll(".gc-finish").attr("class", "gc-finish");
		d3.selectAll(".gc-code").transition().duration(300).style("opacity", 0);
		d3.selectAll(".gc-code").transition().delay(300).style("display", "none");
	}, gcOptions.timeout);
}

function tenureGC_clearOld() {
	d3.selectAll(".gc-clear-old").attr("class", "gc-clear-old highlighted");
	removeDeleted(treeData);
	for (var i = 0; i < memory.old.length; i++) {
    	if (!memory.old[i].treeObject.marked) {
			memory.old.splice(i, 1);
			i--;
		}
	}
	updateGraphs();

	setTimeout(function() {
		d3.selectAll(".gc-clear-old").attr("class", "gc-clear-old");
		tenureGC_finish();
	}, gcOptions.timeout);
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
	tenureGC(true);
	updateGraphs();
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