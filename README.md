## CodeCommit-Backlog

## ローカルでの Lambda 実行

https://github.com/ashiina/lambda-local

## Lambda の実装

### AWS SDK for JavaScript v3 の利用

基本的には AWS SDK を使う時には、`AWS.config`に色々設定をする必要があるが、以下の 3 つについては環境変数で定義しておけば自動的にそれを使ってくれる<br>
[SDK バージョン 3 開発者ガイド　環境変数から Node.js への認証情報のロード](https://docs.aws.amazon.com/ja_jp/sdk-for-javascript/v3/developer-guide/loading-node-credentials-environment.html)

| AWS.config の Key | 環境変数の Key        | 説明                                                                   |
| ----------------- | --------------------- | ---------------------------------------------------------------------- |
| accessKeyId       | AWS_ACCESS_KEY_ID     | your AWS access key ID                                                 |
| secretAccessKey   | AWS_SECRET_ACCESS_KEY | your AWS secret access key                                             |
| sessionToken      | AWS_SESSION_TOKEN     | (AWS.Credentials) the optional AWS session token to sign requests with |

### Code Commit の Client

https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-codecommit/index.html

### Cloud Watch Events の Event オブジェクトの中身

```json
{
  "version": "0",
  "id": "xxxxxxxxxxxxxxxxxxxxxx",
  "detail-type": "CodeCommit Repository State Change",
  "source": "aws.codecommit",
  "account": "xxxxxxxxxx",
  "time": "2021-08-18T07:09:12Z",
  "region": "ap-northeast-1",
  "resources": [
    "arn:aws:codecommit:ap-northeast-1:xxxxxxxxxx:xxxxxxxxxxxxxxxxxxxxxx"
  ],
  "detail": {
    "callerUserArn": "arn:aws:iam::xxxxxxxxxx:user/xxxxxxxxxx",
    "commitId": "xxxxxxxxxxxxxxxxxxxxxx",
    "event": "referenceUpdated",
    "oldCommitId": "xxxxxxxxxxxxxxxxxxxxxx",
    "referenceFullName": "refs/heads/main",
    "referenceName": "main",
    "referenceType": "branch",
    "repositoryId": "xxxxxxxxxxxxxxxxxxxxxx",
    "repositoryName": "xxxxxxxxxxxxxxxxxxxxxx"
  }
}
```

https://docs.aws.amazon.com/ja_jp/codecommit/latest/userguide/monitoring-events.html#referenceUpdated
