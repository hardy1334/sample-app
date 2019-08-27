'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const socketIO = require('socket.io');
const request = require('request');
const path = require('path');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');
const SIGNIN = path.join(__dirname, 'signin.html');
const SIGNUP = path.join(__dirname, 'signup.html');
const MANIFEST = path.join(__dirname, 'manifest.json');
const STATIC = path.join(__dirname, 'static');
const APP_KEY = 'eNIxJ6d88623afc4b403d80d9a29e6a0d1726';

const User = require('./user');

// database config

const db = require('./keys').mongoURI;

mongoose
  .connect(db)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const server = express()
  .use(bodyParser.json())
  .use('/static', express.static(STATIC))
  .get('/', (req, res) => res.sendFile(INDEX))
  .get('/signin', (req, res) => res.sendFile(SIGNIN))
  .get('/signup', (req, res) => res.sendFile(SIGNUP))
  .get('/manifest.json', (req, res) => res.sendFile(MANIFEST))
  .get('/auth/trueSDK', (req, res) => {
    console.log(`Initializing True SDK for: ${req.query.phoneNumber}`);
    const options = {
      method: 'POST',
      url: 'https://api4.truecaller.com/v1/apps/requests',
      headers: { appkey: APP_KEY },
      body: { phoneNumber: req.query.phoneNumber },
      json: true
    };
    request(options, function(error, response, body) {
      if (error) res.send('error');
      console.log(`True SDK initialized. Request ID: ${body.requestId}`);
      res.send(body);
    });
  })

  .post('/auth/trueSDK/callback', (req, res) => {
    const options = {
      method: 'GET',
      url: 'https://profile4-noneu.truecaller.com/v1/default',
      headers: { Authorization: `Bearer ${req.body.accessToken}` },
      json: true
    };

    let UserData;

    request(options, function(error, response, body) {
      if (error) console.log('Error: Could not fetch profile.');
      console.log('Get the user profile data');
        if (body.status != undefined) {
        UserData = new User({
          requestId: req.body.requestId,
          status: body.status
        });
        UserData.save()
          .then(data => console.log('Skip Message received'))
          .catch(err => console.log(err));
      } else {
        UserData = new User({
          name: { first: body.name.first, last: body.name.last },
          phone: body.phoneNumbers[0],
          email: body.onlineIdentities.email,
          userId: body.userId,
          requestId: req.body.requestId
        });
        UserData.save()
          .then(data => console.log('Data has been saved'))
          .catch(err => console.log(err));
      }

    });

    res.send({ status: 'ok' });
  })

  .get('/user/data/:user_id', (req, res) => {
    let userid = req.params.user_id;
    User.find({ requestId: userid })
      .then(data => {
       res.json(data);
      })
      .catch(err => console.log(err));
  })

  .listen(PORT, () => console.log(`Listening on ${PORT}`));
