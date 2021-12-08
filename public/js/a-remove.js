const aArray = document.querySelectorAll('.aremove');
console.log(aArray)
aArray.forEach(i => {
    i.addEventListener('click', () => {
        console.log(i)
        let parent = i.closest('div');
        console.log(parent)
        parent.remove();
    })
})