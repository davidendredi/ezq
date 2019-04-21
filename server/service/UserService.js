class User{
	constructor(name, password){
		this.name = name;
		this.password = password
		this.id = name + (new Date().getTime());
	}
}

module.exports.initUser = (name, password) => {
	return new User(name, password);
}