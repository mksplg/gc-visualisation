var sessionData = {
	session1: {},
	session2: {}
};


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

	updateTreeGraph();

	// Memory
	var newMemObject = {};
	newMemObject.id = newTreeObject.id;
	newMemObject.treeObject = newTreeObject;
	memory.eden.push(newMemObject);

	updateMemGraph();
}

function addGallery(sessionObj, newUserIx, galleryIx) {
	// Tree
	if (treeData.contents[sessionObj.treeUserIx].contents == null) {
		treeData.contents[sessionObj.treeUserIx].contents = [];
	}

	var newTreeObject = {};
	newTreeObject.id = generateUID();
	newTreeObject.name = data[newUserIx].galleries[galleryIx].gallery.name;
	newTreeObject.type = data[newUserIx].galleries[galleryIx].gallery.type;

	treeData.contents[sessionObj.treeUserIx].contents.push(newTreeObject);

	updateTreeGraph();

	// Memory
	var newMemObject = {};
	newMemObject.id = newTreeObject.id;
	newMemObject.treeObject = newTreeObject;
	memory.eden.push(newMemObject);

	updateMemGraph();
}

function addImage(sessionObj, newUserIx, galleryIx, imageIx) {
	// Tree
	if (treeData.contents[sessionObj.treeUserIx].contents[galleryIx].contents == null) {
		treeData.contents[sessionObj.treeUserIx].contents[galleryIx].contents = [];
	}

	var newTreeObject = {};
	newTreeObject.id = generateUID();
	newTreeObject.name = data[newUserIx].galleries[galleryIx].images[imageIx].name;
	newTreeObject.type = data[newUserIx].galleries[galleryIx].images[imageIx].type;

	treeData.contents[sessionObj.treeUserIx].contents[galleryIx].contents.push(newTreeObject);

	updateTreeGraph();

	// Memory
	var newMemObject = {};
	newMemObject.id = newTreeObject.id;
	newMemObject.treeObject = newTreeObject;
	memory.eden.push(newMemObject);

	updateMemGraph();
}


function generateUID() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    	return v.toString(16);
	});
}