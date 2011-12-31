jsMVC.controller.view.Class({
	className: "mainParent"
},function() {

	this.counter = 0;

	this.init = function (counter) {
		//alert("Class: " + this.className + "\nParentName: " + this.parentName + "\nViewName: " + this.viewName);
		//alert(this.className + ": Init with param " + counter);
		this.counter = counter;
	}

	this.onLoad = function () {
		jQuery("#firstName").val("CABEZON");
		this.view.find("#tdToHide").hide();
	}

	this.addToCounter = function(num) {
		this.counter += num;
	}

	this.getCounter = function() {
		alert(this.className + ": getCounter(): " + this.counter);
		return this.counter;
	}

});
