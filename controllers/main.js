jsMVC.controller.view.Class({
	className: "main",				// Need to use className, name may be used by some clients.
	parentName: "mainParent"		// Need to use parent because super is a reserved word.
},function() {

	this.init = function (num) {
		//alert("Class: " + this.className + "\nParentName: " + this.parentName + "\nViewName: " + this.viewName);
		//alert(this.className + ": Init with param " + num);
		//alert(this.className + ": parent property " + this.parent);
		//alert(this.className + ": __proto__ property " + this.__proto__);
		this.parent.init(-2);
	}

	this.getController = function (viewName) {
		return null;
	}

	this.getCounter = function () {
		//alert(this.className + ": getCounter(): " + this.counter);
		return this.counter + 1;
	}

	this.onLoad = function () {
		this.parent.onLoad();
	}

	this.renderSubviews = function () {
	}

	this.dependencies = function () {
	}

	this.attachCallbacks = function () {
	}

});
