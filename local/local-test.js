const lambdaLocal = require('lambda-local');
const path = require("path");

const regex = /local/;

const main = async () => {
    try {
        const response = await lambdaLocal.execute({
            lambdaPath: path.join(__dirname.replace(regex, ""), 'index.js'),
            timeoutMs: 3000
        })
        console.log("response", response);
    } catch (error) {
        console.log("error", error);
    }
}

main();