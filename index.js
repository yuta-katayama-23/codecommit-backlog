const { CodeCommitClient, GetCommitCommand } = require("@aws-sdk/client-codecommit");
const axios = require("axios").default;
const querystring = require('querystring');

const regex = /^\[#(.*)]/
const config = {
    baseURL: `https://${process.env.BACKLOG_DOMAIN}.backlog.com/api/v2`
};
const client = new CodeCommitClient({ region: process.env.AWS_REGION });

exports.handler = async (event) => {
    if (event.detail.event === "referenceUpdated") {
        const input = {
            commitId: event.detail.commitId,
            repositoryName: event.detail.repositoryName
        }
        const command = new GetCommitCommand(input);
        const response = await client.send(command);
        const commitMsg = response.commit.message;
        const ticketSearchKey = commitMsg.match(regex)[1];

        /* Backlogから種別バグを取得 */
        try {
            // BacklogからprojectIdを取得
            let pjIds = [];
            if (process.env.BACKLOG_PJ_ID) pjIds.push(process.env.BACKLOG_PJ_ID);
            else {
                const pjs = await axios.get(`/projects?apiKey=${process.env.BACKLOG_API_KEY}`, config);
                pjs.data.forEach(pj => pjIds.push(pj.id));
            }

            // projectIdでそれぞれissueを取得（issue typeの指定があればそれでフィルタリング）
            let issues = [];
            for (const pjId of pjIds) {
                const fectedIssues = await axios.get(`/issues?apiKey=${process.env.BACKLOG_API_KEY}&projectId[]=${pjId}`, config);
                if (process.env.BACKLOG_ISSUE_TYPE_NAME) {
                    fectedIssues.data
                        .filter(issue => issue.issueType.name === process.env.BACKLOG_ISSUE_TYPE_NAME)
                        .map(issue => reObj(issue))
                        .forEach(issue => issues.push(issue));
                } else fectedIssues.data.map(issue => reObj(issue)).forEach(issue => issues.push(issue));
            }

            // issueの中からコミットメッセージのissue特定キーワードを含むものを抽出
            const issueIds = issues
                .filter(issue => issue.summary.includes(ticketSearchKey))
                .map(issue => issue.id);

            // issueにコメントを追加
            const message = "Commit Message";
            const hash = "Code Commit CommitHash";
            const link = `[${input.commitId}](https://${process.env.AWS_REGION}.console.aws.amazon.com/codesuite/codecommit/repositories/${input.repositoryName}/commit/${input.commitId}?region=${process.env.AWS_REGION})`;
            const data = querystring.stringify({
                content: `## ${message}\n${commitMsg}\n## ${hash}\n${link}`
            });

            let resultMap = {};
            for (const [index, issueId] of issueIds.entries()) {
                const result = await axios.post(`/issues/${issueId}/comments?apiKey=${process.env.BACKLOG_API_KEY}`, data, config);
                resultMap["index"] = index;
                resultMap["result"] = {
                    status: result.status,
                    statusText: result.statusText,
                    id: result.data.id,
                    content: result.data.content
                }
            }

            return resultMap;
        } catch (error) {
            return errorHandler(error);
        }
    } else return {
        result: {
            status: "not run lambda func",
            statusText: `It is an event:${event.detail.event} that is not covered`
        }
    }
}

const errorHandler = (error) => {
    const obj = {};
    if (error.response) {
        obj["status"] = error.response.status;
        obj["statusText"] = error.response.statusText;
        obj["data"] = error.response.data;
    }
    obj["message"] = error.message;
    return obj;
}

const reObj = (issue) => {
    let rObj = {};
    rObj["id"] = issue.id;
    rObj["summary"] = issue.summary;
    return rObj;
}