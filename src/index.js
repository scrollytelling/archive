import baguetteBox from 'baguettebox.js';
import List from 'list.js';
import dayjs from 'dayjs';

// import './main.scss';
// import template from './index.html.mustache';

baguetteBox.run('.screenshots')

var times = document.querySelectorAll('time')
for(var i=0; i<times.length; i++) {
  var datetime = times[i].getAttribute('datetime')
  var published = dayjs(datetime)
  times[i].innerHTML = published.format("dddd D MMMM YYYY, h:mm:ss")
}

new List('scrollies', {
  valueNames: [
    'title',
    'author',
    { name: 'published', attr: 'datetime' }
  ],
  fuzzySearch: {
    searchClass: 'search'
  }
})

// Toggler: add class 'is-open' to link href with class 'will-open'.
document.addEventListener('click', function(event) {
  if(event.target.classList.contains('will-collapse')) {
    event.preventDefault()
    var subject = document.querySelector(event.target.hash)
    subject.style.maxHeight = `${subject.scrollHeight}px`
    subject.classList.toggle('is-collapsed')
  }
})
