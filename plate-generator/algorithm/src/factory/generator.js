const { createWriteStream } = require('fs');
const { kdTree } = require('../kd3/kdTree');
const { createCanvas } = require('canvas');

const { colorsFigure, colorsBackground } = require('../colors/colors');
const BUCKET_S3 = process.env.BUCKET_S3;

class Generator {
    constructor(maxWidth, maxHeight, s3Client, plateGenerator, spotFactory) {
        this.maxWidth = maxWidth;
        this.maxHeight = maxHeight;
        this.s3Client = s3Client;
        this.plateValueGenerator = plateGenerator;
        this.spotFactory = spotFactory;
        this.canvas = createCanvas(maxWidth, maxHeight);
        this.ctx = this.canvas.getContext('2d');
    }

    generate() {
        const drawStyle = Math.floor(Math.random() * (colorsFigure.length));
        const plate = this.generatePlateImage();
        this.name = plate.content;
        this.fillCanvas('white')

        const tree = new kdTree([], function (a, b) {
            return Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2);
        }, ['x', 'y']);

        let currentStep = 0;
        const area = (this.canvas.width * this.canvas.height);
        const steps = (area / 150) * 7;

        paintPlate: while (currentStep < steps) {
            var tries = 0;

            while (true) {
                tries++;
                if (tries > 1500) {
                    currentStep++;
                    continue paintPlate;
                }

                const spot = this.spotFactory.create();
                const nearest = tree.nearest(spot, 8);

                let intersects = false;

                for (let j = 0; j < nearest.length; j++) {
                    const nearSpot = nearest[j][0];
                    if (this.spotFactory.intersects(spot, nearSpot)) {
                        intersects = true;
                        break;
                    }
                }

                if (intersects) {
                    continue;
                }

                currentStep++;
                if (this.spotFactory.isOverlapping(plate.data, spot)) {
                    this.ctx.fillStyle = colorsFigure[drawStyle][Math.floor(Math.random() * colorsFigure[drawStyle].length)];
                } else {
                    this.ctx.fillStyle = colorsBackground[drawStyle][Math.floor(Math.random() * colorsBackground[drawStyle].length)];
                }
                this.spotFactory.draw(this.ctx, spot);

                tree.insert(spot);
            }
        }
    };


    generatePlateImage() {
        this.fillCanvas('white');
        this.ctx.fillStyle = '#000';
        this.ctx.font = '180px Arial';
        this.ctx.textBaseline = 'middle';
        this.ctx.textAlign = 'center';

        const plateContent = this.plateValueGenerator.getContent();
        this.ctx.fillText(plateContent, this.maxWidth / 2, this.maxHeight / 2);

        return {
            content: plateContent,
            data: this.extractCanvasImage()
        };
    }

    extractCanvasImage() {
        return this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    }

    fillCanvas(style) {
        this.ctx.fillStyle = style;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    async store() {
        const out = createWriteStream(this.name + '.png');
        const stream = this.canvas.createPNGStream();
        stream.pipe(out);
        await new Promise((res, rej) => {
            out.on('finished', res);
        })
    }

    async storeS3() {
        const stream = this.canvas.createPNGStream();

        await this.s3Client.put({
            bucket: BUCKET_S3,
            key: this.name + '.png',
            body: stream
        });
    }

}

module.exports = { Generator };