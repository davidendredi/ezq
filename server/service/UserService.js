class User{
	constructor(name, password){
		this.name = name;
		this.password = password
		this.id = name + (new Date().getTime());
	}
}

let me = new User("David", "hesoyam");
console.log(me);