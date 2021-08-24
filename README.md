## CodeCommit-Backlog

以下の記事を参照

https://qiita.com/yuta-katayama-23/items/333ecee007e1f398abf4

## how to use

### install

```
git clone
npm install
```

### run test in local

create `.env` file, and add key below（`.env`ファイルを作成しその中に以下のキーを定義して自身のアカウント情報を記載してください）<br>
※`BACKLOG_PJ_ID` and `BACKLOG_ISSUE_TYPE_NAME` are optional items, It doesn't matter if they are undefined.（`BACKLOG_PJ_ID` and `BACKLOG_ISSUE_TYPE_NAME`はオプション設定のためのキーなため、未定義でも問題ありません。必要に応じて利用してください。）

```
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_REGION
BACKLOG_API_KEY
BACKLOG_DOMAIN
BACKLOG_PJ_ID
BACKLOG_ISSUE_TYPE_NAME

TEST_COMMIT_ID
TEST_REPO_NAME
```
