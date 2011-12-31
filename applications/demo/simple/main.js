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
		// Here I can dinamically add views to the application view! For example: decide to show a login view or a main view.
		jsMVC.render(this.view, "main", "main");
	}

});

