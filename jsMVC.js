// Define the framework namespace.
var jsMVC = {};

// jQuery
// ****************************************************************************
// ****************************************************************************

// TODO: Include jQuery inlined here in noConflict mode.
$.noConflict();

// INIT
// ****************************************************************************
// ****************************************************************************

// The first function that must be called to start the framework.
jsMVC.init = function () {
	// TODO: ¿¿¿¿ Take the config from the application controller ????
	jsMVC.config.load().done(function() {
		var elemToIncludeApplication = jQuery("body");
		var applicationNameToInclude = jsMVC.controller.application.name;
		// TODO: Application constructor parameters!
		jsMVC.init.application(elemToIncludeApplication, applicationNameToInclude, []);
	}).fail(function (jqXHR, textStatus, errorThrown) {
		// TODO: Do visually something on config load fail.
		// The config load already shows an error message.
	});
};

// Loads and parses the default config, creates the application controller and calls the onLoad method of it when finished
// loading all the global translations, styles, etc. After that, containerSelector provided is parsed looking for views to include. 
// No translations happens on the containerSelector, translations must be inside a view.
// When finished rendering all the views the application's onViewsLoad method is called.
jsMVC.init.application = function (containerSelector, applicationName, constructorParameters) {
	jsMVC.controller.application.load(applicationName).done(function (application) {
		// Set the active applications to container. // TODO: Listen the onremove ??
		jQuery(containerSelector).data("data-jsMVC-application", application);
		// Call the application init method.
		jsMVC.classes.initInstance(application, constructorParameters);
		// Set html title.
		if (application.getTitle !== undefined && jQuery.isFunction(application.getTitle)) {
			jsMVC.document.setTitle(application.getTitle());
		} else if (application.title && typeof(application.title) === 'string') {
			jsMVC.document.setTitle(application.title);
		}
		// Set favicon.
		if (application.getFavIcon !== undefined && jQuery.isFunction(application.getFavIcon)) {
			jsMVC.document.setFavIcon(application.getFavIcon());
		} else if (application.favIcon && typeof(application.favIcon) === 'string') {
			jsMVC.document.setFavIcon(application.favIcon);
		}
		// Set the document language code.
		if (application.getLanguageCode !== undefined && jQuery.isFunction(application.getLanguageCode)) {
			jsMVC.document.setLanguageCode(application.getLanguageCode());
		} else if (application.languageCode && typeof(application.languageCode) === 'string') {
			jsMVC.document.setLanguageCode(application.languageCode);
		}
		// Call the application onLoad method.
		if (application.onLoad !== undefined  && jQuery.isFunction(application.onLoad)) {
			application.onLoad();
		}
		// Render all the views.
		jsMVC.render(
			containerSelector
		).done(function (includedViews) {
			// Add all the views to the applications controller.
			for (var key in includedViews) {
				// TODO: includedViews[key].name; includedViews[key].selector;
			}
			// Call the application onViewsLoad method.
			if (application.onViewsLoad !== undefined  && jQuery.isFunction(application.onViewsLoad)) {
				application.onViewsLoad();
			}
		});
	}).fail(function (jqXHR, textStatus, errorThrown) {
		// TODO: Do visually something on application load fail.
	});
};

// Packages
// ****************************************************************************
// ****************************************************************************

jsMVC.error = {};					// Log functions.
jsMVC.config = {};					// Load and parse the configuration file.
jsMVC.utils = {};					// Utility functions.
jsMVC.document = {};				// Utilities to alter the DOM.
jsMVC.model = {};					// Action requests to the server.
jsMVC.view = {};					// Load views.
jsMVC.style = {};					// Load styles.
jsMVC.image = {};					// Load image.
jsMVC.translation = {};				// Translation functions.
jsMVC.library = {};					// Load javascripts.
jsMVC.classes = {};					// Loading and creating classes with its parents, etc.
jsMVC.source = {};					// Load and create user created classes.
jsMVC.controller = {};				// Controllers:
jsMVC.controller.application = {};	// 		Load and create application controllers (Class).
jsMVC.controller.view = {};			// 		Load and create view controllers (Class).
jsMVC.social = {};					// Social plugins:
jsMVC.social.facebook = {};			// 		Facebook functions and helpers.

// ERROR
// ****************************************************************************
// ****************************************************************************

// Error logging function.
// Use this function to log errors or messages, doing so, later we could easily improve all the logs.
// This function can be overrided by the developer as needed.
jsMVC.error.log = function (msg) {
	alert(msg);
};

// CONFIG
// ****************************************************************************
// ****************************************************************************

// Debug mode on or off.
jsMVC.config.debug = false;

// Where to find the config file.
jsMVC.config.uri = "config.json";

// The main URI prefix.
jsMVC.config.prefix = "";

// The main URI suffix.
jsMVC.config.suffix = "";

// Fetchs the config file and parses it (if no error on the json file).
jsMVC.config.load = function () {
	var deferred = jQuery.Deferred();
	jQuery.ajax({
		url: jsMVC.config.uri, 
		dataType: "json", // Evaluates as JSON and returns a JavaScript object. Any malformed JSON is rejected and a parse error is thrown.
		success: function (jsonConfig) {
			jsMVC.config.parse(jsonConfig).done(function () {
				deferred.resolve();
			}).fail(function () {
				// TODO: Parse failed!
				deferred.reject(null, "parsererror", null);
			});
		},
		error: function (jqXHR, textStatus, errorThrown) {
			if (textStatus === "parsererror") {
				jsMVC.error.log("Config parse error");
			} else {
				jsMVC.error.log("Config not loaded (" + errorThrown + ")");
			}
			deferred.reject(jqXHR, textStatus, errorThrown);
		}
	});
	return deferred.promise();
};

