let keysBlock = document.querySelector('.skill-keys');
let keysBtn = document.querySelector('.trigger-keys');
let heading = document.querySelectorAll('.skills h3');
let softwareBlock = document.querySelector('#software');

window.addEventListener('scroll', function() {
  if(keysBlock.offsetTop - window.scrollY < 1){
    keysBlock.classList.add('sticky');
  }
  else{
    keysBlock.classList.remove('sticky');
  }

  if(softwareBlock.offsetTop - window.scrollY < 100){
    keysBlock.classList.add('color-change');
  }
  else{
    keysBlock.classList.remove('color-change');
  }
})

keysBtn.addEventListener('click',function(){
  keysBtn.classList.toggle('sticky-active');
  keysBlock.classList.toggle('sticky-active');
  for (var i = 0; i < heading.length; i++) {
    heading[i].classList.toggle('sticky-active');
  }
});
