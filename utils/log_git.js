const fs = require('fs');

isGitInit = () => {
  if(fs.existsSync('./.git')){
    return true;
  }
  return false;
}
module.exports = {
  isGitInit
}
