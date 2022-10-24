class Card {
  Card(id, marca, url, precio, detalle, estado) {
    this.id = id;
    this.marca = marca;
    this.url = url;
    this.precio = precio;
    this.detalle = detalle;
    this.estado = estado;
  }
}

const pathname = window.location.pathname;
/* Formulario de registro */
const login = document.getElementById('submit__form');
/* Index */
const index = document.getElementById('gallery_main');
const card = document.getElementById('submit_card_new');
const cartico = document.getElementById('header_cart');
const listcart = document.querySelector('.listcart');
const countheart = document.querySelector('.heart__count');
const countcart = document.querySelector('.cart_count');
const compra = document.getElementById('compra');
const favorito = document.getElementById('favorito');
const indicador = document.getElementById('indicador');
const buscador = document.querySelector('.sectionb__search');
const botoncomp = document.getElementById('botoncomp');
/* Administracion */
const section1 = document.getElementById('seccion1');
const section2 = document.getElementById('seccion2');
const section3 = document.getElementById('seccion3');
const section4 = document.getElementById('seccion4');
const com = document.getElementById('compra');
const btn_comprar = document.getElementById('btn_comprar');
const total = document.getElementById('carritototal');
const formatter = new Intl.NumberFormat('es-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
});

function Crear() {
  const cardsarr = [];
  localStorage.setItem('cards', JSON.stringify(cardsarr));
}

async function Leer() {
  cardsarr = JSON.parse(localStorage.getItem('cards'));
  let productos = await api();
  /* Peticion a la api e introduce los elementos llamado al array productos */
  productos.forEach((elemento) => {
    let { alt, id, photographer, width } = elemento;
    let { portrait } = elemento.src;
    cardsarr.push({ id: id, detalle: alt, marca: photographer, precio: width, url: portrait, estado: 'I' });
  });
  /* Creacion de tarjeas de la pagina principal la funcion 
  crear_elementos hace el trabajo para las cards */
  cardsarr.forEach((elemento) => {
    let { id, marca, url, detalle, precio } = elemento;
    let li = crear_elemento(url, detalle, precio, id, marca);
    index.innerHTML += li.innerHTML;
  });
}

async function api() {
  return await fetch('https://api.pexels.com/v1/search?query=Fashion&per_page=100', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: '563492ad6f917000010000010162e72f14264d4d811a83852b2c1a3d',
    },
  })
    .then((response) => response.json())
    .then((data) => data.photos)
    .catch((err) => console.log(err));
}

function proceso_carga(b, car) {
  let parrafo = document.createElement('p');
  let marc = document.createElement('h2');
  let price = document.createElement('p');
  let detail = document.createElement('p');
  let { marca, precio, detalle, url } = b;
  /* Creacion de marca */
  marc.innerText = marca.value;
  marca.setAttribute('disabled', '');
  /* Ingreso de precio */
  price.innerText = '$' + precio.value;
  /* Ingreso de detalle */
  detail.innerText = detalle.value;
  /* Registro de id */
  if (cardsarr.length == 0) {
    car.id = 1;
  } else {
    let limite = cardsarr.length - 1;
    aux = cardsarr[limite].id;
    aux++;
    car.id = aux;
  }
  /* Subida */
  car.marca = marca.value;
  car.url = url.value;
  car.precio = precio.value;
  car.detalle = detalle.value;
  section3.append(price, detail);
  /* -------- */
}
function traer_carro() {
  let cart = sessionStorage.length == 1 ? true : false;
  cart ? sessionStorage.setItem('cart', JSON.stringify((cart = []))) : (cart = JSON.parse(sessionStorage.getItem('cart')));
  return cart;
}
function traer_carro_compra() {
  let cartcompra = sessionStorage.length > 1 && sessionStorage.length < 3 ? true : false;
  cartcompra ? sessionStorage.setItem('cartbuy', JSON.stringify((cartcompra = []))) : (cartcompra = JSON.parse(sessionStorage.getItem('cartbuy')));
  return cartcompra;
}

