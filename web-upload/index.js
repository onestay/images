const { Storage } = require('@google-cloud/storage');
const crypto = require('crypto');
const uuid = require('uuid/v4');
const path = require('path');
const mime = require('mime');
const url = require('url');
const admin = require('firebase-admin');
const serviceAccount = require('./firebase-admin.json');

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: 'https://images-247908.firebaseio.com',
});

const bucket = new Storage().bucket('i.onestay.moe');

function generateFilename(file, fileName) {
	const hash = crypto.createHash('sha256');
	hash.update(file);
	return hash.digest('hex').substring(0, 4) + uuid().substring(0, 4) + path.extname(fileName);
}

exports.helloWorld = async (req, res) => {
	res.set('Access-Control-Allow-Origin', '*');
	res.set('Access-Control-Allow-Headers', 'Content-Type, X-Original-File-Name, Authorization');
	res.set('Access-Control-Request-Method', 'POST');
	res.set('Content-Type', 'application/json');

	if (req.method === 'OPTIONS') {
		return res.sendStatus(204);
	}

	if (req.method !== 'POST') {
		return res.sendStatus(405);
	}

	if (!req.header('X-Original-File-Name')) {
		res.status(400);
		return res.send({
			ok: false,
			error: 'X-Original-File-Name header missing',
		});
	}

	const authHeader = req.header('Authorization');
	if (!authHeader) {
		res.status(403);
		return res.send({
			ok: false,
			error: 'Authorization required',
		});
	}

	let token;
	if (authHeader.startsWith('Bearer ')) {
		token = authHeader.substring(7, authHeader.length);
	} else {
		res.status(403);
		return res.send({
			ok: false,
			error: 'Invalid Authorization header',
		});
	}

	let user;
	try {
		user = await admin.auth().verifyIdToken(token);
	} catch (error) {
		console.log(error);
		res.status(403);
		return res.send({
			ok: false,
			error: 'Invalid token',
		});
	}

	if (!req.body || req.body.length > 1000) {
		res.status(400);
		return res.send({
			ok: false,
			error: 'body missing or bigger than 1000 bytes',
		});
	}

	const originalFileName = req.header('X-Original-File-Name');

	const filename = generateFilename(req.body, originalFileName);
	const d = new Date();
	d.setMinutes(d.getMinutes() + 30);
	console.log(mime.getType(originalFileName));
	const signedUrl = await bucket.file(filename).getSignedUrl({
		action: 'write',
		expires: d,
		contentType: mime.getType(originalFileName),
		extensionHeaders: {
			'x-goog-meta-user': user.uid,
		},
	});
	return res.send({
		ok: true,
		url: signedUrl[0],
		fileUrl: `https://${url.parse(signedUrl[0]).pathname}`,
	});
};