// Parse the config file and set the framework constants.
// The jsonConfig variable was already validated by the load function and is a valid json encoded javascript object.
jsMVC.config.parse = function (jsonConfig) {
	var dynamicWhen = new jsMVC.utils.DynamicWhen();
	/*** Start parsing the things thay may be a depency for ALL the rest. ***/
	// Debug mode.	
	if (jsonConfig.debug !== undefined) {
		jsMVC.config.debug = jsonConfig.debug;
	}
	// Main uri prefix.
	if (jsonConfig.prefix !== undefined) {
		jsMVC.config.prefix = jsonConfig.prefix;
	}
	// Main uri suffix.
	if (jsonConfig.suffix !== undefined) {
		jsMVC.config.suffix = jsonConfig.suffix;
	}
	/*** Them parse first the things that may need to start downloading something. ***/
	// Style
	if (jsonConfig.style) {
		var styleConfig = jsonConfig.style;
		// Prefix
		if (styleConfig.prefix) {
			jsMVC.style.prefix = styleConfig.prefix;
		}
		// Suffix
		if (styleConfig.suffix) {
			jsMVC.style.suffix = styleConfig.suffix;
		}
		// Globals
		if (styleConfig.globals && jQuery.isArray(styleConfig.globals)) {
			for (var key in styleConfig.globals) {
				// TODO: Use dynamic when!!
				jsMVC.style.load(styleConfig.globals[key]);
			}
		}
	}
	// Libraries
	if (jsonConfig.library) {
		var libraryConfig = jsonConfig.library;
		// Local
		if (libraryConfig.local) {
			var localConfig = libraryConfig.local;
			// Prefix
			if (localConfig.prefix) {
				jsMVC.library.prefix = localConfig.prefix;
			}
			// Files
			if (localConfig.files && jQuery.isArray(localConfig.files)) {
				var files = localConfig.files;
				for (var key in files) {
					dynamicWhen.addDeferred(
						jsMVC.library.load(jsMVC.config.prefix + jsMVC.library.prefix + "/" + files[key])
					);
				}
			}
		}
		// External
		if (libraryConfig.external) {
			var externalConfig = libraryConfig.external;
			// Sources
			if (externalConfig.sources && jQuery.isArray(externalConfig.sources)) {
				var sources = externalConfig.sources;
				for (var key in sources) {
					dynamicWhen.addDeferred(
						jsMVC.library.load(sources[key])
					);
				}
			}
		}
	}
	// Translation
	if (jsonConfig.translation) {
		var translationConfig = jsonConfig.translation;
		// Prefix
		if (translationConfig.prefix) {
			jsMVC.translation.prefix = translationConfig.prefix;
		}
		// Suffix
		if (translationConfig.suffix) {
			jsMVC.translation.suffix = translationConfig.suffix;
		}
		// Globals
		if (translationConfig.globals && jQuery.isArray(translationConfig.globals)) {
			var globalTranslations = translationConfig.globals;
			for (var key in globalTranslations) {
				// TODO: Use dynamic when!!
				// TODO: Set an onFinishCallback!!!!!!!!!!!
				jsMVC.translation.addToMain(globalTranslations[key]);
			}
		}
	}
	/*** Continue parsing the rest of the config in order. ***/
	// Model
	if (jsonConfig.model) {
		// TODO: Model
	}
	// View
	if (jsonConfig.view) {
		var viewConfig = jsonConfig.view;
		// Prefix
		if (viewConfig.prefix) {
			jsMVC.view.prefix = viewConfig.prefix;
		}
		// Suffix
		if (viewConfig.suffix) {
			jsMVC.view.suffix = viewConfig.suffix;
		}
		// Delay min.
		if (viewConfig.delayMin) {
			jsMVC.view.delayMin = viewConfig.delayMin;
		}
		// Delay max.
		if (viewConfig.delayMax) {
			jsMVC.view.delayMax = viewConfig.delayMax;
		}
	}
	// Image
	if (jsonConfig.image) {
		var imageConfig = jsonConfig.image;
		// Prefix
		if (imageConfig.prefix) {
			jsMVC.image.prefix = imageConfig.prefix;
		}
		// Suffix
		if (imageConfig.suffix) {
			jsMVC.image.suffix = imageConfig.suffix;
		}
		// Delay min.
		if (imageConfig.delayMin) {
			jsMVC.image.delayMin = imageConfig.delayMin;
		}
		// Delay max.
		if (imageConfig.delayMax) {
			jsMVC.image.delayMax = imageConfig.delayMax;
		}
	}
	// Source
	if (jsonConfig.source) {
		var sourceConfig = jsonConfig.source;
		// Prefix
		if (sourceConfig.prefix) {
			jsMVC.source.prefix = sourceConfig.prefix;
		}
		// Suffix
		if (sourceConfig.suffix) {
			jsMVC.source.suffix = sourceConfig.suffix;
		}
	}
	// Controller
	if (jsonConfig.controller) {
		var controllerConfig = jsonConfig.controller;
		// Application
		if (controllerConfig.application) {
			var applicationConfig = controllerConfig.application;
			// Name
			if (applicationConfig.name) {
				jsMVC.controller.application.name = applicationConfig.name;
			}
			// Prefix
			if (applicationConfig.prefix) {
				jsMVC.controller.application.prefix = applicationConfig.prefix;
			}
			// Suffix
			if (applicationConfig.suffix) {
				jsMVC.controller.application.suffix = applicationConfig.suffix;
			}
			// Delay min.
			if (applicationConfig.delayMin) {
				jsMVC.controller.application.delayMin = applicationConfig.delayMin;
			}
			// Delay max.
			if (applicationConfig.delayMax) {
				jsMVC.controller.application.delayMax = applicationConfig.delayMax;
			}
		}
		// View
		if (controllerConfig.view) {
			var viewConfig = controllerConfig.view;
			// Prefix
			if (viewConfig.prefix) {
				jsMVC.controller.view.prefix = viewConfig.prefix;
			}
			// Suffix
			if (viewConfig.suffix) {
				jsMVC.controller.view.suffix = viewConfig.suffix;
			}
			// Delay min.
			if (viewConfig.delayMin) {
				jsMVC.controller.view.delayMin = viewConfig.delayMin;
			}
			// Delay max.
			if (viewConfig.delayMax) {
				jsMVC.controller.view.delayMax = viewConfig.delayMax;
			}
		}
	}
	// Social
	if (jsonConfig.social) {
		var socialConfig = jsonConfig.social;
		// FaceBook
		if (socialConfig.facebook) {
			var facebookConfig = socialConfig.facebook;
			// AppId
			if (facebookConfig.appId) {
				var appId = facebookConfig.appId;
				// TODO: Parse the other FB.init params
				// "cookie": false,
				// "logging": true,
				// "session": null,
				// "status": true,
				// "xfbml": false,
				// "channelUrl": null
				// TODO: Use the autoLoad property jsMVC.social.facebook.init(appId);
			}
			// TODO: AUTOLOAD
		}
	}
	return dynamicWhen.getWhen();
};

