let keysBlock = document.querySelector('.skill-keys');
let keysBtn = document.querySelector('.trigger-keys');
let heading = document.querySelectorAll('.skills h3');

window.addEventListener('scroll', function() {
  if(keysBlock.offsetTop - window.scrollY <= 0){
    keysBlock.classList.add('sticky-small');
  }
  else{
    keysBlock.classList.remove('sticky-small');
  }
})

keysBtn.addEventListener('click',function(){
  keysBtn.classList.toggle('sticky-active');
  keysBlock.classList.toggle('sticky-active');
  for (var i = 0; i < heading.length; i++) {
    heading[i].classList.toggle('sticky-active');
  }
});
