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

async function handler() {
    generator.generate();
    await generator.storeS3();
}

module.exports = { handler }