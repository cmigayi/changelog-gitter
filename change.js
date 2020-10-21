const {exec} = require('child_process');

const args = process.argv;

console.log("comment: ",args[2]);
var commit = "git commit -m args[2]";
gitChange();

async function gitChange(){
  try{
    await exec("git add .");
    let result = await exec(commit);
    console.log("result:", result);
  }catch(error){
    console.log("Error:", error);
  }
}
// exec("git add .", (error, stdout, stderr) => {
//   if (error) {
//       console.log(`error: ${error.message}`);
//       return;
//   }
//   if (stderr) {
//       console.log(`stderr: ${stderr}`);
//       return;
//   }
//   console.log(`stdout: ${stdout}`);
//
//   exec(commit, (error, stdout, stderr) => {
//       if (error) {
//           console.log(`error: ${error.message}`);
//           return;
//       }
//       if (stderr) {
//           console.log(`stderr: ${stderr}`);
//           return;
//       }
//       console.log(`stdout: ${stdout}`);
//   });
// });
