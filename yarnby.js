const fs = require('fs');
const path = require('path');
var exec = require('child_process').exec;
// bring in input library
const readline = require('readline');
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	terminal: false,
});
// bring in helper functions
const search = require('./search');
// bring in initializtion function
const init = require('./init');
// runtime variables
let inputMode = 'standard';
let fileList = [];
// initialize yarnby
init.yarnby();
// main input loop
const inputLoop = async (mode) => {
	switch (mode) {
		case 'standard':
			// ask for input
			rl.question('> ', async (input) => {
				if (input !== '') {
					fileList = await search.searchDataFilenames(input);
					// if we found it, lets open it
					if (fileList.length > 1) {
						fileList.push('all');
						console.log('\n');
						fileList.forEach((item) => {
							console.log(fileList.indexOf(item) + ': ' + item);
						});
						console.log('\n');
						inputMode = 'num';
					} else if (fileList.length > 0) {
						fileList.forEach((item) => {
							let filePath = path.join('./data', item);
							// launch the file
							exec(getLaunchCode() + '"' + filePath + '"');
						});
					}
					// if we get nothing we must create it
					else {
						let newFilePath = path.join('./data', input + '.txt');
						fs.writeFileSync(newFilePath, input);
						// launch our new file
						exec(getLaunchCode() + '"' + newFilePath + '"');
					}
				}
				// check for exit condition
				if (input !== 'goodbye') {
					inputLoop(inputMode);
				} else {
					// if the input was 'exit' close out
					rl.close();
				}
			});
			break;
		case 'num':
			inputMode = 'standard';
			// ask for input
			rl.question('> ', async (input) => {
				if (input !== '') {
					console.log('\n');
					let listItem = fileList[input];
					if (listItem === 'all') {
						// remove the 'all' entry
						fileList.pop();
						// open all the files
						fileList.forEach((item) => {
							console.log('opening ' + item);
							// store the path
							let filePath = path.join('./data', item);
							// launch the file
							exec(getLaunchCode() + '"' + filePath + '"');
						});
					} else {
						console.log('opening ' + listItem);
						// store the filepath
						let filePath = path.join('./data', listItem);
						// launch the file
						exec(getLaunchCode() + '"' + filePath + '"');
					}
					console.log('\n');
				}
				// check for exit condition
				if (input !== 'goodbye') {
					inputLoop('standard');
				} else {
					// if the input was 'exit' close out
					rl.close();
				}
			});
			break;
		default:
			inputLoop('standard');
			break;
	}
};
// start application
inputLoop('standard');
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
