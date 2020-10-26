// This file handles all version functions

doesVersionExists = (versionValue, jsonfile) => {
  let versionArray = jsonfile[0].version;
  //console.log("versions", Object.keys(versionArray[0]));
  let versionExitsArr = [];
  let versionExits = false;
  versionArray.forEach((version) => {
  //  console.log("Version-", Object.keys(version));
    // Object keys are stored in array thus we need to loop to get value
    Object.keys(version).forEach((key) => {
      if(key === versionValue){
        versionExitsArr.push(1);
        versionExits = true;
        //console.log("equal version", version);
      }
    });
  });
//  console.log("Version exists", versionExitsArr);
//  console.log("Version exists", versionExits);
  return versionExits;
}

addVersion = (versionValue, jsonfile) => {
  let versionArray = jsonfile[0].version;
  //console.log("versions", versionArray);
  let newVersion = new Object();
  newVersion[versionValue] = [];
  versionArray.push(newVersion);
  //console.log("updated versions", versionArray);
  // Version array to main object
  jsonfile[0].version = versionArray;
  //console.log("updated versions", jsonfile[0].version);
  return jsonfile;
}

updateVersion = (changeType, jsonfile) => {
  versionArray = jsonfile[0].version;
  //console.log("before version", versionArray);
  if(versionArray.length > 0){
    version = versionArray[versionArray.length-1];
    version = Object.keys(version)[0];
    //console.log("chosen version", version);
  }else{
    // Assign package version
    version = "1.0.0";
  }
  versions = version.split('.');
  switch(changeType){
    case "patch":
      patch = Number(versions[2])+1;
      version = versions[0]+'.'+versions[1]+'.'+patch;
    break;
    case "minor":
      minor = Number(versions[1])+1;
      patch = 0;
      version = versions[0]+'.'+minor+'.'+patch;
    break;
    case "major":
      major = Number(versions[0])+1;
      minor = 0;
      patch = 0;
      version = major+'.'+minor+'.'+patch;
    break;
  }
  return version;
}

module.exports = {
  addVersion,
  updateVersion,
  doesVersionExists
}
