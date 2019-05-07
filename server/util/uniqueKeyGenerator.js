const HashMap = require('hashmap');
const Exception = require('./exception');

let map = new HashMap();
let currentMax = 100; // TODO Change Implementation !!!

let generateNewKeyFor = function (item) {
    map.set(item, currentMax);
    return currentMax++;
}


let freeKeyFor = function (item) {

}

let print = function () {
    console.log("KEY-GENERATOR-STATE:\n");
    map.forEach((key, item) => {
        console.log("Lobby: " + item + "; Key: " + key + "\n");
    });
}

let getItemByKey = function (genKey) {
    let out = null;
    map.forEach((key, item) => {
        if (key === genKey) {
            out = item;
        }
    });
    if (out != null) {
        return out;
    } else {
        throw Exception.Internal.unexpected.LOBBY_NOT_FOUND_FOR_ENQUEUE_KEY;
    }
}

module.exports = {generateNewKeyFor, freeKeyFor, getItemByKey};