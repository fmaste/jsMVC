jsMVC.Class({
	className: "person.Person",				// TODO: The package part must be set when loaded!, Use jQuery's getScript!
	parentName: ""
},function() {

	// TODO: Create private properties. 
	// Either using 
	//		"var firstName = undefined;"
	// or
	// 		creating a object that can only be accessed in this scope and set the properties/methods there.
	this.email = undefined;
	this.firstName = undefined;
	this.lastName = undefined;

	this.init = function (email, firstName, lastName) {
		this.email = email;
		this.firstName = firstName;
		this.lastName = lastName;
	}

	this.getEmail = function () {
		return this.email;
	}

	this.getFirstName = function () {
		return this.firstName;
	}

	this.getLastName = function () {
		return this.lastName;
	}

	this.setEmail = function (email) {
		this.email = email;
	}

	this.setFirstName = function (firstName) {
		this.firstName = firstName;
	}

	this.setLastName = function (lastName) {
		this.lastName = lastName;
	}

});
