const {exec} = require('child_process');
const fs = require('fs');

var template = require('./template.json');

findTotalExistingVersions = () => {
  return template[0].version.length;
}

gitChange = async(commit) => {
  if(commit){
    try{
      await exec("git add .");
      let result = await exec(commit);
      console.log("Git change successful");
    }catch(error){
      console.log("Error:", error);
    }
  }else{
    console.log("Nothing happened. Your commit is empty!");
  }
}

updateVersion = (changeType, jsonfile) => {
  version = jsonfile[jsonfile.length-1].version;
  versions = version.split('.');
  switch(changeType){
    case "patch":
      patch = Number(versions[2])+1;
      version = versions[0]+'.'+versions[1]+'.'+patch;
    break;
    case "minor":
      minor = Number(versions[1])+1;
      version = versions[0]+'.'+minor+'.'+versions[2];
    break;
    case "major":
      major = Number(versions[0])+1;
      version = major+'.'+versions[1]+'.'+versions[2];
    break;
  }
  return version;
}

createAndWriteChangeLogJson = async(changeType, type, comment) => {
  var changelogJsonTemplate = [{
    "version": "",
    "date": "",
    "type": { // added, changed, deprecated, removed, fixed, security
      "added": [],
      "changed": [],
      "deprecated": [],
      "removed": [],
      "fixed": [],
      "security": []
    }
  }];

  // Check if changelog.json exists
  if(fs.existsSync('./changelog.json')){
    const jsonfile = require('./changelog.json');

    // Add data to array and json
    changelogJsonTemplate[0].version = updateVersion(changeType, jsonfile);
    //  changelog[0].date = date;

    addChangedItem(type, comment, changelogJsonTemplate[0]);
    jsonfile[jsonfile.length] = changelogJsonTemplate[0];

    fs.writeFileSync(
      './changelog.json',
      JSON.stringify(jsonfile)
    );
    console.log("write successful", jsonfile);
  }else{
    // Create changelog.json
    // Add data to array and json
    changelogJsonTemplate[0].version = version;
    //changelog[0].date = date;

    addChangedItem(type, comment, changelogJsonTemplate[0]);

    fs.writeFileSync(
      './changelog.json',
      JSON.stringify(changelogJsonTemplate),
      { flag: 'wx' }
    );
    console.log("write successful");
  }
}

addChangedItem = (typeValue, item, changelog) => {
  // Split
  // type = type.split('=');
  // items = type[1].slice(1,-1).split(',');

  // DateTime
  let dateTime = formatDate(new Date());

  switch(typeValue){
    case "added":
      changelog.type.added.push(dateTime+':'+item);
    break;
    case "changed":
      changelog.type.changed.push(dateTime+':'+item);
    break;
    case "deprecated":
      changelog.type.deprecated.push(dateTime+':'+item);;
    break;
    case "removed":
      changelog.type.removed.push(dateTime+':'+item);
    break;
    case "fixed":
      changelog.type.fixed.push(dateTime+':'+item);
    break;
    case "security":
      changelog.type.security.push(dateTime+':'+item);
    break;
  }
}

formatDate = (date_ob) => {
  // adjust 0 before single digit date
  let date = date_ob.getDate();
  if(date.length == 1){
    date = "0" + date;
  }

  // current month
  let month = date_ob.getMonth() + 1;
  if(month.length == 1){
    month = "0" + month;
  }

  // current year
  let year = date_ob.getFullYear();

  return year + "-" + month + "-" + date;
}

module.exports = {
  findTotalExistingVersions,
  gitChange,
  updateVersion,
  createAndWriteChangeLogJson
}
