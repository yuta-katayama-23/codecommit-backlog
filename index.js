const { CodeCommitClient, GetCommitCommand } = require("@aws-sdk/client-codecommit");

const cinfig = { region: "ap-northeast-1" };
const client = new CodeCommitClient(cinfig);

exports.handler = async (event) => {
    const input = {
        commitId: event.detail.commitId,
        repositoryName: event.detail.repositoryName
    }
    const command = new GetCommitCommand(input);

    const response = await client.send(command);
    return response;
}