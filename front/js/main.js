let isDragging = false;
let startX;
let scrollLeft;

const draggableContainer = document.getElementById('draggableContainer');

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
