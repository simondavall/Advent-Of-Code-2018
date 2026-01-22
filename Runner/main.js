const { exec } = require("child_process");
const util = require("util");
const process = require('process');
const execPromise = util.promisify(exec);

process.chdir("./Runner")
async function execute() {
  for (let i = 1; i <= 25; i++) {
    const day = `Day${i.toString().padStart(2, "0")}`;
    process.chdir(`../${day}`)
    const { stdout, stderr } = await execPromise(
      `node main.js input.txt`,
    );
    console.log(stdout);
  }
}

execute();
