const { Storage } = require('@google-cloud/storage');
const crypto = require('crypto');
const uuid = require('uuid/v4');
const path = require('path');
const mime = require('mime');
const url = require('url');

const bucket = new Storage().bucket('i.onestay.moe');

function generateFilename(file, fileName) {
	const hash = crypto.createHash('sha256');
	hash.update(file);
	return hash.digest('hex').substring(0, 4) + uuid().substring(0, 4) + path.extname(fileName);
}

exports.helloWorld = async (req, res) => {
	res.set('Access-Control-Allow-Origin', '*');
	res.set('Access-Control-Allow-Headers', 'Content-Type, X-Original-File-Name');
	res.set('Access-Control-Request-Method', 'POST');
	res.set('Content-Type', 'application/json');

	if (req.method === 'OPTIONS') {
		return res.sendStatus(204);
	}

	if (req.method !== 'POST') {
		return res.sendStatus(405);
	}
	const originalFileName = req.header('X-Original-File-Name');

	const filename = generateFilename(req.body, originalFileName);
	const d = new Date();
	d.setMinutes(d.getMinutes() + 30);
	const signedUrl = await bucket.file(filename).getSignedUrl({
		action: 'write',
		expires: d,
		cname: 'https://i.onestay.moe/',
		contentType: mime.getType(originalFileName),
	});
	return res.send({
		url: signedUrl[0],
		fileUrl: `https://i.onestay.moe${url.parse(signedUrl[0]).pathname}`,
	});
};
