class CircleFactory {

    constructor(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
    }

    create() {
        var minRadius = (this.canvasWidth + this.canvasHeight) / 300;
        var maxRadius = (this.canvasWidth + this.canvasHeight) / 150;
        var radiusInternalCircle = minRadius + Math.random() * (maxRadius - minRadius);

        var angle = Math.random() * 2 * Math.PI;
        var radius = Math.random() * (Math.min(this.canvasWidth, this.canvasHeight) * 0.48 - 2);
        var offsetX = this.canvasWidth * 0.5 + Math.cos(angle) * radius;
        var offsetY = this.canvasHeight * 0.5 + Math.sin(angle) * radius;

        return { x: offsetX, y: offsetY, radius: radiusInternalCircle };
    }

    isOverlapping(img_data, circle) {
        var x = circle.x;
        var y = circle.y;
        var r = circle.radius;

        var dimensionsX = [x, x, x, x - r, x + r, x - r * 0.93, x - r * 0.93, x + r * 0.93, x + r * 0.93, x - r * 0.70, x - r * 0.70, x + r * 0.70, x + r * 0.70] //Calcula para ver se sobrepoem no eixo X
        var dimensionsY = [y, y - r, y + r, y, y, y + r * 0.93, y - r * 0.93, y + r * 0.93, y - r * 0.93, y + r * 0.70, y - r * 0.70, y + r * 0.70, y - r * 0.70] //Calcula para ver se sobrepoem no eixo Y

        for (var i = 0; i < dimensionsX.length; i++) {
            var x = dimensionsX[i];
            var y = dimensionsY[i];

            var index = (Math.floor(y) * img_data.width + Math.floor(x)) * 4;

            var r = img_data.data[index];
            var g = img_data.data[index + 1];
            var b = img_data.data[index + 2];
            var a = img_data.data[index + 3];

            if ((r + g + b) * (a / 255) < 127) {
                return true;
            }
        }
        return false;
    }

    intersects(circle1, circle2) {
        return Math.pow(circle2.x - circle1.x, 2) +
            Math.pow(circle2.y - circle1.y, 2) <
            Math.pow(circle1.radius + circle2.radius, 2);
    }

    draw(canvasCtx, circle) {
        canvasCtx.beginPath();
        canvasCtx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
        canvasCtx.fill();
        canvasCtx.closePath();
    }
}

module.exports = { CircleFactory }
