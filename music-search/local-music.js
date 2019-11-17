
const dirTree = require("directory-tree")
const mmm = require('music-metadata')

const getFilteredTree = (path = []) => {
	dirTree("/Users/apple/Downloads",
	{
		extensions: /^\.(mp3|flac)$/,
		exclude: /(^\..{2,}$|node_modules)/
	}, (item, PATH, stats) => {
		// console.log(item.path)
		path.push(item.path)
	})

	return path
}

const getMetadata = async (pathArr = filteredTree(), metadata = [], err = []) => {
	for (const path of pathArr) {
		let mt = false, _err = false
		try {
			mt = await mmm.parseFile(path)
			mt.path = path
			metadata.push(mt)
		} catch(_err) {
			err.push(_err)
		}
	}
	return {metadata, err}
}

module.exports = {getFilteredTree, getMetadata}
