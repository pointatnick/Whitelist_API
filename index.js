const exp = require('express');
const app = exp();
const fs = require('fs');
const cors = require('cors');
const { convertCsvToJson } = require('./utils.js');
require('dotenv').config();

app.use(exp.json());
app.use(
  cors({
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
  })
);

convertCsvToJson();

app.get('/whitelisted', (_, res) => {
  res.send(require('./whitelisted.json'));
});

app.get('/whitelisted/member/:address', (req, res, value) => {
  let members = require('./whitelisted.json');
  const user = members.find((c) => c.member == req.params.address);
  if (!user) {
    res.status(404).send('the member was not found');
  }
  res.send(user);
});

app.put('/whitelisted/update/:address/:secret', (req, res) => {
  if (req.params.secret != process.env.SECRET_KEY) {
    res.status(404).send('Invalid Auth Key');
    return;
  }
  let index = 0;
  let result = {};
  let members = require('./whitelisted.json');
  members.forEach((whitelisted_user, i) => {
    if (whitelisted_user.member == req.params.address) {
      result = whitelisted_user;
      index = i;
    }
  });
  if (result == {}) {
    res.status(404).send('User does not exist');
    return;
  }
  result.reserve = req.body.reserve;
  members[index] = result;
  const data = JSON.stringify(members);
  fs.writeFile('whitelisted.json', data, 'utf8', (err) => {
    if (err) console.log(err);
  });
  res.send(result);
});
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}`));