function crear_elemento(url, detalle, precio, id, marca) {
  let li = document.createElement('li');
  li.innerHTML = `<li class="cardview" id="${id}"><div class="cardview__form">
  <button  type="submit" class="cardview__form-button" id="${id}"></button>
  </div>
  <div class="cardview__imagen"><img src=${url}></div>
  <div class="cardview__content">
  <h2 class="cardview__content-detail">${detalle}</h2>
  <p class="cardview__content-price">${formatter.format(precio)}</p>
  <i class="cardview__content-share">hasta 3 cuotas sin interes</i>
  <span class="cardview__content-mark">por ${marca}</span>
  </div></li>`;
  return li;
}

function crear_elemento_carr(url, detalle, precio, id) {
  let li = document.createElement('li');
  li.setAttribute('id', id);
  li.innerHTML = `<img src="${url}" alt=""><i>${detalle}</i><span>$${precio}</span>`;
  return li;
}

function renderizar_carro(cart, listcart) {
  cart.forEach((elemento) => {
    let { url, detalle, precio, id } = elemento;
    let li = crear_elemento_carr(url, detalle, precio, id);
    listcart.append(li);
  });
}

function anadir_carro(e, cart) {
  let id = e.target.id;
  const aux = cart.findIndex((elemento) => {
    return elemento.id == id;
  });
  const aux1 = cartcompra.findIndex((elemento) => {
    return elemento.id == id;
  });
  /* Busca el id del producto en el carrito si no esta siginifica que nunca lo agrego
  por la cual pasa a agregarlo en caso contrario procede a negarle a agregarlo */
  if (aux == -1 && aux1 == -1) {
    const indice = cardsarr.findIndex((elemento) => {
      return elemento.id == id;
    });
    let { url, detalle, precio } = cardsarr[indice];
    /* Cambia el estado al mandar a favorito el producto */
    cardsarr[indice].estado = 'G';
    cart.push(cardsarr[indice]);
    sessionStorage.setItem('cart', JSON.stringify(cart));
    /* Manipulacion del DOOM */
    let li = crear_elemento_carr(url, detalle, precio, id);
    listcart.append(li);
    /* Alertas */
    alertify.set('notifier', 'position', 'top-left');
    alertify.success('Producto agregado');
  } else {
    alertify.error('Producto ya agregado');
  }
}
function eleminarele_carro(id, cart) {
  let longlistcart = listcart.children;
  /* Borra del DOOM el elemento eliminador */
  for (const element of longlistcart) {
    if (element.id == id) {
      let li = element;
      li.classList.add('clear');
    }
  }
  let pos = -1;
  /* Manipula el carrito */
  for (let i in cart) {
    if (cart[i].id == id) {
      pos = i;
      break;
    }
  }
  /* Manipula el contendeor de las tarjetas */
  console.log(cardsarr);
  for (let i in cardsarr) {
    if (cardsarr[i].id == id) {
      cardsarr[i].estado = 'I';
    }
  }
  let lirem = listcart.children[pos];
  setTimeout(() => {
    lirem.remove();
  }, 250);

  pos != -1 ? cart.splice(pos, 1) : undefined;
}

