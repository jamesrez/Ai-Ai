const mainFund = document.querySelector('.mainFund');
const fundContainer = document.querySelector('.fund');
const fundInput = new MoneyInput('.fundAmountInput');
const fundSubmit = document.querySelector('.fundSubmit');

var stripe = Stripe('pk_live_1XL5FBTM409USMd6lEcG5yDf00FE5Qacfj');

mainFund.addEventListener('click', () => {
  mainFund.style.display = 'none';
  fundContainer.style.display = 'flex';
})

fundSubmit.addEventListener('click', () => {
  let fundInputAmount = fundInput.input.value * 100;
  if(fundInputAmount >= 500) {
    axios.post('/fund', {
      amount : fundInputAmount
    }).then((d) => {
      if(d.err) return;
      if(d.data && d.data.id){
        stripe.redirectToCheckout({
          // Make the id field from the Checkout Session creation API response
          // available to this file, so you can provide it as parameter here
          // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
          sessionId: d.data.id
        }).then(function (result) {
          // If `redirectToCheckout` fails due to a browser or network
          // error, display the localized error message to your customer
          // using `result.error.message`.
        });
      }
    })
  }
})
