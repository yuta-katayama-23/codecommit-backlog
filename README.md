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

Code Commit への push の際に、Cloud Watch Events としては以下の`referenceUpdated`というタイプのイベントが発火する<br>そ Event オブジェクトの中身としては以下

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

### Backlog API でコミットハッシュを issue(チケット)に記載

コミットハッシュを issue に紐づける処理のロジックとしては以下<br>（環境変数 BACKLOG_PJ_ID で Backlog から取得する issue の対象プロジェクトを projectId で絞り込めるように、BACKLOG_ISSUE_TYPE_NAME で プロジェクト内の issue を取得する際に対象を issue type で絞り込めるように実装した）

1. **BACKLOG_PJ_ID=ALL の場合**<br>Backlog の PJ 全てを取得<br>**BACKLOG_PJ_ID=ALL 以外の場合**<br>BACKLOG_PJ_ID の projectId のみ利用
1. **BACKLOG_ISSUE_TYPE_NAME が未指定の場合**<br>projectId で Backlog の プロジェクト内の issue データを全件取得<br>**BACKLOG_ISSUE_TYPE_NAME が指定されている場合**<br>BACKLOG_ISSUE_TYPE_NAME の issue type に合致する issue だけを抽出<br>
1. コミットメッセージに書かれている issue との紐づけ文言から、commit に関係する issue の issueId を抽出
1. issuesId を用いて Backlog にコメントを記載

利用した Backlog の API は以下<br>
※今回は[認証](https://developer.nulab.com/ja/docs/backlog/auth)は API KEY で行っている

- [プロジェクト一覧の取得](https://developer.nulab.com/ja/docs/backlog/api/2/get-project-list)

- [課題一覧の取得](https://developer.nulab.com/ja/docs/backlog/api/2/get-issue-list)
- [課題コメントの追加](https://developer.nulab.com/ja/docs/backlog/api/2/add-comment)

axios で`Content-Type:application/x-www-form-urlencoded `で POST するには[Query string](https://github.com/axios/axios#query-string)を使えばいい

## トラブルシューティング

### forEach は非同期処理で利用不可

非同期の処理は`for-of`とかを使う
※forEach は同期関数を期待する<br>https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach

ちなみに、forEach の中身は`while`になっている