/* Zona para agregar tarjetas manualmente */
if (pathname == '/pages/admin.html') {
  cardsarr = JSON.parse(localStorage.getItem('cards'));
  card.addEventListener('submit', (event) => {
    event.preventDefault();
    let carga = new Card();
    proceso_carga(event.target, carga);
    cardsarr.push(carga);
    localStorage.setItem('cards', JSON.stringify(cardsarr));
    alertify.success('Success message');
  });
}
/* Zona para ingresar a la zona de administrador */
if (pathname == '/pages/form.html') {
  login.addEventListener('submit', (event) => {
    event.preventDefault();
    b = event.target;
    let { correo, password } = b;
    let acceso = correo.value == '123' && password.value == '123';
    acceso ? window.location.replace('http://127.0.0.1:5500/pages/admin.html') : undefined;
  });
}
/* Zona del catalogo */
if (pathname == '/index.html') {
  /* Crea un contenedor para guardar las tarjetas ya sea de la api
  o agregadas por el administrador */
  localStorage.length != 0 ? Leer() : Crear();
  cart = traer_carro();
  cartcompra = traer_carro_compra();
  /* Renderizacion de carrito cada ves que se renderiza la pagina */
  renderizar_carro(cart, listcart);
  countheart.innerText = cart.length;
  /* Creacion y configuracion de libreria */
  let hammer = new Hammer(listcart);
  hammer.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
  /* Evento al cual se le hace click en el corazon y se agrega a favoritos */
  index.addEventListener('click', (e) => {
    e.target.tagName == 'BUTTON' ? anadir_carro(e, cart) : undefined;
    countheart.innerText = cart.length;
  });
  /* Gesto para eliminar un producto del carrito solo
  deslizamiento hacia la izquieda libreria hammer */
  hammer.on('swipeleft', (e) => {
    let idr;
    if (e.target.tagName == 'SPAN' || e.target.tagName == 'IMG' || e.target.tagName == 'LI' || e.target.tagName == 'I') {
      idr = e.target.id;
      if (e.target.tagName == 'SPAN' || e.target.tagName == 'IMG' || e.target.tagName == 'I') {
        idr = e.target.parentNode.id;
      }
      if (indicador.classList.length < 2) {
        eleminarele_carro(idr, cart);
        sessionStorage.setItem('cart', JSON.stringify(cart));
      } else {
        eleminarele_carro(idr, cartcompra);
        sessionStorage.setItem('cartbuy', JSON.stringify(cartcompra));
      }
      indicador.classList.add('active');
      setTimeout(() => {
        indicador.classList.remove('active');
      }, 400);
      countheart.innerText = cart.length;
    }
  });
  /* Gesto para agregar un producto a la zona de compra solo
  deslizamiento hacia arriba libreria hammer */
  console.log(cart);
  hammer.on('swipeup', (e) => {
    let idr;
    const longcartdoom = listcart.children;
    if (e.target.tagName == 'SPAN' || e.target.tagName == 'IMG' || e.target.tagName == 'LI' || e.target.tagName == 'I') {
      idr = e.target.id;
      if (e.target.tagName == 'SPAN' || e.target.tagName == 'IMG' || e.target.tagName == 'I') {
        idr = e.target.parentNode.id;
      }
      /* Manipluacion Logica */
      for (const producto of cart) {
        if (producto.id == idr) {
          producto.estado = 'F';
          cartcompra.push(producto);
        }
      }
      /* Manipulacion del DOOM */
      for (const index in longcartdoom) {
        if (listcart.children[index].id == idr) {
          listcart.children[index].classList.add('cartanimacion');
          setTimeout(() => {
            listcart.children[index].remove();
          }, 250);
          cart.splice(index, 1);
        }
      }
      sessionStorage.setItem('cart', JSON.stringify(cart));
      sessionStorage.setItem('cartbuy', JSON.stringify(cartcompra));
    }
  });
  /* Buscador de tarjetas sobre el array cardsarr */
  buscador.addEventListener('keypress', (e) => {
    const tecla = e.key;
    if (tecla == 'Enter') {
      index.innerHTML = ' ';
      e.preventDefault();
      const valor = e.target.value.toLowerCase();
      /* la variable valor guarda el valor del form verifica si es espacio
      de ser cierto renderiza todo el carrito nuevamente caso contrario 
      busca lo enviado en el cardarray */
      if (e.target.value == '') {
        Leer();
      } else {
        for (let puntero of cardsarr) {
          if (puntero.detalle.toLowerCase() == valor) {
            let { detalle, id, marca, precio, url } = puntero;
            let li = crear_elemento(url, detalle, precio, id, marca);
            index.innerHTML += li.innerHTML;
          }
        }
      }
    }
  });

  /* -------------- */
  compra.addEventListener('click', (e) => {
    indicador.classList.add('activecart');
    listcart.classList.add('listcart-activo');
    botoncomp.classList.add('activo');
    listcart.innerHTML = '';
    renderizar_carro(cartcompra, listcart);
  });
  favorito.addEventListener('click', (e) => {
    indicador.classList.remove('activecart');
    listcart.classList.remove('listcart-activo');
    botoncomp.classList.remove('activo');
    listcart.innerHTML = '';
    renderizar_carro(cart, listcart);
  });
}
/* Zona para finalizar compra */
if (pathname == '/pages/compra.html') {
  const cart = traer_carro_compra();
  renderizar_carro(cart, com);
  const preciototal = cart.reduce((acc, item) => {
    return (acc += parseInt(item.precio));
  }, 0);
  const totalprecio = document.createElement('span');
  totalprecio.innerText = `TOTAL: ${formatter.format(preciototal)}`;
  total.append(totalprecio);
}
