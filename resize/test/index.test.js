const { expect } = require('chai');
const { Storage } = require('@google-cloud/storage');

const { resize } = require('../index');

const storage = new Storage();

describe('Thumbnail generator', () => {
    describe('Generate Thumbnails', () => {
        it('should generate and upload thumbnails', async() => {
            const result = await resize({ name: 'resize_test.png', contentType: 'image/jpg' });
            const data = await storage.bucket('i.onestay.moe').file('thumbs/thumb_resize_test.png_64px.png').getMetadata();
            const response = data[1];

            expect(response.statusCode).to.equal(200);
            expect(result).to.equals('OK');
        });
    });
    describe('Conditions', () => {
        it('should not generate thumbnails from files in the thumbs dir', async() => {
            const result = await resize({ name: 'thumbs/thumb_128px_resize_test.png', contentType: 'image/jpg' });

            expect(result).to.equal('CONDITIONS_NOT_MET');
        });
        it('should not generate thumbnails from anything other than images', async() => {
            const result = await resize({ name: 'lolis.mp4', contentType: 'video/mp4' });

            expect(result).to.equal('CONDITIONS_NOT_MET');
        });
    });
});

after(() => {
    storage.bucket('i.onestay.moe').deleteFiles({ prefix: 'thumbs/thumb_resize_test' })
        .catch(e => {
            console.log(`Could not delete generated test thumbnail files: ${e}`);
        });
});
