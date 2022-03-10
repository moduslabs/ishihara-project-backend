const { Generator  } = require('../src/factory/generator');
const { S3ClientAdapterV2 } = require('../src/s3/s3Adapterv2');
const { SpotFactory } = require('../src/factory/spotFactory');
const { PlateContentGenerator } = require('../src/plategenerator/platecontentgenerator')

const maxWidth = 300;
const maxHeight = 300;

const s3ClientAdapterV2 = new S3ClientAdapterV2();
const plateContentGenerator = new PlateContentGenerator();
const circleFactory = new SpotFactory(maxWidth, maxHeight)

const generator = new Generator(maxWidth, maxHeight, s3ClientAdapterV2, plateContentGenerator, circleFactory);

async function handle() {
    generator.generate();
    await generator.store();
}

(async function () {
    for (let i = 0; i < 1; i++) {
        await handle();
    }
})()