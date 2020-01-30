require('dotenv').config();
const express = require('express');
      session = require('express-session'),
      massive = require('massive'),
      app = express(),
      {CONNECTION_STRING, SERVER_PORT, SESSION_SECRET} = process.env;
      authCtrl = require('./controllers/authController');
      treasureCtrl = require('./controllers/treasureController');
      auth = require('./middleware/authMiddleware');

app.use(express.json());

app.use(session({
    resave: true,
    saveUninitiliazed: false,
    secret: SESSION_SECRET,
})
);

//Endpoints
app.post('/auth/register', authCtrl.register);
app.post('/auth/login', authCtrl.login);
app.get('/auth/logout', authCtrl.logout);

app.get('/api/treasure/dragon', treasureCtrl.dragonTreasure);
app.get('/api/treasure/user', auth.usersOnly, treasureCtrl.getUserTreasure);
app.post('/api/treasure/user', auth.usersOnly, treasureCtrl.addUserTreasure);
app.get('/api/treasure/all', auth.usersOnly, auth.adminsOnly, treasureCtrl.getAllTreasure);


const port = SERVER_PORT;
massive(CONNECTION_STRING).then(db => {
    app.set('db', db)
    console.log('db connected');
    app.listen(port, () => console.log(`Server on ${port}`));
})
