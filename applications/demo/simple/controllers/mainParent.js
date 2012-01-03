jsMVC.controller.view.Class({
	className: "mainParent"
},function() {

	this.counter = 0;

	this.init = function (counter) {
		this.counter = counter;
	}

	this.onLoad = function () {
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
