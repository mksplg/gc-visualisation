var sessionData = {
	session1: {},
	session2: {}
};


function login(sessionObj, newUserIx) {
	if (treeData.contents == null) {
		treeData.contents = [];
	}
	
	var newUserObject = {};
	newUserObject.id = generateUID();
	newUserObject.name = data[newUserIx].user.name;
	newUserObject.type = data[newUserIx].user.type;

	sessionObj.treeUserIx = treeData.contents.push(newUserObject) - 1;

	buildTree("#tree-container");
}

function addGallery(sessionObj, newUserIx, galleryIx) {
	if (treeData.contents[sessionObj.treeUserIx].contents == null) {
		treeData.contents[sessionObj.treeUserIx].contents = [];
	}

	var newGalleryObject = {};
	newGalleryObject.id = generateUID();
	newGalleryObject.name = data[newUserIx].galleries[galleryIx].gallery.name;
	newGalleryObject.type = data[newUserIx].galleries[galleryIx].gallery.type;

	treeData.contents[sessionObj.treeUserIx].contents.push(newGalleryObject);

	buildTree("#tree-container");
}

function addImage(sessionObj, newUserIx, galleryIx, imageIx) {
	if (treeData.contents[sessionObj.treeUserIx].contents[galleryIx].contents == null) {
		treeData.contents[sessionObj.treeUserIx].contents[galleryIx].contents = [];
	}

	var newImageObject = {};
	newImageObject.id = generateUID();
	newImageObject.name = data[newUserIx].galleries[galleryIx].images[imageIx].name;
	newImageObject.type = data[newUserIx].galleries[galleryIx].images[imageIx].type;

	treeData.contents[sessionObj.treeUserIx].contents[galleryIx].contents.push(newImageObject);

	buildTree("#tree-container");
}


function generateUID() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    	return v.toString(16);
	});
}