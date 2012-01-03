jsMVC.controller.view.Class({
	className: "main",		// Need to use className, name may be used by some clients.
	parentName: "mainParent"	// Need to use parent because super is a reserved word.
},function() {

	this.init = function (num) {
		this.parent.init(-2);
	}

	this.onLoad = function () {
		this.parent.onLoad();
	}

	this.getCounter = function () {
		//alert(this.className + ": getCounter(): " + this.counter);
		return this.counter + 1;
	}

});
