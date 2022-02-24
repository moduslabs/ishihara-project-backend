const AWS = require('aws-sdk');

const client = new AWS.S3({
    region: "sa-east-1"
});

class S3ClientAdapterV2 {

    async put({ bucket, key, body }) {
        try {
            const params = { Bucket: bucket, Key: key, Body: body };
            await client.upload(params).promise();
        } catch (err) {
            console.log(err.message)
        }
    }
}

module.exports = { S3ClientAdapterV2 }