/*

Contains all relevant information of a client state, e.g. deviceID or sessionID etc.
*/

class Context{
	constructor(){
		this.sessionId = "Session_" + (new Date().getTime());
		this.userId = null;
	}

	setUserId(id){
		this.userId = id;
	}
}



module.exports = Context;