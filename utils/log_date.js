// This file handles all the log dates functions

doesDateExist = (date, versionValue, jsonfile) => {
  // locate version content
  let versionArray = jsonfile[0].version;
  let dateExists = false;

  versionArray.forEach((version) => {
    //console.log("date version:", version);
    Object.keys(version).forEach((versionkey) => {
        //console.log("date version key:", versionkey);

        version[versionkey].forEach((item) => {
        //  console.log("date version key item:", Object.keys(item));
          Object.keys(item).forEach((itemKey) => {
        //    console.log("date version key item key:", itemKey);
            if(itemKey === date && versionkey == versionValue){
              dateExists = true;
            }
          });
        });
    });
  });
  //console.log("date version exists:", dateExists);
  return dateExists;
}

addDate = (date, versionValue, jsonfile) => {
  // locate version content
  let versionArray = jsonfile[0].version;
//  console.log("add date:", versionArray);
  let dateAdded = false;
  versionArray.forEach((version) => {
    //console.log("add date version:", version);
    Object.keys(version).forEach((versionkey) => {
      if(versionkey === versionValue && dateAdded === false){
        //console.log("add date version --:", version[versionkey]);
        let newContent = new Object();
        dateAdded = true;
        newContent[date] = { added: [], changed: [], deprecated: [], removed:[], fixed:[], security:[] };
        version[versionkey].push(newContent);
      }
    });
  });
 jsonfile[0].version = versionArray;
 //console.log("date**: ",versionArray);
 return jsonfile;
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

  return date + "-" + month + "-" + year;
}

module.exports = {
  doesDateExist,
  addDate,
  formatDate
}
