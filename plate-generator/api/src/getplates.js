const AWS = require('aws-sdk');
const s3 = new AWS.S3({ apiVersion: '2006-03-01' });
const BUCKET_NAME = process.env.BUCKET_S3;
const DEFAULT_LIMIT = 10;

const bucketParams = {
    Bucket: BUCKET_NAME,
};

async function handle(event) {
    try {
        const data = await s3.listObjects(bucketParams).promise();
        const { Contents: contents } = data;
        const limit = extractLimit(event, contents.length);
        const plates = getPlates(contents, limit);

        return {
            statusCode: 200,
            body: JSON.stringify(plates)
        }
    } catch (err) {
        console.log("Deu erro")
        return {
            statusCode: 500,
            body: {
                message: JSON.stringify(err)
            }
        }
    }
}

function extractLimit(event, filesLength) {
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

function getPlates(files, limit) {
    const selected = [];
    const alreadyChosen = [];

    for (let i = 0; i < limit; i++) {
        const filePosition = Math.floor(Math.random() * limit);
        if (alreadyChosen.includes(filePosition)) {
            i--;
            continue;
        }

        const { Key:key } = files[filePosition];

        selected.push({
            key: removeSuffixPng(key),
            url: `https://${BUCKET_NAME}.s3.amazonaws.com/${key}`
        });

        alreadyChosen.push(filePosition);
    }

    return selected;
}

function removeSuffixPng(key) {
    return key.split(".")[0];
}

module.exports = { handle };