// UTILS
// ****************************************************************************
// ****************************************************************************

jsMVC.utils.createRandomNumber = function (min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
};

jsMVC.utils.createRandomString = function (length) {
	var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
	var randomstring = '';
	for (var i = 0; i < length; i++) {
		var rnum = Math.floor(Math.random() * chars.length);
		randomstring += chars.substring(rnum, rnum+1);
	}
	return randomstring;
};

// Allows to add deferreds to a deferred and then get a deferred that waits for all of them.
jsMVC.utils.DynamicWhen = function () {
	var when = undefined;

	this.addDeferred = function (deferred) {
		if (when === undefined) {
			when = jQuery.when(deferred);
		} else {
			when = jQuery.when(when, deferred);
		}
	};

	this.getWhen = function () {
		if (when === undefined) {
			return jQuery.when(null);  // A when that is resolved by default.
		} else {
			return when;
		}
	};

};

// DOCUMENT
// ****************************************************************************
// ****************************************************************************

jsMVC.document.createRandomId = function () {
	var length = 16;
	var randomId = jsMVC.utils.createRandomString(length);
	while (jQuery('#' + randomId).length !== 0) {
		randomId = jsMVC.utils.createRandomString(length);
	}
	return randomId;
};

jsMVC.document.clearTitle = function () {
	// jQuery('title').html() hungs the browser on IE6
	document.title = "";
};

jsMVC.document.setTitle = function (title) {
	// jQuery('title').html() hungs the browser on IE6
	if (typeof(title) === 'string') {
		document.title = title;
	}
};

jsMVC.document.getTitle = function () {
	// jQuery('title').html() hungs the browser on IE6
	return document.title;
};

jsMVC.document.removeFavIconTag = function () {
	jQuery('head link[rel~="icon"]').remove();
	jQuery('head link[rel~="shortcut"]').remove();
};

jsMVC.document.clearFavIcon = function () {
	// DOES NOT WORK ON CHROME AT LEAST!!!!!
	jsMVC.document.removeFavIconTag();
	jQuery('head').append('<link rel="shortcut icon" href=""></link>');
};

jsMVC.document.setFavIcon = function (imageFile) {
	// DOES NOT WORK ON CHROME AT LEAST!!!!!
	jsMVC.document.removeFavIconTag();
	if (typeof(imageFile) === 'string') {
		jQuery('head').append('<link rel="shortcut icon" href="' + jsMVC.image.getUri(imageFile) + '"></link>');
	}
};

jsMVC.document.setLanguageCode = function (languageCode) {
	if (typeof(languageCode) === 'string') {
		jQuery("html").attr("lang", languageCode);
		jQuery("html").attr("xml:lang", languageCode);
	}
};

jsMVC.document.translate = function (languageCode) {
	if (typeof(languageCode) === 'string') {
		jsMVC.document.setLanguageCode(languageCode);
		// TODO: Translate all tags!!!
	}
};

// MODEL
// ****************************************************************************
// ****************************************************************************


// TODO TODO TODO TODO


// VIEW
// ****************************************************************************
// ****************************************************************************

// The path prefix to get the server files.
// Can be overrided with the config file.
jsMVC.view.prefix = "views";

// The path suffix to get the server files.
// Can be overrided with the config file.
jsMVC.view.suffix = ".html";

// Get the URI of the view. Names are treated as java packages (main.footer.Legal is main/footer/Legal.html).
jsMVC.view.getUri = function (viewName) {
	return jsMVC.config.prefix + 
		jsMVC.view.prefix + 
		"/" + 
		viewName.replace(".", "/") + 
		jsMVC.view.suffix + 
		jsMVC.config.suffix;
};

// The deferrs of the views that are downloading or downloaded.
jsMVC.view.queue = {};

// An optional extra delay to use when debugging.
// Can be overrided with the config file.
jsMVC.view.delayMin = 0;
jsMVC.view.delayMax = 0;

// Load the view from the server and returns the raw view (String) as a parameter to the done callback of the returned deferred object.
// TODO: Allow to load HTML from a different server (cross domain). Maybe using an iframe, I don't know.
jsMVC.view.load = function (viewName) {
	// The deferred to return.
	var deferred = jQuery.Deferred();
	// Get the download deferred from the queue.
	var downloader = jsMVC.view.queue[viewName];
	// First time downloading ??
	if (downloader === undefined) {
		// Create the downloader.
		downloader = jQuery.ajax({
			url: jsMVC.view.getUri(viewName),
			dataType: "html", // Returns HTML as plain text; included script tags are evaluated when inserted in the DOM.
			success: function (stringView) {
			},
			error: function (jqXHR, textStatus, errorThrown) {
				// TODO: Clear queue ?
				// jsMVC.view.queue[viewName] = undefined;
				// TODO: Better error message. Use debug mode and apply styles, put a message when dbl click on the view, etc.
			}
		});
		// Fill the queue.
		jsMVC.view.queue[viewName] = downloader;
	}
	// On download done.
	downloader.done(function (stringView) {
		// If in debug mode add a delay to the request.
		if (jsMVC.config.debug) {
			setTimeout(
				function () {
					deferred.resolve(stringView);
				},
				jsMVC.utils.createRandomNumber(jsMVC.view.delayMin, jsMVC.view.delayMax)
			);
		} else {
			deferred.resolve(stringView);
		}
	});
	// On download fail.
	downloader.fail(function (jqXHR, textStatus, errorThrown) {
		deferred.reject(jqXHR, textStatus, errorThrown);
	});
	// Return the promise only.
	return deferred.promise();
};

