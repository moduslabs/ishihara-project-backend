const { createWriteStream } = require('fs');
const { kdTree } = require('../kd3/kdTree');
const { createCanvas } = require('canvas')

const { colorsOn, colorsOff } = require('../colors/colors')
const BUCKET_S3 = process.env.BUCKET_S3;
const invertColors = false;

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
        console.time('start')
        const drawStyle = Math.floor(Math.random() * 6);
        const plate = this.generatePlateImage();
        this.name = plate.content;
        this.fillCanvas('white')

        var tree = new kdTree([], function (a, b) {
            return Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2);
        }, ['x', 'y']);

        var currentStep = 0;
        var area = (this.canvas.width * this.canvas.height); //determina numbers of points

        var steps = (area / 150) * 7;

        console.log('start while')
        var paintPlate = (function () {
            while (currentStep < steps) {
                var tries = 0;

                while (true) {
                    tries++;
                    if (tries > 100) {
                        currentStep++;
                        paintPlate();
                        return;
                    }

                    var spot = this.spotFactory.create();
                    var nearest = tree.nearest(spot, 8);

                    var intersects = false;

                    for (var j = 0; j < nearest.length; j++) {
                        var nearSpot = nearest[j][0];
                        if (this.spotFactory.intersects(spot, nearSpot)) {
                            intersects = true;
                            break;
                        }
                    }

                    if (intersects) {
                        continue;
                    }

                    currentStep++;
                    if (this.spotFactory.isOverlapping(plate.data, spot) != invertColors) {
                        this.ctx.fillStyle = colorsOn[drawStyle][Math.floor(Math.random() * colorsOn[drawStyle].length)];
                    } else {
                        this.ctx.fillStyle = colorsOff[drawStyle][Math.floor(Math.random() * colorsOff[drawStyle].length)];
                    }
                    this.spotFactory.draw(this.ctx, spot);

                    tree.insert(spot);
                }
            }
        }).bind(this);

        paintPlate();
    }

    generatePlateImage() {
        this.fillCanvas('white')
        this.ctx.fillStyle = '#000';
        this.ctx.font = '180px Arial';
        this.ctx.textBaseline = 'middle';
        this.ctx.textAlign = 'center';

        const plateContent = this.plateValueGenerator.getContent();
        this.ctx.fillText(plateContent, this.maxWidth / 2, this.maxHeight / 2);

        return {
            content: plateContent,
            data: this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
        };
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