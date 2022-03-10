const { Generator } = require('./factory/generator');
const { S3ClientAdapterV2 } = require('./s3/s3Adapterv2');
const { SpotFactory } = require('./factory/spotFactory');
const { PlateContentGenerator } = require('./plategenerator/platecontentgenerator')

const maxWidth = 350;
const maxHeight = 350;

const s3ClientAdapterV2 = new S3ClientAdapterV2();
const plateContentGenerator = new PlateContentGenerator();
const circleFactory = new SpotFactory(maxWidth, maxHeight)

const generator = new Generator(maxWidth, maxHeight, s3ClientAdapterV2, plateContentGenerator, circleFactory);

async function handle() {
    generator.generate();
    await generator.storeS3();
}

// (async function () {
//     for (let i = 0; i < 1; i++) {
//         await handle();
//     }
// })()

module.exports = { handle }