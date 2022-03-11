const WHITE_COLOR_RGBA_SUM = 1020;
const DEFAULT_ALPHA = 255;
const RGBA_BYTES = 4;

class SpotFactory {

    constructor(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
    }

    create() {
        const minRadius = (this.canvasWidth + this.canvasHeight) / 230;
        const maxRadius = (this.canvasWidth + this.canvasHeight) / 100;
        const radiusInternalCircle = minRadius + Math.random() * (maxRadius - minRadius);

        const angle = Math.random() * 2 * Math.PI;
        const radius = Math.random() * (Math.min(this.canvasWidth, this.canvasHeight) * 0.48 - 2);
        const offsetX = this.canvasWidth * 0.5 + Math.cos(angle) * radius;
        const offsetY = this.canvasHeight * 0.5 + Math.sin(angle) * radius;

        return { x: offsetX, y: offsetY, radius: radiusInternalCircle };
    }

    isOverlapping(img_data, spot) {
        const x = spot.x;
        const y = spot.y;
        const radius = spot.radius;

        const dimensionsX = [x, x, x, x - radius, x + radius, x - radius * 0.93, x - radius * 0.93, x + radius * 0.93, x + radius * 0.93] //Calcula para ver se sobrepoem no eixo X
        const dimensionsY = [y, y - radius, y + radius, y, y, y + radius * 0.93, y - radius * 0.93, y + radius * 0.93, y - radius * 0.93] //Calcula para ver se sobrepoem no eixo Y

        for (var i = 0; i < dimensionsX.length; i++) {
            const offsetX = dimensionsX[i];
            const offsetY = dimensionsY[i];

            const index = (Math.floor(offsetY) * img_data.width + Math.floor(offsetX)) * RGBA_BYTES;
            const red = img_data.data[index];
            const green = img_data.data[index + 1];
            const blue = img_data.data[index + 2];

            const pixelIsNotBlank = (red + green + blue + DEFAULT_ALPHA) !== WHITE_COLOR_RGBA_SUM;
            if (pixelIsNotBlank) {
                return true;
            }
        }
        return false;
    }

    intersects(newSpot, nearSpot) {
        const axisSum = Math.pow(nearSpot.x - newSpot.x, 2) + Math.pow(nearSpot.y - newSpot.y, 2);
        const radiusSum = Math.pow(newSpot.radius + nearSpot.radius, 2);
        
        const reductionOfDistanceBetweenSpots = 1.05;

        return axisSum * reductionOfDistanceBetweenSpots < radiusSum;
    }

    draw(canvasCtx, spot) {
        canvasCtx.beginPath();
        canvasCtx.arc(spot.x, spot.y, spot.radius, 0, 2 * Math.PI);
        canvasCtx.fill();
        canvasCtx.closePath();
    }
}

module.exports = { SpotFactory }
