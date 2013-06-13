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

	treeData.contents.push(newTreeObject);

	// Memory
	var newMemObject = {};
	newMemObject.id = newTreeObject.id;
	newMemObject.treeObject = newTreeObject;
	memory.eden.push(newMemObject);

	// Session
	sessionObj.treeObject = newTreeObject;
	sessionObj.gallery = {};

	updateGraphs();
}

function addGallery(sessionObj, userIx, galleryIx) {
	// Tree
	if (sessionObj.treeObject.contents == null) {
		sessionObj.treeObject.contents = [];
	}

	var newTreeObject = {};
	newTreeObject.id = generateUID();
	newTreeObject.name = data[userIx].galleries[galleryIx].gallery.name;
	newTreeObject.type = data[userIx].galleries[galleryIx].gallery.type;
	newTreeObject.contents = [];

	sessionObj.treeObject.contents.push(newTreeObject);

	// Memory
	var newMemObject = {};
	newMemObject.id = newTreeObject.id;
	newMemObject.treeObject = newTreeObject;
	memory.eden.push(newMemObject);

	// Session
	sessionObj.gallery.treeObject = newTreeObject;
	sessionObj.gallery.images = [];

	updateGraphs();
}

function addNextImage(galleryObject, userIx, galleryIx) {
	galleryObject.imageIx = (galleryObject.imageIx == null || galleryObject.imageIx == 'undefined') ? 0 : (galleryObject.imageIx + 1) % 9;
	addImage(galleryObject, userIx, galleryIx, galleryObject.imageIx);
}

function addImage(galleryObject, userIx, galleryIx, imageIx) {
	// Tree
	if (galleryObject.treeObject.contents == null) {
		galleryObject.treeObject.contents = [];
	}

	if (galleryObject.images == null) {
		galleryObject.images = [];
	}

	var newTreeObject = {};
	newTreeObject.id = generateUID();
	newTreeObject.name = data[userIx].galleries[galleryIx].images[imageIx].name;
	newTreeObject.type = "image";

	galleryObject.treeObject.contents.push(newTreeObject);

	// Memory
	var newMemObject = {};
	newMemObject.id = newTreeObject.id;
	newMemObject.treeObject = newTreeObject;
	memory.eden.push(newMemObject);

	// Session
	var newSessionObject = {};
	newSessionObject.id = newTreeObject.id;
	newSessionObject.treeObject = newTreeObject;
	galleryObject.images.push(newSessionObject);

	updateGraphs();
}

function deleteImage(galleryObject, imageId) {
	for(var i = 0; i < galleryObject.images.length; i++) {
		if(galleryObject.images[i].id == imageId) {
			galleryObject.images[i].treeObject.deleted = true;
			galleryObject.images.splice(i, 1);
		}
	}

	updateGraphs();
}


function logout(sessionObject) {
	sessionObject.treeObject.deleted = true;
	sessionObject.treeObject = {};

	sessionObject.gallery = {};
	sessionObject.gallery.images = [];

	updateGraphs();
}



function generateUID() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    	return v.toString(16);
	});
}