const fs = require('fs');

exports.searchDataFilenames = async (query) => {
	let files = fs.readdirSync('./data');
	let result = [];
	// loop through files
	if (files.length > 0) {
		files.forEach((file) => {
			// check for a match = []
			if (file.includes(query)) {
				// update the result value
				result.push(file);
			}
		});
		// send back our find
		return result;
	} else {
		return null;
	}
};
