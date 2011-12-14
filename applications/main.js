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

	this.getMainView = function () {
		return "main";
	}

	this.getMainStyles = function () {
		return ["main1", "main2"];
	}

	this.getMainController = function () {
			return "main";
	}

	this.onLoad = function () {
		// Libs loaded, translations loaded, styles loaded, etc.
		// About to render all the views.
		// Here I can dinamically add views to the body! For example: decide to show a login view or a main view.
	}

	this.onViewsLoad = function () {
		// Finished rendering all the views.
	}

});

