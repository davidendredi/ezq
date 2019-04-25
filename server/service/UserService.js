class User{
	constructor(){
		this.name = "not_defined_yet";
		this.password = "not_defined_yet";
		this.uid = this.name + (new Date().getTime());
		this.connected = false;
	}

	setName(name){
		this.name = name;
	}

	setName(pw){
		this.password = pw;
	}

	setConnected(con){
		this.connected = con; 
	}

}

class UserService{
	constructor(){
		//this.users = [new User("Hans", "123"), new User("Adolf", "Ich bin heimlich in Hans verliebt")];
		this.users = [];
	}

	createAndAddDummyUser(){
		let user = new User();
		user.uid = 123;
		this.users.push(user);
		return user;
	}

	createAndAddUser(){
		let user = new User();
		this.users.push(user);
		return user;
	}

	getUserByUid(uid){
		return this.users.filter((value, index, array) => value.uid == uid).pop();
	}

	existsUid(uid){
		return this.users.filter((value, index, array) => value.uid == uid).length > 0;	
	}


}

module.exports = UserService;