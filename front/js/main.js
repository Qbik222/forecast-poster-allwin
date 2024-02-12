let isDragging = false;
let startX;
let scrollLeft;

const draggableContainer = document.getElementById('draggableContainer');
const itemsWrap = document.querySelectorAll('.welcome__row-wrap')
const row = document.querySelector('.welcome__row')
const itemsWrapLength = itemsWrap.length;

switch (itemsWrapLength) {
    case 5:
        row.style.maxWidth = '2098px';
        break;
    case 4:
        row.style.maxWidth = '1668px';
        break;
    case 3:
        row.style.maxWidth = '1258px';
        break;
    case 2:
        row.style.maxWidth = '828px';
        break;
    case 1:
        row.style.maxWidth = '418px';
        break;
    default:
        row.style.maxWidth = '2098px';
        break;
}

draggableContainer.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.pageX - draggableContainer.offsetLeft;
    scrollLeft = draggableContainer.scrollLeft;

});

draggableContainer.addEventListener('mouseleave', () => {
    isDragging = false;
});

draggableContainer.addEventListener('mouseup', () => {
    isDragging = false;
});

draggableContainer.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - draggableContainer.offsetLeft;
    const walk = (x - startX) * 2; // Увеличьте множитель, чтобы изменить скорость прокрутки
    draggableContainer.scrollLeft = scrollLeft - walk;
});
