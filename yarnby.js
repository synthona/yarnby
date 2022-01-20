const fs = require('fs');
const path = require('path');
var exec = require('child_process').exec;
// bring in input library
const readline = require('readline');
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});
// bring in helper functions
const search = require('./search');
// bring in initializtion function
const init = require('./init');
// initialize yarnby
init.yarnby();
// main input loop
const inputLoop = async () => {
	// ask for input
	rl.question('> ', async (input) => {
		let result = await search.searchDataFilenames(input);
		// if we found it, lets open it
		if (result) {
			let filePath = path.join('./data', result);
			// launch the file
			exec(getLaunchCode() + '"' + filePath + '"');
		}
		// if we get nothing we must create it
		else {
			let newFilePath = path.join('./data', input + '.txt');
			fs.writeFileSync(newFilePath, input);
			// launch our new file
			exec(getLaunchCode() + '"' + newFilePath + '"');
		}
		// check for exit condition
		if (input !== 'exit') {
			inputLoop();
		} else {
			// if the input was 'exit' close out
			rl.close();
		}
	});
};
// start application
inputLoop();
// on-exit event
rl.on('close', () => {
	console.log('\nhave a nice day!');
	process.exit(0);
});

// file open code for different operating systems
function getLaunchCode() {
	switch (process.platform) {
		case 'darwin':
			return 'open ';
		case 'win32':
			return 'explorer.exe ';
		case 'win64':
			return 'explorer.exe ';
		default:
			return 'xdg-open ';
	}
}
