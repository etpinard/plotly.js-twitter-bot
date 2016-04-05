var GitHubApi = require('github');
var Twitter = require('twitter');
var CREDS = require('./creds.json');

var githubClient = new GitHubApi({ version: '3.0.0' });

var twitterClient = new Twitter({
  consumer_key: CREDS.TWITTER_CONSUMER_KEY,
  consumer_secret: CREDS.TWITTER_CONSUMER_SECRET,
  access_token_key: CREDS.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: CREDS.TWITTER_ACCESS_TOKEN_SECRET
});

getReleaseInfo();

function getReleaseInfo() {
  var opts = {
    owner: 'plotly',
    repo: 'plotly.js'
  };

  githubClient.releases.listReleases(opts, function(err, res) {
    if(err) throw err;

    var releaseInfo = res[0];

    tweet(releaseInfo);
  });
}

function tweet(releaseInfo) {
  var opts = {
    status: formatStatus(releaseInfo)
  };

  twitterClient.post('statuses/update', opts, function(err, tweet, res) {
    if(err) throw err;

    console.log('Your tweet:');
    console.log(tweet.text);
    console.log('  has been successfully posted!');
  });
}

function formatStatus(releaseInfo) {
  return [
    'NEW plotly.js release:',
    releaseInfo.html_url,
    '#plotly'
  ].join(' ');
}
