const {exec} = require('child_process');
const fs = require('fs');
const ver = require('./utils/log_version');
const date = require('./utils/log_date');

var template = require('./template.json');

findTotalExistingVersions = (template) => {
  return template[0].version.length;
}

gitChange = async(comment) => {
  if(comment){
    try{
      await exec("git add .");
      await exec("git commit -m "+comment);
      console.log("Git change successful");
    }catch(error){
      console.log("Error:", error);
    }
  }else{
    console.log("Nothing happened. Your commit is empty!");
  }
}

createAndWriteChangeLogJson = async(versiontype, typeValue, comment, alike, changelogJson, bak_changelogJson) => {
  let today = date.formatDate(new Date());

  // Check if changelog.json exists
  if(fs.existsSync(changelogJson)){
    try{
      var jsonfile = await require(changelogJson);
      if(alike){
        /**
        * Stay at current version
        * Change is made to the current version
        */
        let versionArray = jsonfile[0].version;
        let version = versionArray[versionArray.length-1];
        versionValue = Object.keys(version)[0];
        console.log("current version", versionValue);
      }else{
        /**
        * Update version
        * Change will be made to the next version
        */
        versionValue = await ver.updateVersion(versiontype, jsonfile);
        console.log("updated version", versionValue);
      }

      // If version doesn't exist, add it
      if(! await ver.doesVersionExists(versionValue, jsonfile)){
        jsonfile = await ver.addVersion(versionValue, jsonfile);
      }

      // If date doestn't exist, add it
      if(! await date.doesDateExist(today, versionValue, jsonfile)){
        jsonfile = await date.addDate(today, versionValue, jsonfile);
      }

      // The add change made
      if(comment){
        jsonfile = await addChangedItem(today, typeValue, comment, versionValue, jsonfile);
      }

      fs.writeFileSync(
        changelogJson,
        JSON.stringify(jsonfile)
      );
      // Copy content from changelog to .bak_changelog.json
      fs.copyFileSync(changelogJson, bak_changelogJson);
      gitChange(comment);
      console.log("write successful");
    }catch(error){
      console.log("Attention: Use 'sudo' to run the command again");
    }
  }else{
    try{
      versionValue = "1.0.0";
      //console.log("updated version", versionValue);

      // If version doesn't exist, add it
      if(!ver.doesVersionExists(versionValue, template)){
        jsonfile = await ver.addVersion(versionValue, template);
      }

      // If date doestn't exist, add it
      if(!date.doesDateExist(today, versionValue, template)){
        jsonfile = await date.addDate(today, versionValue, template);
      }

      // The add change made
      if(comment){
        jsonfile = await addChangedItem(today, typeValue, comment, versionValue, template);
      }

      // Create changelog.json
      fs.writeFileSync(
        changelogJson,
        JSON.stringify(jsonfile),
        { flag: 'wx' }
      );

      // Create .bak_changelog.json
      fs.writeFileSync(bak_changelogJson, "", { flag: 'wx' });

      // Copy content from changelog to .bak_changelog.json
      fs.copyFileSync(changelogJson, bak_changelogJson);
      gitChange(comment);
      console.log("write successful");
    }catch(error){
      console.log("Attention: Use 'sudo' to run the command again");
    }
  }
}

addChangedItem = (date, typeValue, comment, versionValue, jsonfile) => {
  //console.log("jsonfile", jsonfile[0].version);
  jsonfile[0].version.forEach((version) => {
    //console.log("version", version);
    Object.keys(version).forEach((versionkey) => {
      //console.log("version key", versionkey);
      if(versionkey === versionValue){
        //console.log("version value", version[versionkey]);
        version[versionkey].forEach((item) => {
          //console.log("version value item", item);
          Object.keys(item).forEach((itemkey) => {
            //console.log("version value item key", itemkey);
            if(itemkey === date && typeValue){
              //console.log("version value item key value", item[itemkey][typeValue]);
              item[itemkey][typeValue].push(comment);
              //console.log("Comment added", item[itemkey]);
            }
          });
        });
      }
    });
  });
  return jsonfile;
}

changelogTemplate = ((jsonfile) => {
  jsonfile = require(jsonfile);

  let template = "\# Changelog \r\n"+
  "All notable changes to this project will be documented in this file.\r\n"+
  "The format is based on Keep a Changelog and this project adheres to Semantic Versioning."+
  "\r\n\r\n";

  let versionArray = jsonfile[0].version;
  //console.log("data",jsonfile);
  versionArray.forEach((version)=>{
    Object.keys(version).forEach((versionkey) => {
      template+="## \["+versionkey+"\]";

      version[versionkey].forEach((item) => {
       //console.log("item",item);
        Object.keys(item).forEach((itemkey) => {
          // Display date
          template+=" \-"+itemkey+" \r\n";
          if(item[itemkey].added.length > 0){
            template+= "### Added \r\n";
            item[itemkey].added.forEach((content) => {
              template+= "* "+content+"\r\n";
            });
          }

          if(item[itemkey].changed.length > 0){
            template+= "### Changed \r\n";
            item[itemkey].changed.forEach((content) => {
              template+= "* "+content+"\r\n";
            });
          }

          if(item[itemkey].deprecated.length > 0){
            template+= "### deprecated \r\n";
            item[itemkey].deprecated.forEach((content) => {
              template+= "* "+content+"\r\n";
            });
          }

          if(item[itemkey].removed.length > 0){
            template+= "### Removed \r\n";
            item[itemkey].removed.forEach((content) => {
              template+= "* "+content+"\r\n";
            });
          }

          if(item[itemkey].fixed.length > 0){
            template+= "### Fixed \r\n";
            item[itemkey].fixed.forEach((content) => {
              template+= "* "+content+"\r\n";
            });
          }

          if(item[itemkey].security.length > 0){
            template+= "### Security \r\n";
            item[itemkey].security.forEach((content) => {
              template+= "* "+content+"\r\n";
            });
          }
        });
      });
    });

    template += "\r\n\r\n";
  });

  return template;
});

generateChangelogFile = async(jsonfile) => {
  let logtemplate = await changelogTemplate(jsonfile);
  if(fs.existsSync('./CHANGELOG.md')){
    fs.writeFileSync('./CHANGELOG.md', logtemplate);
    console.log("update successful");
  }else{
    fs.writeFileSync('./CHANGELOG.md', logtemplate, { flag: 'wx' });
    console.log("CHANGELOG.md created successful");
  }
  gitChange("CHANGELOG.md file updated");
}

generatePackageJsonFile = async() => {
  let packagetemplate = {
    "name": "",
    "version": "",
    "description": "",
    "main": "change.js",
    "scripts": {},
    "keywords": [],
    "author": "",
    "license": "ISC",
    "dependencies": {}
  };
  if(!fs.existsSync('./package.json')){
    fs.writeFileSync('./package.json', packagetemplate, { flag: 'wx' });
    console.log("package.json created successful");
    gitChange("package.json file created");
  }
}

createChangeLogJsonFromBackupFile = async(changelogJson, bak_changelogJson) => {
  try{
    // Create changelog.json
    fs.writeFileSync(changelogJson, "", { flag: 'wx' });

    // Copy content from .bak_changelog.json to the created changelog
    fs.copyFileSync(bak_changelogJson, changelogJson);
  }catch(error){
    console.log("Attention: Use 'sudo' to run the command again");
  }
}

module.exports = {
  findTotalExistingVersions,
  gitChange,
  createAndWriteChangeLogJson,
  addChangedItem,
  changelogTemplate,
  generateChangelogFile,
  generatePackageJsonFile,
  createChangeLogJsonFromBackupFile
}
