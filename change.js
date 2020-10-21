const {exec} = require('child_process');

const args = process.argv;

console.log("comment: ",args[2]);
var message = args[2];
var commit = "git commit -m "+args[2];
gitChange();

async function gitChange(){
  try{
    await exec("git add .");
    let result = await exec(commit);
    console.log("Git change successful");
  }catch(error){
    console.log("Error:", error);
  }
}
