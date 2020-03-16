const express = require('express');
const app = express();
var server = require('http').Server(app);

app.set('views', './client')
app.set('view engine', 'pug');
app.use(express.static('client'));
//
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

server.listen(process.env.PORT || '3001', () => {
  console.log("AIAI ROBOT TIME!")
});
