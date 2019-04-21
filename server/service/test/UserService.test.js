const userService = require('./../UserService');

it('should initialize user', () => {
	var guy = userService.initUser("Dávid", "hesoyam");

	if (guy.name != "Dávid"){
		throw new Error("Expected Dávid, but got " + guy.name);
		
	}	
});