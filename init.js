const fs = require('fs');

exports.yarnby = () => {
	// create data dir if it does not exist
	if (!fs.existsSync('./data')) {
		fs.mkdirSync('./data');
	} else {
		return;
	}
};
