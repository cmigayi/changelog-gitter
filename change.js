const pjson = require('./package.json');
const utils = require('./utils');

const args = process.argv;

// This version value has not been used, pending future changes
const version = pjson.version;

/**
* Query pattern: Type on your command line as shown below
*
* ======================> node change patch added "COMMENT" <===================
**/

/* User inputs: Following the format in the above comment section */
switch(args[2]){
  case "log":
    utils.generateChangelogFile('./changelog.json');
  break;
  default:
    if(args.length === 6 && args[3].toLowerCase() === "alike"){
      // When alike is called
      var versiontype = args[2].toLowerCase();
      var alike = true;
      var changetype = args[4].toLowerCase();
      var comment = args[5];
    }else{
      var versiontype = args[2].toLowerCase();
      var alike = false;
      var changetype = args[3].toLowerCase();
      var comment = args[4];
    }
    utils.createAndWriteChangeLogJson(versiontype, changetype, comment, alike);
    utils.gitChange("git commit -m "+comment);
  break;
}
