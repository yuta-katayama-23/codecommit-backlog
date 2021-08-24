const lambdaLocal = require('lambda-local');
const path = require("path");
const dotenv = require('dotenv')
dotenv.config();

const regex = /test/;

const jsonPayload = {
    detail: {
        commitId: process.env.TEST_COMMIT_ID,
        repositoryName: process.env.TEST_REPO_NAME
    }
}

const main = async () => {
    try {
        const response = await lambdaLocal.execute({
            event: jsonPayload,
            lambdaPath: path.join(__dirname.replace(regex, ""), 'index.js'),
            timeoutMs: 5000
        })
        console.log("response", response);
    } catch (error) {
        console.log("error", error);
    }
}

main();