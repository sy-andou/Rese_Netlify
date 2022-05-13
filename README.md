# RSS<br>
飲食店予約管理アプリケーション<br>
![RSS1.png](/RSS1.png)
## 概要<br>
飲食店予約管理のWebアプリケーションです。<br>
飲食店の検索・お気に入り登録・予約・レビュー投稿を行うことができます。<br>
また一般利用者以外の店舗代表者や管理者用の管理機能もあります。　<br>
## 作成理由<br>
プログラミング学習の一環として作成しました。<br>
## 機能一覧<br>
### 利用者<br>
・新規ユーザー(利用者)登録<br>
・ログイン/ログアウト<br>
・店舗検索(エリア、ジャンル、店舗名での検索を行うことができます。)<br>
・お気に入り店舗登録/削除<br>
・予約登録/更新/削除<br>
・予約検索<br>
・来店時のQRコードの表示<br>
・来店日早朝にリマインドメール受信<br>
・レビュー投稿<br>
### 店舗代表者<br>
・利用者の来店確認<br>
・店舗登録/更新/削除<br>
・代表店舗の予約確認<br>
・代表店舗の予約検索<br>
・レビュー内容の確認<br>
・レビュー内容の検索<br>
### 管理者<br>
・ユーザー確認/削除<br>
・ユーザー検索<br>
・ユーザー(店舗代表者)登録<br>
・メール送信<br>
## 新規ユーザー登録~レビュー投稿までの流れ<br>
①新規ユーザー登録画面よりユーザー名、メールアドレス、パスワードを入力し仮登録を実施。仮登録後、送信されたメールのリンクをクリックすることにより本登録が完了します。<br>
②ログイン画面よりメールアドレス、パスワードを入力しログインを実施。<br>
③店舗詳細画面より来店日、来店時間、来店人数を入力し、予約を実施する。なお来店可能な時間や人数は店舗ごとに異なる。また他の利用者の予約状況から予約可能な人数が自動で計算される。その都合上、来店日時を選択した後でないと来店人数は選択できない。<br>
④マイページの予約情報確認画面からQRコードを表示する。店舗代表者アカウントでそのQRコードを読み取り、遷移したページで来店確認ボタンをクリックする。<br>
⑤来店確認が実施されたら、マイページの予約情報確認画面にレビュー投稿ボタンが現れる。そのボタンをクリックするとレビュー投稿が実施できる。<br>
## 言語・フレームワーク<br>
### フロントエンド<br>
・HTML/CSS<br>
・Nuxt.js 2.15.7<br>
### バックエンド<br>
・Laravel　8.69.0<br>
・MySQL 5.7.32<br>
## プラグイン<br>
・@nuxtjs/auth-next 5.0.0-1624817847.21691f1<br>
・vee-validate 3.4.13<br>
・vue-qriously 1.1.1<br>
・vuejs-paginate 2.1.0<br>
・tymon/jwt-auth<br>
## 環境構築<br>
・Nuxt.js<br>
　npx create-nuxt-app Rese_frontend<br>
・Laravel<br>
　composer create-project laravel/laravel Rese_backend --prefer-dist<br>
・auth<br>
　yarn add @nuxtjs/auth-next<br>
・vee-validate 3.4.13<br>
　yarn add vee-validate<br>
・vue-qriously<br>
　yarn add vue-qriously<br>
・vuejs-paginate<br>
　yarn add vuejs-paginate<br>
・tymon/jwt-auth<br>
　composer require tymon/jwt-auth<br>
 ## ER図<br>
 ![Rese_relation.drawio.png](/Rese_relation.drawio.png)
