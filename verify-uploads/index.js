const { Storage } = require('@google-cloud/storage');
const { Firestore } = require('@google-cloud/firestore');

const bucket = new Storage().bucket('i.onestay.moe');
const firestore = new Firestore();

exports.verify = async (data) => {
	const metadata = await bucket.file(data.name).getMetadata();

	if (metadata[0].metadata && metadata[0].metadata.user) {
		await firestore.doc(`users/${metadata[0].metadata.user}/uploads/${data.name}`)
			.update({
				verifiedUpload: true,
			});
	}
};
