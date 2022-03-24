const AWS = require('aws-sdk');
const SUB_FOLDERS = require('./subFoldersPlates')

const s3 = new AWS.S3({ apiVersion: '2006-03-01' });
const BUCKET_NAME = process.env.BUCKET_S3;
const DEFAULT_LIMIT = 10;

const bucketParams = {
    Bucket: BUCKET_NAME,
};

class PlateController {

    async handle(event) {
        try {
            const data = await s3.listObjects(bucketParams).promise();
            const { Contents: contents } = data;
            const limit = this.extractLimit(event, contents.length);
            const plates = this.getPlates(contents, limit);

            return {
                statusCode: 200,
                body: JSON.stringify(plates),
                headers: {
                    "Access-Control-Allow-Headers": "*",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET"
                }
            }
        } catch (err) {
            return {
                statusCode: 500,
                body: JSON.stringify({ message: err.message })
            }
        }
    }

    extractLimit(event, filesLength) {
        if (event.queryStringParameters) {
            if (filesLength < event.queryStringParameters.limit) {
                return filesLength;
            }

            return event.queryStringParameters.limit;
        }

        if (filesLength < DEFAULT_LIMIT) {
            return filesLength;
        }

        return DEFAULT_LIMIT;
    }

    getPlates(files, limit) {
        const selected = [];
        const groupedPlates = this.groupByKeyPrefix(files);
        const TYPES_PLATES_QUANTITY = SUB_FOLDERS.length;
        let currentType = 0;

        for (let i = 0; i < limit; i++) {
            const sub = SUB_FOLDERS[currentType]
            const groupedSet = groupedPlates[sub];
            currentType++;

            const reachMaxIndex = currentType === TYPES_PLATES_QUANTITY;
            if (reachMaxIndex) {
                currentType = 0;
            }

            const position = Math.floor(Math.random() * groupedSet.length);
            const { Key: key } = groupedSet.splice(position, 1)[0];
            const [, onlyName] = key.split("/");

            selected.push({
                key: this.removeExtension(onlyName),
                url: `https://${BUCKET_NAME}.s3.amazonaws.com/${key}`
            });
        }

        return selected;
    }

    groupByKeyPrefix(files) {
        const groups = [];

        files.forEach(plate => {
            const { Key: key } = plate;
            const [subfolder] = key.split("/");

            if (!groups[subfolder]) {
                groups[subfolder] = []
            }
            groups[subfolder].push(plate)
        })

        return groups;
    }

    removeExtension(key) {
        return key.split(".")[0];
    }
}

const controller = new PlateController();
module.exports.handle = controller.handle.bind(controller);