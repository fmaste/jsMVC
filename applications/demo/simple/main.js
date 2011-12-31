jsMVC.controller.application.Class({
	className: "main"
},function() {

	this.init = function () {
	}

	this.getTitle = function () {
		// This text will be used as page title.
		return "jsMVC";
	}

	this.getFavIcon = function () {
		// The file name of the favicon image.
		return "favicon.png";
	}

	this.getLanguageCode = function () {
		return "en-US";
	}

	this.getAvailableLanguageCodes = function () {
		//TODO
	}

	this.onLoad = function () {
		// Libs loaded, translations loaded, styles loaded, etc.
		// Here I can dinamically add views to the body! For example: decide to show a login view or a main view.
		jsMVC.render(this.view, "main", "main");
		// jQuery("#jsMVC").append('<div id="mainViewContainer1" class="jsMVC-view" data-jsMVC-view="main" data-jsMVC-style="main1,main2" style="display: inline; float: left;">');
		// View content from view "main.html" with controller "main.js "will be placed here.
		// Also styles main1.css and main2.css will be applied to the entire page.
	}

});

