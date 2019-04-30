var validator = require('validator');
const Exception = require('./../util/exception');

class User{
	constructor(name){
		this.name = name;
		this.id = "User_" + new Date().getTime(); 
	}
}

class Owner{
	constructor(firstname, surname, email, password){
		this.firstname = firstname;
		this.surname = surname;
		this.email = email;
		this.password = password;
		//this.id = "Owner_" + new Date().getTime();
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
		this.owners = [];
	}
	
	registerOwner(firstname, surname, email, password1, password2){
		if(!validator.isEmail(email)){
			throw Exception.Registration.failure.INVALID_EMAIL;
		}
		if(!(password1 === password2)){
			throw Exception.Registration.failure.PASSWORDS_NOT_EQUAL;
		}
		if(this.owners.filter(ow => ow.email === email).length != 0){
			throw Exception.Registration.failure.ALREADY_REGISTERED;
		}
		console.log("test");
		let newOwner = new Owner(firstname, surname, email, password1);
		this.owners.push(newOwner);
		throw Exception.Registration.SUCCESS;
	}

	loginOwner(email, password){
		
		let foundOwners = owners.filter(ow => ow.email === email);

		if(foundOwners.length == 0){
			throw Excetion.Login.failure.UNKNOWN_EMAIL;
		}
		if(foundOwners.length > 1){
			console.log("Unexpected internal state: multiple owners with same email found");
		}

		let owner = foundOwners.pop();

		if(password != owner.password){
			throw Excetion.Login.failure.INCORRECT_PASSWORD;
		}

		// TODO ONLINE-Flag Handling

		/*
		AUTOMATICALLY SET UP LOBBY
		*/
		if(lobbies.filter(lob => lob.owner === owner).length > 0){
			console.log("Unexpected internal state: found active lobby when logging in");
		}
		let newLobby = new Lobby(owner);
		lobbies.push(newLobby);

		throw Exception.Login.SUCCESS;
	}




}

module.exports = Service;