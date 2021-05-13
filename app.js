const express = require('express');
const app = express();
const stripe = require('stripe')(process.env.STRIPE_SECRET);
const robots = require('./robots');
const bodyParser = require('body-parser');
var server = require('http').Server(app);

app.set('views', 'client')
app.set('view engine', 'pug');
// app.use(express.json())
app.use(express.static('client'));
app.use(bodyParser.json({ 
  limit: '50mb',
  extended: true,
  verify: (req, res, buf) => {
   req.rawBody = buf
  } 
}));

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

app.post('/order/checkout', async (req, res) => {
  const num = req.body.robotNum;
  if(!num) return;
  const session = await stripe.checkout.sessions.create({
    success_url: 'https://aiai.market/checkout/success',
    cancel_url: 'https://aiai.market/',
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: [
      {
        name: robots[num].name,
        description: 'AI-AI Robot Order',
        amount: robots[num].price * 100,
        currency: 'usd',
        quantity: 1,
      },
    ],
    shipping_address_collection: {
      allowed_countries: ['US', 'CA'],
    },
  })
  res.send({id : session.id});
})

app.post('/stripe/webhook', async(req, res) => {
  console.log("IN WEBHOOK");
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.log(err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  if (event.type === 'payment_intent.succeeded') {
    console.log("PAYMENT SUCCESS")
    const data = event.data.object;
    console.log(data);
  }
  res.json({received: true});
})

app.get('/checkout/success', async(req, res) => {
  res.render('index.pug', {checkoutSuccess: true});
})


server.listen(process.env.PORT || '3001', () => {
  console.log("AIAI ROBOT TIME!")
});
