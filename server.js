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

app.get('/api/google_calendar/events', (req, res) => {
  nylas.events.list().then(events => {
    res.send({
      events: events
    })
  });
})
app.post('/api/google_invite/send', (req, res) => {
  let event = nylas.events.build();

  console.dir(req.body.to_date);
  console.dir(req.body.from_date);
  event.when = { start_time: req.body.from_hour, end_time: req.body.to_hour };
 
  event.title = "Reserva de turno en Look App!";
  event.owner = "look.app.ok@gmail.com";
  event.location = req.body.location//'Universidad Nacional General Sarmiento';
  event.participants = req.body.participants//[{ email: 'pedrog4747@gmail.com' }, { email: 'walter.pereyra.lopez91@gmail.com' }];
  event.description = req.body.description//'La rompemos en la demo con Javi!';
  event.calendarId = calendarID;

  try {
    event.save({ notify_participants: true }).then(event => {
      res.send({
        event: event.id,
        status: 'ok',
      })
    })
      // .catch(error => {
      //   res.send({
      //     status: 'error',
      //     description: error,
      //   });
      // });
  }
  catch(error) {
    console.log(error);
  }

});

app.listen(port, () => console.log(`Listening on port ${port}`));