// STYLE
// ****************************************************************************
// ****************************************************************************

// The path prefix to get the server files.
// Can be overrided with the config file.
jsMVC.style.prefix = "css";

// The path suffix to get the server files.
// Can be overrided with the config file.
jsMVC.style.suffix = ".css";

// Get the URI of the stylesheet. Names are treated as java packages (main.header.Border is main/header/Border.css).
jsMVC.style.getUri = function (styleName) {
	return jsMVC.config.prefix + 
		jsMVC.style.prefix + 
		"/" +
		styleName.replace('.', '/') + 
		jsMVC.style.suffix + 
		jsMVC.config.suffix;
};

// TODO: Use a cache ?

// TODO: Load the stylesheet asynchronically. As text, with an object or new Image().
jsMVC.style.load = function (styleName) {
	jQuery('head').append('<link rel="stylesheet" href="' + jsMVC.style.getUri(styleName) + '" type="textcss"></link>');
};

// IMAGE
// ****************************************************************************
// ****************************************************************************

// The path prefix to get the server files.
// Can be overrided with the config file.
jsMVC.image.prefix = "images";

// The path suffix to get the server files.
// Can be overrided with the config file.
jsMVC.image.suffix = "";

// Get the URI of the image file.
jsMVC.image.getUri = function (imageFile) {
	return jsMVC.config.prefix + 
		jsMVC.image.prefix +
		"/" + 
		imageFile.replace('.', '/') + 
		jsMVC.image.suffix + 
		jsMVC.config.suffix;
};

// The deferrs of the images that are downloading or downloaded.
jsMVC.image.queue = {};

// An optional extra delay to use when debugging.
// Can be overrided with the config file.
jsMVC.image.delayMin = 0;
jsMVC.image.delayMax = 0;

// http://developer.yahoo.com/yui/imageloader/
// http://jqueryfordesigners.com/image-loading/
// http://www.appelsiini.net/projects/lazyload
// http://wpleet.com/how-to-preload-an-image-using-jquery-javascript/
// Load the image from the server and returns the imageUri and image object as a parameter to the done callback of the returned deferred object.
jsMVC.image.load = function (imageUri) {
	// The deferred to return.
	var deferred = jQuery.Deferred();
	// Get the download deferred from the queue.
	var downloader = jsMVC.image.queue[imageUri];
	// First time downloading ??
	if (downloader === undefined) {
		// Create the downloader.
		downloader = jQuery.Deferred();
		var image = jQuery(new Image())
		.load(function () {
			downloader.resolve(imageUri, image);
		})
		.error(function () {
			downloader.reject(imageUri, image);
		})
		.attr("src", imageUri);
		// Fill the queue.
		jsMVC.image.queue[imageUri] = downloader;
	}
	// On download done.
	downloader.done(function (uri, image) {
		// If in debug mode add a delay to the request.
		if (jsMVC.config.debug) {
			setTimeout(
				function () {
					deferred.resolve(uri, image);
				},
				jsMVC.utils.createRandomNumber(jsMVC.image.delayMin, jsMVC.image.delayMax)
			);
		} else {
			deferred.resolve(uri, image);
		}
	});
	// On download fail.
	downloader.fail(function (uri, image) {
		deferred.reject(uri, image);
	});
	// Return the promise only.
	return deferred.promise();
};

// TRANSLATION
// ****************************************************************************
// ****************************************************************************

// The path prefix to get the server files.
// Can be overrided with the config file.
jsMVC.translation.prefix = "translations";

// The path suffix to get the server files.
// Can be overrided with the config file.
jsMVC.translation.suffix = ".json";

// Get the URI of the translationName class. Names are treated as java packages (person.Employee is person/Employee.json).
jsMVC.translation.getUri = function (translationName) {
	return jsMVC.config.prefix + 
		jsMVC.translation.prefix + 
		"/" +
		translationName.replace(".", "/") + 
		jsMVC.translation.suffix + 
		jsMVC.config.suffix;
};

// The main translation object, generated with all the global translations
jsMVC.translation.main = {};

// Translation files indexed by name.
jsMVC.translation.cache = {};

// Loads the translation json file and call the callback with the javascript object as its only parameter.
jsMVC.translation.load = function (translationName, onSuccessCallback) {
	var jsonTranslation = jsMVC.translation.cache[translationName];	
	if (jsonTranslation !== undefined) {
		if (onSuccessCallback !== undefined && jQuery.isFunction(onSuccessCallback)) {
			onSuccessCallback(jsonTranslation);
		}
		return null; // To use with a deferred, evalutes to ready.
	} else {
		return jQuery.ajax({	// Returns a deferred.
			url: jsMVC.translation.getUri(translationName), 
			dataType: "json", // Evaluates as JSON and returns a JavaScript object. Any malformed JSON is rejected and a parse error is thrown.
			success: function (jsonTranslation) {				
				jsMVC.translation.cache[translationName] = jsonTranslation;
				if (onSuccessCallback !== undefined && jQuery.isFunction(onSuccessCallback)) {
					onSuccessCallback(jsonTranslation);
				}
			},
			error: function (a, err, c) {
				if (err === "parsererror") {
					jsMVC.error.log("Translation " + translationName + " parse error");
				} else {
					jsMVC.error.log("Translation " + translationName + " not loaded (" + c + ")");
				}
			}
		});
	}
};

// Ads every property found on the loaded file to the main translation file.
jsMVC.translation.addToMain = function (translationName, onFinishCallback) {
	jsMVC.translation.load(
		translationName, 
		function (jsonTranslation) {
			for (var key in jsonTranslation) {
				jsMVC.translation.main[key] = jsonTranslation[key];
			}
			if (onFinishCallback !== undefined && jQuery.isFunction(onFinishCallback)) {
				onFinishCallback();
			}
		}
	);
};

