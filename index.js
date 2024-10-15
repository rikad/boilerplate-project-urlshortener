require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const dns = require('dns');

// Basic Configuration
const port = process.env.PORT || 3000;

const urlStore = ['https://google.com']

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', function(req, res) {
  const url = req.body.url
  const host = new URL(url).host
  console.log(host)

  dns.lookup(host, (err) => {
    if (err) {
      res.json({ error: 'invalid url' });
    } else {
      urlStore.push(url)
      res.json({ original_url : url, short_url : urlStore.length-1 });
    }
  })
});

app.get('/api/shorturl/:url', function(req, res) {
  const id = parseInt(req.params.url)
  const url = urlStore[id]

  if (url) {
    res.redirect(url)
  } else {
    res.json({ error: 'invalid url' });
  }
});


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
