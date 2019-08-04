const { Storage } = require('@google-cloud/storage');
const sharp = require('sharp');
const path = require('path');
const mime = require('mime');

const storage = new Storage();


exports.resize = async event => {

    if (!event.contentType.includes('image') || event.name.includes('thumbs/')) {
        return 'CONDITIONS_NOT_MET';
    }

    const data = await storage.bucket('i.onestay.moe').file(event.name).download();
    const file = data[0];

    const sizes = [64, 128, 256, 512];

    const uploadPromises = sizes.map(async size => {
        const resizeFile = await sharp(file).resize(size).toBuffer();

        return await storage.bucket('i.onestay.moe').file(`thumbs/thumb_${event.name}_${size}px${path.extname(event.name)}`).save(resizeFile, {
            gzip: true,
            resumable: false,
            contentType: mime.getType(path.extname(event.name))
        });
    });

    return await Promise.all(uploadPromises)
        .then(() => 'OK')
        .catch(err => {
            throw err;
        });
};