// LIBRARY
// ****************************************************************************
// ****************************************************************************

// The path prefix to get the server files.
// Can be overrided with the config file.
jsMVC.library.prefix = "lib";

// TODO: suffix

// TODO: getUri

// The deferrs of the views that are downloading or downloaded.
jsMVC.library.queue = {};

// An optional extra delay to use when debugging.
// Can be overrided with the config file.
jsMVC.library.delayMin = 0;
jsMVC.library.delayMax = 0;

// Load and execute a script, returns a deferred object. If the second parameter is True the execution is blocking!
// TODO: Separate download from execution, see controlJS, from Steve Souders website.
// When a script is added the browser blocks until it is downloaded, parsed and ran.
// It part of the specification to avoid dependency conclicts.
// jQuery('head').append('<script type="text/javascript" src="' + scriptUri + '"></script>');
jsMVC.library.load = function (scriptUri, sync) {
	// The deferred to return.
	var deferred = jQuery.Deferred();
	// Get the download deferred from the queue.
	var downloader = jsMVC.library.queue[scriptUri];
	// First time downloading ??
	if (downloader === undefined) {
		// Create the downloader.
		downloader = jQuery.ajax({
			url: scriptUri,
			async: sync ? false : true,
			dataType: 'script',
			success: function (stringScript) {
			},
			error: function (jqXHR, textStatus, errorThrown) {
			}
		});
		// Fill the queue.
		jsMVC.library.queue[scriptUri] = downloader;
	}
	// On download done.
	downloader.done(function (stringScript) {
		if (jsMVC.config.debug && !sync) {
			setTimeout(
				function () {
					deferred.resolve(stringScript);
				},
				Math.floor(Math.random()*(jsMVC.library.delayMax - jsMVC.library.delayMin)) + jsMVC.library.delayMin
			);
		} else {
			deferred.resolve(stringScript);
		}
	});
	// On download fail.
	downloader.fail(function (jqXHR, textStatus, errorThrown) {
		deferred.reject(jqXHR, textStatus, errorThrown);
	});
	// Return the promise only.
	return deferred.promise();
};

// CLASSES
// ****************************************************************************
// ****************************************************************************

// Given a class name, a cache and a function to generate the file URI it instantiates a new object.
// When the javascript is loaded with jsMVC.library.load, the loaded class must appear on the cache.
jsMVC.classes.createNewInstance = function (className, cache, fileUriGeneratorFunction, sync) {
	var loadingDeferred = null;
	if (cache[className] === undefined) {
		// The loaded scripts are a function call that add something to the cache!
		loadingDeferred = jsMVC.library.load(fileUriGeneratorFunction(className), sync);
	}
	var deferred = jQuery.Deferred();
	var loadingWhen = jQuery.when(loadingDeferred);
	loadingWhen.done(function () {
		var classDefinition = cache[className];
		var classMetadata = classDefinition.classMetadata;
		var classConstructor = classDefinition.classConstructor;
		if (classMetadata.parentName) {
			// Resolve with parent.
			var parentDeferred = jsMVC.classes.createNewInstance(classMetadata.parentName, cache, fileUriGeneratorFunction, sync);
			parentDeferred.done(function (parentInstance) {
				classConstructor.prototype = parentInstance;
				var instance = jsMVC.classes.createNewObject(classConstructor, className, classMetadata.parentName, parentInstance);
				deferred.resolve(instance);
			});
			parentDeferred.fail(function () {
				deferred.reject(a, err, c);
			});
		} else {
			// Resolve without parent.
			var instance = jsMVC.classes.createNewObject(classConstructor, className, null, null);
			deferred.resolve(instance);
		}
	});
	loadingWhen.fail(function (a, err, c) {
		deferred.reject(a, err, c);
	});
	return deferred.promise();
};

jsMVC.classes.createNewObject = function (classConstructor, className, parentName, parentInstance) {
	// TODO: Add parent as a constructor parameter, to allow parent access as "parent" instead of "this.parent".
	var myClass = new classConstructor();
	myClass.className = className;
	myClass.parentName = parentName ? parentName : undefined;
	myClass.parent = parentName ? parentInstance : undefined;
	return myClass;
}

// Call the instance init method with the provided parameters array or single value.
jsMVC.classes.initInstance = function (instance, parameters) {
	if (instance.init && jQuery.isFunction(instance.init)) {
		if (parameters === undefined) {
			instance.init();
		} else {
			if (jQuery.isArray(parameters)) {
				instance.init.apply(instance, parameters);
			} else {
				instance.init.apply(instance, [parameters]);
			}
		}
	}
};

// SOURCE
// ****************************************************************************
// ****************************************************************************

// The path prefix to get the server files.
// Can be overrided with the config file.
jsMVC.source.prefix = "src";

// The path suffix to get the server files.
// Can be overrided with the config file.
jsMVC.source.suffix = ".js";

// Get the URI of the source class. Names are treated as java packages (person.Employee is person/Employee.js).
jsMVC.source.getUri = function (className) {
	return jsMVC.config.prefix + 
		jsMVC.source.prefix + 
		"/" +
		className.replace(".", "/") + 
		jsMVC.source.suffix + 
		jsMVC.config.suffix;
};

// The classes indexed by name.
jsMVC.source.cache = {};

// Function use on the source files to instance a new object.
jsMVC.New = function (className, initParams) {
	var obj = null;
	var deferred = jsMVC.classes.createNewInstance(className, jsMVC.source.cache, jsMVC.source.getUri, true);
	// The requests are synchronous.
	deferred.then(function (instance) {
		obj = instance;
	});
	jsMVC.classes.initInstance(obj, initParams);
	return obj;
};

// Function use on the source files to define a new class.
jsMVC.Class = function (classMetadata, classConstructor) {
	jsMVC.source.cache[classMetadata.className] = {
		"classMetadata": classMetadata,
		"classConstructor": classConstructor
	};
};

// APPLICATION CONTROLLER
// ****************************************************************************
// ****************************************************************************

