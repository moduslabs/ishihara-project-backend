const Generator = require('./factory/generator');
const { S3ClientAdapterV2 } = require('./s3/s3Adapterv2')

const maxWidth = 800;
const maxHeight = 800;

const s3ClientAdapterV2 = new S3ClientAdapterV2();
const generator = new Generator(maxWidth, maxHeight, s3ClientAdapterV2);

async function startGeneration() {
    generator.generate();
    await generator.sendToS3();
}

(async function () {
    for (let i = 0; i < 1; i++) {
        await startGeneration();
    }
})()
