const utils = require('./utils');
const fs = require('fs');
const git = require('./utils/log_git');
const path = require('path');

/**
* The package we are accessing here is not for changelog-gitter but for
* the project using changelog-gitter
*/
const pjson = require('../../package.json');

const args = process.argv;

/**
* The project name we are accessing here is not for changelog-gitter but for
* the project using changelog-gitter
*/
var project = pjson.name;

/**
* Accessing change-gitter from the host project.
*/
var changelogJson = path.resolve('../'+project+'/node_modules/changelog-gitter/changelog.json');

/**
* Query pattern: Type on your command line as shown below
*
* ======================> node change patch added "COMMENT" <===================
**/

/**
* Check if git has been initialized
*/
if(!git.isGitInit()){
  console.log("Attention: Initialized Git before you proceed!");
}else{
  /* User inputs: Following the format in the above comment section */
  if(!args[2]){
    console.log("Attention: You need to provide the arguments");
  }else{
    switch(args[2]){
      case "log":
        if(fs.existsSync(changelogJson)){
          utils.generateChangelogFile(changelogJson);
          utils.gitChange("CHANGELOG.md file updated");
        }else{
          console.log("Attention: Post at least one change before you log");
        }
      break;
      default:
        var versiontype = args[2].toLowerCase();
        if(args.length === 6 && args[3].toLowerCase() === "alike"){
          // When alike is called
          var alike = true;
          var changetype = args[4].toLowerCase();
          var comment = args[5];
        }else{
          var alike = false;
          var changetype = args[3].toLowerCase();
          var comment = args[4];
        }
        utils.createAndWriteChangeLogJson(versiontype, changetype, comment, alike, changelogJson);
        utils.gitChange(comment);
      break;
    }
  }
}