// The application to load on init.
jsMVC.controller.application.name = "";

// The path prefix to get the server files.
// Can be overrided with the config file.
jsMVC.controller.application.prefix = "";

// The path suffix to get the server files.
// Can be overrided with the config file.
jsMVC.controller.application.suffix = ".js";

// Get the URI of the controller class. Names are treated as java packages (person.Employee is person/Employee.js).
jsMVC.controller.application.getUri = function (applicationName) {
	return jsMVC.config.prefix + 
		jsMVC.controller.application.prefix + 
		"/" +
		applicationName.replace(".", "/") + 
		jsMVC.controller.application.suffix + 
		jsMVC.config.suffix;
};

// Controllers indexed by controller name.
jsMVC.controller.application.cache = {};

// An optional extra delay to use when debugging.
// Can be overrided with the config file.
jsMVC.controller.application.delayMin = 0;
jsMVC.controller.application.delayMax = 0;

// Load the controller from the server and returns the controller object as a parameter to the done callback of the returned deferred object.
jsMVC.controller.application.load = function (applicationName) {
	// The deferred to return.
	var deferred = jQuery.Deferred();
	// Start downloading the controller.
	var controllerDeferred = jsMVC.classes.createNewInstance(applicationName, jsMVC.controller.application.cache, jsMVC.controller.application.getUri);
	// On controller done.
	controllerDeferred.done(function (controller) {
		// If in debug mode add a delay to the request.
		if (jsMVC.config.debug) {
			setTimeout(
				function () {
					deferred.resolve(controller);
				},
				jsMVC.utils.createRandomNumber(jsMVC.controller.application.delayMin, jsMVC.controller.application.delayMax)
			);
		} else {
			deferred.resolve(controller);
		}
	});
	// On controller fail.
	controllerDeferred.fail(function (jqXHR, textStatus, errorThrown) {
		deferred.reject(jqXHR, textStatus, errorThrown);
	});
	// Return the promise only.
	return deferred.promise();
};

// Function use on the source files to define a new class.
jsMVC.controller.application.Class = function (classMetadata, classConstructor) {
	jsMVC.controller.application.cache[classMetadata.className] = {
		"classMetadata": classMetadata,
		"classConstructor": classConstructor
	};
};

// VIEW CONTROLLERS
// ****************************************************************************
// ****************************************************************************

// The path prefix to get the server files.
// Can be overrided with the config file.
jsMVC.controller.view.prefix = "controllers";

// The path suffix to get the server files.
// Can be overrided with the config file.
jsMVC.controller.view.suffix = ".js";

// Get the URI of the controller class. Names are treated as java packages (person.Employee is person/Employee.js).
jsMVC.controller.view.getUri = function (controllerName) {
	return jsMVC.config.prefix + 
		jsMVC.controller.view.prefix + 
		"/" +
		controllerName.replace(".", "/") + 
		jsMVC.controller.view.suffix + 
		jsMVC.config.suffix;
};

// Controllers indexed by controller name.
jsMVC.controller.view.cache = {};

// An optional extra delay to use when debugging.
// Can be overrided with the config file.
jsMVC.controller.view.delayMin = 0;
jsMVC.controller.view.delayMax = 0;

// Load the controller from the server and returns the controller object as a parameter to the done callback of the returned deferred object.
// TODO: What about this: var controller = new controllerConstructor(jQuery,jQuery);!!!!!!!!!!!!!!!!!
jsMVC.controller.view.load = function (controllerName) {
	// The deferred to return.
	var deferred = jQuery.Deferred();
	// Start downloading the controller.
	var controllerDeferred = jsMVC.classes.createNewInstance(controllerName, jsMVC.controller.view.cache, jsMVC.controller.view.getUri);
	// On controller done.
	controllerDeferred.done(function (controller) {
		// If in debug mode add a delay to the request.
		if (jsMVC.config.debug) {
			setTimeout(
				function () {
					deferred.resolve(controller);
				},
				jsMVC.utils.createRandomNumber(jsMVC.controller.view.delayMin, jsMVC.controller.view.delayMax)
			);
		} else {
			deferred.resolve(controller);
		}
	});
	// On controller fail.
	controllerDeferred.fail(function (jqXHR, textStatus, errorThrown) {
		deferred.reject(jqXHR, textStatus, errorThrown);
	});
	// Return the promise only.
	return deferred.promise();
};

// Function use on the source files to define a new class.
jsMVC.controller.view.Class = function (classMetadata, classConstructor) {
	jsMVC.controller.view.cache[classMetadata.className] = {
		"classMetadata": classMetadata,
		"classConstructor": classConstructor
	};
};

// SOCIAL
// ****************************************************************************
// ****************************************************************************

// FACEBOOK
// ----------------------------------------------------------------------------

jsMVC.social.facebook.config = {};

jsMVC.social.facebook.init = function (appId) {
	// See: http://developers.facebook.com/docs/reference/javascript/FB.init
	jQuery('body').append('<div id="fb-root"></div>');
	jQuery('body').append(
		'<script>' +
			'window.fbAsyncInit = function() {' +
				'FB.init({appId: "' + appId + '", status: true, cookie: true,xfbml: true});' +
			'};' +
			'(function() {' +
				'var e = document.createElement("script"); e.async = true;' +
				'e.src = document.location.protocol + "//connect.facebook.net/en_US/all.js";' +
				'document.getElementById("fb-root").appendChild(e);' +
			'}());' +
		'</script>'
	);
};

// RENDER
// ****************************************************************************
// ****************************************************************************

// Returns a deferred that resolves with an array of the processed first level views.
jsMVC.render = function (viewContainerSelector) {
	// The deferred to return.
	var deferred = jQuery.Deferred();
	// The inner views deferred processors.
	var deferredArray = [];
	// Render every view thas is founded on viewContainerSelector.
	var viewsToInclude = jsMVC.render.getViewsToInclude(viewContainerSelector, function (innerViewContainerSelector, innerViewName) {
		// Start processing the inner view.
		var viewDeferred = jsMVC.render.processView(innerViewContainerSelector, innerViewName);
		// Add it to the deferred queue.
		deferredArray.push(viewDeferred);
	});
	// Wait for all processors.
	jQuery.when.apply(jQuery, deferredArray).done(function () {
		// Resolve with an array of {selector, name} objects.
		deferred.resolve(viewsToInclude);
	});
	// Return the promise only.
	return deferred.promise();
};

