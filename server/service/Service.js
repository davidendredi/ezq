class User{
	constructor(name){
		this.name = name;
		this.id = "User_" + new Date().getTime(); 
	}
}

class Owner{
	constructor(prename, surname, email, password){
		this.prename = firstname;
		this.surname = surname;
		this.email = email;
		this.password = password;
		this.id = "User_" + new Date().getTime();
		this.salt = Math.random();	
	}
}

class Lobby{
	constructor(owner){
		this.owner = owner;
		this.id = "Lobby_" + owner.id;
		this.active = true;
		this.list = [];
	}
}

class Service{
	constructor(){
		this.lobbies = [];
		
	}

	registerOwner(prename, surname, email, password){

	}






}

module.exports = Service;