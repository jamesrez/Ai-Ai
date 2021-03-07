const express = require('express');
const app = express();
const stripe = require('stripe')(process.env.STRIPE_SECRET || 'sk_test_AD06t8AX4i615N3hTdrlUAvv00LVhgyd3Y');
var server = require('http').Server(app);

app.set('views', 'client')
app.set('view engine', 'pug');
app.use(express.json())
app.use(express.static('client'));

// let checkAuth = function (req, res, next) {
//   if (typeof req.cookies.userToken === 'undefined' || req.cookies.userToken === null) {
//     req.user = null;
//   } else {
//     // if the user has a JWT cookie, decode it and set the user
//     var token = req.cookies.userToken;
//     var decodedToken = jwt.decode(token, { complete: true }) || {};
//     req.user = decodedToken.payload;
//   }
//   next();
// }
// app.use(checkAuth);

app.get('/', (req, res) => {
  res.render('index.pug')
})

app.get('/fund-success', (req, res) => {
  res.render('index.pug', {funded : true});
})

app.post('/fund', (req, res) => {
  if(!req.body.amount){
    res.send({err : "Could not create session"});
  }
  async function createStripeSession(){
    const session = await stripe.checkout.sessions.create({
      success_url: 'https://ai-ai.herokuapp.com/fund-success',
      cancel_url: 'https://ai-ai.herokuapp.com/',
      payment_method_types: ['card'],
      line_items: [
        {
          name: 'AI-AI Fund',
          description: 'Thanks for Funding AI-AI!',
          amount: req.body.amount,
          currency: 'usd',
          quantity: 1,
        },
      ],
    })
    res.send({id : session.id});
  }
  createStripeSession();
});


server.listen(process.env.PORT || '3001', () => {
  console.log("AIAI ROBOT TIME!")
});
