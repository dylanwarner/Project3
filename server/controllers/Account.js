// require models
const models = require('../models');

// set account to the account model
const Account = models.Account;

// render login with token
const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

// function to logout and redirect back to home page
const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

// function to login 
const login = (request, response) => {
  const req = request;
  const res = response;

  // force cast to strings to cover some security flaws
  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  // if username and password are empty show error
  if (!username || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // authenticate the username and password
  return Account.AccountModel.authenticate(username, password, (err, account) => {
    // if error, show error for wrong username and password
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }

    req.session.account = Account.AccountModel.toAPI(account);

    // return json to maker page
    return res.json({ redirect: '/maker' });
  });
};

// singup function
const signup = (request, response) => {
  const req = request;
  const res = response;

  // cast to strings to cover up some security flaws
  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  // if username, first password, and second password are missing, show error
  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // if first password doesn't equal second password, show error
  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  // generate hash for password
  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
    };

    // create a new account using model
    const newAccount = new Account.AccountModel(accountData);

    const savePromise = newAccount.save();

    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);
      return res.json({ redirect: '/maker' });
    });

    savePromise.catch((err) => {
      console.log(err);

      // show error if username already exists
      if (err.code === 11000) {
        return res.status(400).json({ error: 'Username already in use.' });
      }

      // default error
      return res.status(400).json({ error: 'An error occurred' });
    });
  });
};

// function to get a token
const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };

  res.json(csrfJSON);
};

// export modules
module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signup = signup;
module.exports.getToken = getToken;
