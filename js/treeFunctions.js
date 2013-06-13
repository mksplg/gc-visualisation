function updateGraphs() {
    updateMemGraph();
    updateTreeGraph();
    updateGalleries();
}

function login(sessionObj, newUserIx) {
	// Tree
	if (treeData.contents == null) {
		treeData.contents = [];
	}
	
	var newTreeObject = {};
	newTreeObject.id = generateUID();
	newTreeObject.name = data[newUserIx].user.name;
	newTreeObject.type = data[newUserIx].user.type;

	sessionObj.treeUserIx = treeData.contents.push(newTreeObject) - 1;

	// Memory
	var newMemObject = {};
	newMemObject.id = newTreeObject.id;
	newMemObject.treeObject = newTreeObject;
	memory.eden.push(newMemObject);

	updateGraphs();
}

function addGallery(sessionObj, userIx, galleryIx) {
	// Tree
	if (treeData.contents[sessionObj.treeUserIx].contents == null) {
		treeData.contents[sessionObj.treeUserIx].contents = [];
	}

	var newTreeObject = {};
	newTreeObject.id = generateUID();
	newTreeObject.name = data[userIx].galleries[galleryIx].gallery.name;
	newTreeObject.type = data[userIx].galleries[galleryIx].gallery.type;

	treeData.contents[sessionObj.treeUserIx].contents.push(newTreeObject);

	// Memory
	var newMemObject = {};
	newMemObject.id = newTreeObject.id;
	newMemObject.treeObject = newTreeObject;
	memory.eden.push(newMemObject);

	updateGraphs();
}

function addImage(sessionObj, userIx, galleryIx, imageIx) {
	// Tree
	if (treeData.contents[sessionObj.treeUserIx].contents[galleryIx].contents == null) {
		treeData.contents[sessionObj.treeUserIx].contents[galleryIx].contents = [];
	}

	var newTreeObject = {};
	newTreeObject.id = generateUID();
	newTreeObject.name = data[userIx].galleries[galleryIx].images[imageIx].name;
	newTreeObject.type = data[userIx].galleries[galleryIx].images[imageIx].type;

	treeData.contents[sessionObj.treeUserIx].contents[galleryIx].contents.push(newTreeObject);

	// Memory
	var newMemObject = {};
	newMemObject.id = newTreeObject.id;
	newMemObject.treeObject = newTreeObject;
	memory.eden.push(newMemObject);

	// Session
	var newSessionObject = {};
	newSessionObject.id = newTreeObject.id;
	newSessionObject.treeObject = newTreeObject;
	sessionObj.gallery.push(newSessionObject);

	updateGraphs();
}



function deleteImage(galleryObject, imageId) {
	for(var i = 0; i < galleryObject.length; i++) {
		if(galleryObject[i].id == imageId) {
			galleryObject[i].treeObject.deleted = true;
			galleryObject.splice(i, 1);
		}
	}

	updateGraphs();
}



function generateUID() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    	return v.toString(16);
	});
}