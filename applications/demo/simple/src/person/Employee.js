jsMVC.Class({
	className: "person.Employee",				// TODO: The package part must be set when loaded!, Use jQuery's loadScript!
	parentName: "person.Person"					// TODO: Look for the class in this package, if not found, the parent package and so on.
},function() {								// TODO: Parent as a paramater here, so we can do parent.something instead of this.parent!!!!!

	this.salary = undefined;

	this.init = function (email, firstName, lastName, salary) {
		this.parent.init(email, firstName, lastName);
		this.salary = salary;
	}

	this.getSalary = function () {
		return this.salary;
	}

	this.setSalary = function (salary) {
		this.salary = salary;
	}

});