jsMVC.render.processView = function (viewContainerSelector, viewName) {
	// The deferred to return.
	var deferred = jQuery.Deferred();
	// Put a temporal "loading" view using a spinner.
	jQuery(viewContainerSelector).html('<img src="' + jsMVC.image.getUri("spinner.gif") + '" style="display: block; text-align: center;"/>');
	// Start downloading the needed view.
	var viewDeferred = jsMVC.render.getViewDeferred(viewName);
	// Deferred for this view subviews.
	var subviewsDeferred = jQuery.Deferred();
	// Load the needed view controller in parallel.
	var controllerDeferred = jsMVC.render.getViewControllerDeferred(viewName);
	// As soon as the view is ready show it and start rendering its subviews.
	viewDeferred.done(function (viewString) {
		// The view string was edited and every img tag was replaced with a placeholder to change the download technique.
		jsMVC.render.includeView(viewContainerSelector, viewString);
		// Disable view until controller is ready.
		jQuery(viewContainerSelector).fadeTo("slow", 0.5);
		// After inserting into the DOM start downloading the images asynchronously in parrallel.
		jsMVC.render.loadImages(viewContainerSelector);
		// Now start showing its subviews.
		jsMVC.render(viewContainerSelector).then(function (includedViews) {
			// When the subviews are show resolve its deferred.
			subviewsDeferred.resolve(includedViews);
		});
	});
	// As soon as the controller is ready call the constructor.
	controllerDeferred.done(function (controller) {
		// Call the controller constructor.
		var controllerConstructorParameters = [];
		jsMVC.classes.initInstance(controller, controllerConstructorParameters);
	});
	// Do something when view an controller are ready.
	jQuery.when(viewDeferred, controllerDeferred).done(function (viewString, controller) {
		// Link view and its controller.
		jsMVC.render.linkViewAndController(viewContainerSelector, viewName, controller);
	});
	// When controller, view and subviews are ready, resolve, link all together and call the onload method.
	jQuery.when(viewDeferred, subviewsDeferred, controllerDeferred).done(function (viewString, includedViews, controller) {
		// TODO: Link all the subviews with the view and controller.
		// Call the controller onload method.
		if (controller.onLoad !== undefined && jQuery.isFunction(controller.onLoad)) {
			// Only translations are images may be not loaded. All it parents and childs are already loaded.
			controller.onLoad();
		}
		// View is ready to be used.
		jQuery(viewContainerSelector).fadeTo("slow", 1);
		// Resolve the returned deferred when all is done.
		deferred.resolve();
	});
	// Allow the returned deferred to be resolved with the translations missing.
	viewDeferred.done(function (viewString) {
		// Translate view.
		jsMVC.render.getTranslationsToInclude(
			viewContainerSelector,
			function (elemToIncludeTranslation, translationNameToInclude) {
				// TODO: Get the language from somewhere!!!
				// TODO: Use the language code to set the lang HTML attribute.
				// TODO: Get translation object from the controller ??
				jsMVC.render.includeTranslation(elemToIncludeTranslation, jsMVC.translation.main[translationNameToInclude]);
			}
		);
	});
	// Return the promise only.
	return deferred.promise();
}

jsMVC.render.getViewDeferred = function (viewName) {
	var deferred = jQuery.Deferred();
	jsMVC.view.load(viewName)
	.done(function (viewString) {
		// When view is ready alter the image tags so they don't start downloading when inserted into the DOM.
		var editedViewString = jsMVC.render.alterImages(viewString);
		// Resolve the returned deferred with the edited view.
		deferred.resolve(editedViewString);
	})
	.fail(function (jqXHR, textStatus, errorThrown) {
		// TODO: Put an error view!!!!
		deferred.reject(jqXHR, textStatus, errorThrown);
	});
	return deferred.promise();
};

jsMVC.render.getViewControllerDeferred = function (viewName) {
	// TODO: The controller was found on the attribute data-jsMVC-controller. (HTML5 proof)
	// TODO: Allow to override the controllerName by asking the controller.
	// TODO: Call a parent controller method with elem, if it returns something use that as controllerName.
	// If there is no controller name, use the view name.
	var controllerName = viewName;
	return jsMVC.controller.view.load(controllerName);
};

jsMVC.render.linkViewAndController = function (viewContainerSelector, viewName, controller) {
	// Link controller with HTML node (using jQuery data).
	jQuery(viewContainerSelector).data("data-jsMVC-controller", controller);
	// Add references to the view in the controller and its parent chain.
	var parent = controller;
	while (parent !== undefined) {
		parent.view = jQuery(viewContainerSelector);
		parent.viewName = viewName;
		parent.viewContainerSelector = viewContainerSelector;
		var parent = parent.parent;
	}
	// TODO: Link controller with parent controller.
}

// Look for all the elements with a className equal to jsMVC-view and include the views inside them.
// Using a class name because document.getElementsByClassName should be the fastest way of finding this nodes. // TODO: Verify this!
// The view name is found on the attribute data-jsMVC-view. (HTML5 proof)
jsMVC.render.getViewsToInclude = function (viewContainerSelector, viewFoundCallback) {
	var viewsToInclude = [];
	jQuery(viewContainerSelector).find('.jsMVC-view').each(function () {
			var elemToIncludeView = jQuery(this);
			var viewNameToInclude = elemToIncludeView.attr("data-jsMVC-view");
			if (viewNameToInclude !== undefined) { // TODO: check isString
				if (viewFoundCallback !== undefined && jQuery.isFunction(viewFoundCallback)) {
					viewFoundCallback(elemToIncludeView, viewNameToInclude);
				}
				viewsToInclude.push({
					"selector": elemToIncludeView,
					"name": viewNameToInclude
				});
			} else {
				// TODO: Not too usefull message.
				var id = this.id;
				var tagName = this.nodeName;
				jsMVC.error.log("Tag " + tagName + (id ? " with id " + id : "") + " has no view name.");
			}
	});
	return viewsToInclude;
};

