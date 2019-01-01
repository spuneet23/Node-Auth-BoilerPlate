const Card = require("./controllers/cards");

module.exports = function(app) {
  app.get('/', function(req,res) {
     res.send({ hi: 'there' });
  });

 app.post('/createCard', Card.createCard);
 
 app.get('/getCards', Card.getCards);
 
 app.post('/uploadVideo',Card.uploadVideo)
 
}