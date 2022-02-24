const { Generator } = require('./factory/generator');
const { S3ClientAdapterV2 } = require('./s3/s3Adapterv2');
const { CircleFactory } = require('./factory/circleFactory');
const { PlateContentGenerator } = require('./plategenerator/platecontentgenerator')

const maxWidth = 800;
const maxHeight = 800;

const s3ClientAdapterV2 = new S3ClientAdapterV2();
const plateContentGenerator = new PlateContentGenerator();
const circleFactory = new CircleFactory(maxWidth, maxHeight)

const generator = new Generator(maxWidth, maxHeight, s3ClientAdapterV2, plateContentGenerator, circleFactory);

async function handle() {
    generator.generate();
    await generator.storeS3();
}

module.exports = { handle }