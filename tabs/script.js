const tabsButtons = document.querySelectorAll('.tabsSelector');
const tabsContent = document.querySelectorAll('.tabsContent');

tabsContent[0].style.display = 'flex';

tabsButtons.forEach((button,index) => {
  button.addEventListener('click', function() {
    tabsButtons.forEach(t => {t.classList.remove('active')});
    tabsContent.forEach(c => {c.style.display = 'none'});
    this.classList.add('active');
    tabsContent[index].style.display = 'flex';
  });

});