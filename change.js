const pjson = require('./package.json');
const utils = require('./utils');

const args = process.argv;
const version = pjson.version;
var changeType = args[2];
var type = args[3];
var comment = args[4];

// node change patch added ""

console.log("comment: ",comment);
var commit = "git commit -m '"+comment+"'";
utils.gitChange(commit);
utils.createAndWriteChangeLogJson(changeType, type, comment);
