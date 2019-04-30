/*

Contains all relevant information of a client state, e.g. deviceID.
*/

class Context{
	constructor(){
		this.deviceId = "Device_" + (new Date().getTime());
		this.userId = null;
	}

	setUserId(id){
		this.userId = id;
	}
}



module.exports = Context;