// Rename the "src" attribute to "data-jsMVC-scr" of each image on the provided string.
jsMVC.render.alterImages = function (viewString) {
	// Put the view inside a div so we can alter this dom fragment without including it on the document.
	// If this view is inserted to the dom the images will start loading.
	var view = jQuery("<div>" + viewString + "</div>", document);
	view.find('img').each(function () {
		var img = jQuery(this);
		img.attr("data-jsMVC-src", img.attr("src"));
		// img.removeAttr("src");
		// Put a temporary spinner.
		img.attr("src", jsMVC.image.getUri("spinner.gif"));
	});
	// Return the string content of the div.
	return view.html();
}

jsMVC.render.loadImages = function (viewContainerSelector) {
	// Now load every image asynchronously and simultaneosly.
	jQuery(viewContainerSelector).find('img').each(function () {
		var imgElement = jQuery(this);
		jsMVC.image.load(imgElement.attr("data-jsMVC-src"))
		.done(function (uri, image) {
			imgElement.attr("src", uri);
		})
		.fail(function (uri, image) {
		});
	});
}

jsMVC.render.includeView = function (viewContainerSelector, viewString) {
	jQuery(viewContainerSelector).html(viewString);
};

jsMVC.render.getStylesToInclude = function (viewContainerSelector, styleFoundCallback) {
	// TODO: Transform CSS to local CSS to this view.
	// TODO: See http://www.w3.org/Submission/1996/1/WD-jsss-960822
	// TODO: See http://en.wikipedia.org/wiki/JavaScript_Style_Sheets
};

jsMVC.render.includeStyle = function (translationContainerSelector, styleString) {
	// TODO
};

// Look for all the elements with a className equal to jsMVC-translation and add a traslation text inside them.
// Using a class name because document.getElementsByClassName should be the fastest way of finding this nodes. // TODO: Verify this!
// The key for the translation is found on the attribute data-jsMVC-translation. (HTML5 proof).
jsMVC.render.getTranslationsToInclude = function (viewContainerSelector, translationFoundCallback) {
	var translationsToInclude = [];
	jQuery(viewContainerSelector).find('.jsMVC-translation').each(function () {
			var elemToIncludeTranslation = jQuery(this);
			var translationNameToInclude = elemToIncludeTranslation.attr("data-jsMVC-translation");
			if (translationNameToInclude !== undefined) { // TODO: check isString
				if (translationFoundCallback !== undefined && jQuery.isFunction(translationFoundCallback)) {
					translationFoundCallback(elemToIncludeTranslation, translationNameToInclude);
				}
				translationsToInclude.push({
					"selector": elemToIncludeTranslation,
					"name": translationNameToInclude
				});
			} else {
				// TODO: Not too usefull message.
				var id = elemToIncludeTranslation.attr("id");
				var tagName = elemToIncludeTranslation[0].nodeName;
				jsMVC.error.log("Tag " + tagName + (id ? " with id " + id : "") + " has no translation key.");
			}
	});
	return translationsToInclude;
};

jsMVC.render.includeTranslation = function (translationContainerSelector, translationString) {
	jQuery(translationContainerSelector).html(translationString);
};
	
// UTILITIES
// ****************************************************************************
// ****************************************************************************

jsMVC.resetCaches = function () {
	jsMVC.config.cache = undefined;
	jsMVC.view.queue = {};
	jsMVC.controller.view.cache = {};
	jsMVC.model.cache = {};
};

// TODOs

// error(jqXHR, textStatus, errorThrown) Function
// A function to be called if the request fails. The function receives three arguments: The jqXHR (in jQuery 1.4.x, XMLHttpRequest) object, a string describing the type of error that occurred and an optional exception object, if one occurred. Possible values for the second argument (besides null) are "timeout", "error", "abort", and "parsererror". This is an Ajax Event. As of jQuery 1.5, the error setting can accept an array of functions. Each function will be called in turn. Note: This handler is not called for cross-domain script and JSONP requests.

// TODO: Try to be able to load the view from a different server (cross domain).
// With style="display:none" the object is not loaded
//var toAppend = '<object id="jsMVC-view-' + viewName + '" type="text/html" data="' + jsMVC.view.getUri(viewName) + '"></object>';
//var toAppend = '<object id="GOOGLE" type="text/html" data="http://www.google.com" onload="alert(12345)"></object>';
//jQuery('#jsMVC-views').append(toAppend);
//jQuery('#GOOGLE').load(function() {alert("Google")});
// Also can be done: jQuery('#jsMVC-views').append(<object id = "">);
// jQuery(Iframe ID).attr("type", "");
// jQuery(Iframe ID).attr("src", "");

// Testing Classes!!
//var employee = jsMVC.New("person.Employee", ["fmaste@gmail.com", "Fede", "Maste", 0]);
//alert("Salary 1: " + employee.getSalary());
//alert("Name 1: " + employee.getFirstName());
//employee.setFirstName("Fede2");
//employee.setSalary(99);
//alert("Salary 2: " + employee.getSalary());
//alert("Name 2: " + employee.getFirstName());

	// ------------------------------
	// Create ajQuery object that is context bounded to the view.
	//var viewJQuery = function(viewSelector) {
	//	return new jQuery.fn.init(viewSelector, selector);
	//}
	// Call the controller's onLoad method with the jQuery context bounded object.
	//var onloadFunctionCode = controller.onLoad.toString().substring(
	//	controller.onLoad.toString().indexOf("{") + 1,
	//	controller.onLoad.toString().lastIndexOf("}")
	//);
	//var onloadFunction = new Function ("jQuery", "jQuery", onloadFunctionCode);
	//onloadFunction.call(controller, viewJQuery, viewJQuery);
