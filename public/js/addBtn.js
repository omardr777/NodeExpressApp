const addBtn = document.getElementById('addBtn');
const cardContainer = document.getElementById('cardContainer');
addBtn.addEventListener('click', () => {
    let cardDiv = document.createElement('div');
    cardDiv.style.display = 'inline-block';
    cardDiv.className = "card";
    cardContainer.insertBefore(cardDiv, addBtn);
    let fromLabel = document.createElement('label');
    fromLabel.htmlFor = 'ftime';
    fromLabel.textContent = "From";
    cardDiv.appendChild(fromLabel);
    let fromInput = document.createElement('input');
    fromInput.type = 'time';
    fromInput.name = 'ftime';
    fromInput.required = true;
    cardDiv.append(fromInput);
    let toLabel = document.createElement('label');
    toLabel.htmlFor = 'ttime';
    toLabel.textContent = "To";
    cardDiv.appendChild(toLabel);
    let toInput = document.createElement('input');
    toInput.type = 'time';
    toInput.name = 'ttime';
    toInput.required = true;
    cardDiv.append(toInput);
    let removeBtn = document.createElement('a');
    removeBtn.className = 'btn danger';
    removeBtn.textContent = 'remove';
    removeBtn.addEventListener('click', (btn) => {
        br.remove();
        cardDiv.remove();
    })
    cardDiv.appendChild(removeBtn)
    let br = document.createElement('br');

    cardContainer.insertBefore(br, addBtn)
});
const reomveCard = (btn) => {
    console.log(btn)
}
