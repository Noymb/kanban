function createCard(){
  fetch('/add_card',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({
      color:document.getElementById('color').value,
      name:document.getElementById('name').value,
      desc:document.getElementById('desc').value
    })
  }).then(r=>r.json()).then(addCardToUI);
}

function addCardToUI(card){
  const div=document.createElement('div');
  div.className='card';
  div.draggable=true;
  div.dataset.id=card.id;
  div.style.background=card.color;
  div.innerHTML=`<b>${card.name}</b><br>${card.desc}`;
  div.addEventListener('dragstart', dragStart);
  document.querySelector('[data-status="'+card.status+'"]').appendChild(div);
}

function dragStart(e){
  e.dataTransfer.setData('id', e.target.dataset.id);
}

document.querySelectorAll('.column').forEach(col=>{
  col.addEventListener('dragover', e=>e.preventDefault());
  col.addEventListener('drop', e=>{
    const id=parseInt(e.dataTransfer.getData('id'));
    col.appendChild(document.querySelector('.card[data-id="'+id+'"]'));
    fetch('/move_card',{
      method:'POST', headers:{'Content-Type':'application/json'},
      body:JSON.stringify({id:id,status:col.dataset.status})
    });
  });
});

const trash=document.getElementById('trash');
trash.addEventListener('dragover', e=>e.preventDefault());
trash.addEventListener('drop', e=>{
  const id=parseInt(e.dataTransfer.getData('id'));
  const el=document.querySelector('.card[data-id="'+id+'"]');
  el.remove();
  fetch('/delete_card',{
    method:'POST', headers:{'Content-Type':'application/json'},
    body:JSON.stringify({id:id})
  });
});
