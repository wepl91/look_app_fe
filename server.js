const Nylas = require('nylas');

Nylas.config({
  clientId: "3268r7wj0v6qtevs0wd67qk1w",
  clientSecret: "nve4x32l7tx45ubguwd2ksty",
});

const nylas = Nylas.with("xYfCskk5qYQQqVaK2OAL797xOJOZel");
const calendarID = "82t8lpay5krx8p0wqax2q07rn";

const express = require('express');
const bodyParser = require('body-parser');



const app = express();
const port = process.env.PORT || 5000;

const key = "AIzaSyDKurLTdc7-UR2x8OrBUYOyaFr5SBvRWjc";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * list events in calendar
 */
app.get('/api/google_calendar/events', (req, res) => {
  nylas.events.list().then(events => {
    res.send({
      events: events,
    });
  });
});

/**
 * Create an event
 */
app.post('/api/google_invite/send', (req, res) => {
  let event = nylas.events.build();

  event.when = { 
    start_time: req.body.from_hour, 
    end_time: req.body.to_hour 
  };
 
  event.title = "Reserva de turno en Hair&Head!";
  event.owner = "look.app.ok@gmail.com";
  event.location = req.body.location;
  event.participants = req.body.participants;
  event.description = req.body.description;
  event.calendarId = calendarID;

  try {
    event.save({ notify_participants: true }).then(event => {
      res.send({
        event: event.id,
        status: 'ok',
      });
    })
    .catch(error => {
      res.send({
        status: 'error',
        description: error,
      });
    });
  }
  catch(error) {
    res.send({
      status: 'error',
      description: error,
    });
  }

});

app.listen(port, () => console.log(`Listening on port ${port}`));