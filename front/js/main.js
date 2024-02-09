const body = document.querySelector('body')
const textBtn = document.querySelector('.test-btn')

textBtn.addEventListener('click', () => {
    if (body.classList.contains('light')){
        body.classList.remove('light');
        body.classList.add('dark');
        textBtn.innerHTML = 'light'
        return
    }
    if (body.classList.contains('dark')){
        body.classList.remove('dark');
        body.classList.add('light');
        textBtn.innerHTML = 'dark'
    }
})





const resultBtns = document.querySelectorAll('.result__btn')
resultBtns.forEach(btn => {
    btn.addEventListener("click", function () {
        resultBtns.forEach(function (btn) {
            btn.classList.remove("_active");
        });

        btn.classList.add("_active");
    });
})