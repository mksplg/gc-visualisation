var sessionData = {
    session1: {
        id: "1",
        gallery: []
    },
    session2: {
        id: "1",
        gallery: []
    }
};

function updateGalleries() {
    updateGallery("sessionData.session1.gallery", "gallery1", sessionData.session1.gallery);
    updateGallery("sessionData.session2.gallery", "gallery2", sessionData.session2.gallery);
}


function updateGallery(galleryObjectName, galleryId, gallery) {
	var galleryRoot = d3.select("#" + galleryId);

    if (!gallery.images) {
        gallery.images = [];
    }

	var images = galleryRoot.selectAll(".img")
    	.data(gallery.images, function(d) {
            return d.id;
        });

    images.enter().append("div")
    	.attr("id", function(d) {
    		return d.id;
    	})
    	.attr("class", "img")
        .each(function(d, i) {
            var g = d3.select(this);
            g.append("img")
            .attr("src", function(d) {
                return d.treeObject.name;
            })
            .attr("width", 60)
        	.attr("height", 40)
            g.append("div")
            .attr("class", "desc")
            .append("a")
            .attr("href", "#")
            .attr("onclick", "deleteImage(" + galleryObjectName + ", '" + d.id + "');")
            .text("Delete");
        });

    images.exit().remove();
}