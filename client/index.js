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

$(document.body).on('click', (e) => {
  startAudio();
})

let audioPlaying = false;
var audio = new Audio('./assets/glasstown.mp3');
function startAudio(){
  if(!audioPlaying){
    audioPlaying = true;
    audio.play();
  }
}

const robots = {

  one : {
    video : 'https://www.youtube.com/embed/86jfIiBGWqw',
    thumbnail : './assets/robot1.png',
    name : "Kiwi Robot",
    description : "Kiwi delivers food and medical supplies to those around its area."
  },

  two : {
    video : 'https://www.youtube.com/embed/dQWEOhXB70M',
    name : 'Miim',
    description : "Miim is a feminine-looking humanoid robot created by the National Institute of Advanced Industrial Science and Technology"
  },

  three : {
    video : 'https://www.youtube.com/embed/f4sLFrprfbw',
    name : "Pepper",
    description : "Pepper is a family-friendly robot that can help out around the house."
  }

}


$('.featured').on('click', (e) => {
  const robotNum = e.currentTarget.id;
  const robot = robots[robotNum];
  $('.featuredContent').css('display', 'flex');
  $('.featuredVideo').attr('src', robot.video);
  $('.featuredName').text(robot.name);
  $('.featuredDesc').text(robot.description);
})

$('.featuredCloseBtn').on('click', (e) => {
  $('.featuredContent').css('display', 'none');
})
