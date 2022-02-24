const { createWriteStream } = require('fs')
const { kdTree } = require('../kd3/kdTree');
const { CircleFactory } = require('./circleFactory');
const { PlateValueGenerator } = require('../plategenerator/platevaluegenerator')
const createCanvas = require('canvas').createCanvas;

const { colorsOn, colorsOff } = require('../colors/colors')
const invertColors = false;

class Generator {
    constructor(maxWidth, maxHeight, s3Client) {
        this.maxWidth = maxWidth;
        this.maxHeight = maxHeight;
        this.s3Client = s3Client;
        this.plateValueGenerator = new PlateValueGenerator();
        this.circleFactory = new CircleFactory(this.maxWidth, this.maxHeight);
        this.canvas = createCanvas(800, 800);
        this.ctx = this.canvas.getContext('2d');
    }

    generate() {
        console.time("start")
        const drawStyle = 0;
        const plate = this.generatePlateImage();
        this.name = plate.content;
        this.fillCanvas('white')

        var tree = new kdTree([], function (a, b) {
            return Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2);
        }, ['x', 'y']);

        var stepTry = 0;
        var area = (this.canvas.width * this.canvas.height); //determina numbers of points

        var steps = area / 150;

        var paintPlate = (function () {
            while (stepTry < steps) {
                var tries = 0;

                while (true) {
                    tries++;
                    if (tries > 100) {
                        stepTry++;
                        paintPlate();
                        return;
                    }

                    var circle = this.circleFactory.create();
                    var nearest = tree.nearest(circle, 8);

                    var intersects = false;

                    for (var j = 0; j < nearest.length; j++) {
                        var nearCircle = nearest[j][0];
                        if (this.circleFactory.intersects(circle, nearCircle)) {
                            intersects = true;
                            break;
                        }
                    }

                    if (intersects) {
                        continue;
                    }

                    stepTry++;
                    if (this.circleFactory.isOverlapping(plate.data, circle) != invertColors) {
                        this.ctx.fillStyle = colorsOn[drawStyle][Math.floor(Math.random() * colorsOn[drawStyle].length)];
                    } else {
                        this.ctx.fillStyle = colorsOff[drawStyle][Math.floor(Math.random() * colorsOff[drawStyle].length)];
                    }
                    this.circleFactory.draw(this.ctx, circle);

                    tree.insert(circle);
                }
            }
        }).bind(this);

        paintPlate();
        console.timeEnd("start")
    }

    generatePlateImage() {
        this.fillCanvas('white')
        this.ctx.fillStyle = '#000';
        this.ctx.font = '400px Arial';
        this.ctx.textBaseline = 'middle';
        this.ctx.textAlign = 'center';
        const plateContent = this.plateValueGenerator.getValue()
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

    async sendToS3() {
        const stream = this.canvas.createPNGStream()
        await this.s3Client.put({
            bucket: 'platesishihara',
            key: this.name + '.png',
            body: stream
        });
    }

    async store() {
        console.log('storing')
        const out = createWriteStream(this.name + '.png');
        const stream = this.canvas.createPNGStream()
        stream.pipe(out);
        await new Promise((res, rej) => {
            out.on('finish', res);
        })
    }
}

module.exports = Generator;