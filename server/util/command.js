

let generateCommand = () => {
	return {commandType: "demo",
			param_1: "value1",
			param_2: "value2",
			timestamp: new Date().getTime()}
}

module.exports = {generateCommand};