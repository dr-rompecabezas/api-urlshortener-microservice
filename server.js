require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const dns = require('dns');
const Database = require("@replit/database");
const db = new Database();


// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// POST
const urlencodedParser = bodyParser.urlencoded({ 
  extended: false 
  });

app.post('/api/shorturl', urlencodedParser, async (req, res) => {

  if (!req.body.url.includes("http")) {
    res.json({ error: 'invalid url' });
    return;
  }

  try {
    
    const inputUrl = await req.body.url;
    const validatedUrl = await new URL(inputUrl);

    dns.lookup(validatedUrl.hostname, (err) => {
      if (err) {
        console.log(err);
        res.json({ error: 'invalid url' })
        return;
      }
      let randomInt = Math.floor(Math.random() * 10000) 
      
      db.set(randomInt, inputUrl).then(() => {
        res.json({
          original_url: inputUrl,
          short_url: randomInt
        })
      })
    })
  
  } catch (error) {
    console.log(error);
    res.json({ error: 'invalid url' })
    return;
  }
})


// const keyCheck = 5394;
// db.get(keyCheck).then(value => {
//   console.log(`key: ${keyCheck} value: ${value}`)});
// db.list().then(keys => {console.log(keys)});

// Delete individual records for testing
// db.delete(0)

// Redirect
app.get('/api/shorturl/:v', (req, res) => {
  const key = req.params.v
  db.get(key).then(value => {res.redirect(value)})
});


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});