const socket = io();
const $productsFaker = document.getElementById('productsFaker');
// msgs
const $chat = document.getElementById('chat');
const $formChatLive = document.getElementById('formChatLive');
const $btnFormChat = document.getElementById('btnFormChat');
//new
const $FormAddMessages = document.getElementById('FormAddMessages');

    fetch('http://localhost:8080/api/productos-test')
    .then(str=>str.text())
    .then(getProducts=>{
        let newData = JSON.parse(getProducts);
        console.log(newData);
        let products = newData.products.map((p)=>{
            return `<tbody>
                        <tr class="${p.id}">
                            <th scope="row"></th>
                            <td>${p.id}</td>
                            <td>${p.nombre}</td>
                            <td>$${p.precio}</td>
                            <td><img class="rounded" width="90" height="70" src=${p.foto} alt=${p.nombre}></td>
                        </tr>
                    </tbody>
                    `
        }).join('');
        $productsFaker.innerHTML= products;
    })



$FormAddMessages.addEventListener('submit',function(e){
    e.preventDefault();
    let data = new FormData($FormAddMessages);
    let objectAuthor = {
        author:{
            nombre: data.get('name'),
            apellido: data.get('lastname'),
            edad: data.get('age'),
            email: data.get('email') ,
            avatar: data.get('avatar'),
            alias:data.get('nickname'),
        },
        text:data.get('text')
    }
    fetch('http://localhost:8080/api/messages/',{
        method:'POST',
        body:JSON.stringify(objectAuthor),
        headers:{
            'Content-Type':'application/json'
        }
    })
    .then(result=>result.json())
    .then(json=>{
        socket.emit('realTimeCards')
        $FormAddMessages.reset();
    })
})

// Normalizer 
// const author = new normalizr.schema.Entity('author',{},{idAttribute:'email'});
// const text = new normalizr.schema.Entity('text',{author:author},{idAttribute:'_id'});
// const message = new normalizr.schema.Entity('message',{
//         text:[text]
// })

socket.on("messagesHistory", data=>{
    console.log(data);
    // Cuando quiero desnormalizar no me deja usar las funciones de normalizr aunque lo tenga linkeado, no pude resolverlo
    // let normalizeFront = normalizr.desnormalize(data.result,messagess,data.entities);
    // console.log(normalizeFront);
    let dataNoDesnormalizada = data.entities.messages.mensajes.mensajes
    let messagess = dataNoDesnormalizada.map((msjs)=>{
        return `<div>
                    <span> <img class="rounded-circle" src="${msjs.author.avatar}" width="30px" alt=""> <b class="text-primary">${msjs.author.email}</b> <span class="text-secondary"> [${msjs.createdAt}]</span> : <span class="text-success fst-italic">${msjs.text}</span> </span>
                </div><br>`
    } ).join('');
    $chat.innerHTML= messagess
})

