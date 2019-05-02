const HashMap = require('hashmap');

let map = new HashMap();
let currentMax = 0; // TODO Change Implementation !!!

let generateNewKeyFor = function (itemKey) {
    map.set(itemKey, currentMax);
    return currentMax++;
}


let freeKeyFor = function (itemKey) {

}

module.exports = {generateNewKeyFor, freeKeyFor};