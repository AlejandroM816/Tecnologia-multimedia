//Lectura de los JSON y carga de los elementos HTML a partir de los datos leidos
const requestURL = "https://raw.githubusercontent.com/AlejandroM816/Tecnologia-multimedia/main/json/CategoriasYautores.json";
const requestURL2 = "https://raw.githubusercontent.com/AlejandroM816/Tecnologia-multimedia/main/json/usuariosRegistrados.json";
var objeto;
var objeto2;
var objeto3;
const request = new XMLHttpRequest();
const request2 = new XMLHttpRequest();
const request3 = new XMLHttpRequest();
request2.open('GET', requestURL2);
request2.responseType = 'json';
request2.send();
request2.onload = function () {
    objeto2 = request2.response;
}
request.open('GET', requestURL);
request.responseType = 'json'
request.send();
request.onload = function () {
    objeto = request.response;
    SetHeader(objeto);
    SetBody(objeto);
}

//Función que detecta si la AppWeb se esta ejecutando sobre un telefono
function isMobile() {
    return (
        (navigator.userAgent.match(/Android/i))     ||
        (navigator.userAgent.match(/webOS/i))       ||
        (navigator.userAgent.match(/iPhone/i))      ||
        (navigator.userAgent.match(/iPod/i))        ||
        (navigator.userAgent.match(/iPad/i))        ||
        (navigator.userAgent.match(/BlackBerry/i))
    );
}

//Función que inicializa el mapa con marcadores en los sitios importantes
function startMap(autor) {
    mapboxgl.accessToken = 'pk.eyJ1IjoiYW1uODE2IiwiYSI6ImNsMzE3Z2s4ZjB1OHozcHBzMmlkNndmN28ifQ.hoy47cMpypxnzPnMsqgcng';
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/streets-v11', // style URL
        center: [autor.studySites[0].Long, autor.studySites[0].Lat], // starting position [lng, lat]
        zoom: 5 // starting zoom
    });
    for (let i = 0; i < autor.studySites.length; i++) {
        new mapboxgl.Marker().setLngLat([autor.studySites[i].Long, autor.studySites[i].Lat]).addTo(map);
    }

}

//Función para eliminar las etiquetas HTML de un texto
function removeTags(str) {
    if ((str === null) || (str === ''))
        return false;
    else
        str = str.toString();
    str = str.replace(/(\[(?:[^[\]]*?)\]\s*?(?=\[))|(\[(?:[^[\]]*?)\](?!\s*[\|&]\s*.))|(?:\[[^[\]]*?])/g, '');
    return str.replace(/<\/?[a-z][a-z0-9]*[^<>]*>|<!--.*?-->/img, '');
}

//Función que lee de la wikipedia el articulo del cintifico clicado, además elimina los elementos no necesarios para el texto
function FetchWikiExtract(nombre) {
    const wikiEndPoint = "https://es.wikipedia.org/w/api.php"
    const wikiParams = '?action=query'
        + "&titles=" + nombre
        + "&format=json"
        + "&prop=extracts"
        + "&origin=*"
        ;
    request3.open('GET', wikiEndPoint + wikiParams);
    request3.responseType = 'json';
    request3.send();
    request3.onload = function () {
        objeto3 = request3.response;
        var pageid = [];
        for (var id in objeto3.query.pages) {
            pageid.push(id);
        }
        var Texto = objeto3.query.pages[pageid[0]].extract;
        let TextoCambiar = removeTags(Texto);
        console.log(TextoCambiar.indexOf("Véase también"));
        var indice = TextoCambiar.indexOf("Véase también");
        if (indice != -1) {
            TextoCambiar = TextoCambiar.substring(0, indice)
        }
        var indice2 = TextoCambiar.indexOf("Enlaces externos");
        if (indice2 != -1) {
            TextoCambiar = TextoCambiar.substring(0, indice2)
        }
        var indice3 = TextoCambiar.indexOf("Referencias");
        if (indice3 != -1) {
            TextoCambiar = TextoCambiar.substring(0, indice3)
        }
        TextoCambiar = TextoCambiar.replaceAll("\n\n\n\n", "\n\n");
        document.querySelector(".lead").innerText = TextoCambiar;
    }
}

//Función que hace Text-to-Speech
function Leer() {
    var elemento = document.querySelector(".lead");
    if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
    } else {
        speechSynthesis.speak(new SpeechSynthesisUtterance(elemento.textContent));
    }
}

//Función que nos permite cerrar la ventana de información
function Volver() {
    let elementoCont = document.querySelectorAll(".Co");
    $(elementoCont).show();
    var ocultar = document.querySelector('.informacion');
    $(ocultar).hide();
}

//Función que nos permite ir al elemento clicado en el header.
function ScrollA(div) {
    window.scrollTo(0, $(div).offset().top);
}

//Función que nos permite dandole al logo volver a situarnos en la página principal
function Inicio() {
    var sections=document.querySelectorAll(".page-section");
    for(let i=0;i<sections.length;i++){
        $(sections[i]).show();
    }
    Volver();
    scrollTo(0, 0);

}

//Función que realiza la busqueda de una categoria usando el buscador
function busca(e) {
    if (e.keyCode === 13 || e.type === "click") {
        var inp = document.getElementById("buscadorTexto");
        if (inp.classList.contains("shakeBusqueda")) {
            inp.classList.remove("shakeBusqueda");
        }
        var texto = inp.value;
        var titulos = document.querySelectorAll(".page-section-heading");
        let noEncontrados = 0;
        for (let i = 0; i < titulos.length; i++) {
            if (titulos[i].textContent.includes(texto.toUpperCase())) {
                $(titulos[i].parentNode.parentNode).show();
            } else {
                noEncontrados++;
                $(titulos[i].parentNode.parentNode).hide();
            }
        }
        if (noEncontrados == titulos.length) {
            setTimeout(() => inp.classList.add("shakeBusqueda"), 100);
            for (let i = 0; i < titulos.length; i++) {
                $(titulos[i].parentNode.parentNode).show();
            }
        }
    }
}

// Función que permite iniciar sesión, en caso que el inicio de sesión sea incorrecto notifica al usuario
function iniciaSesion(e) {
    var inpEmail = document.getElementById("exampleDropdownFormEmail1");
    var inpPass = document.getElementById("exampleDropdownFormPassword1");
    var email = inpEmail.value;
    var pass = inpPass.value;
    if (email != "" || pass != "") {
        let noEncontrados = 0;
        var Foto;
        var changeImage = false;
        for (let j = 0; j < objeto2.users.length; j++) {
            if (objeto2.users[j].email == email && objeto2.users[j].password == pass) {
                Foto = objeto2.users[j].image;
                sessionStorage.setItem(objeto2.users[j].email, objeto2.users[j].nickname);
                j = objeto2.users.length + 1;
                changeImage = true;
            } else {
                noEncontrados++;
            }
        }
        if (noEncontrados == objeto2.users.length) {
            for (let g = 0; g < localStorage.length; g++) {
                let key = localStorage.key(g);
                if (key.includes("Usuario")) {
                    var item = localStorage.getItem(key);
                    var items = item.split("/$/");
                    if (items[0] == email && items[1] == pass) {
                        Foto = items[3];
                        sessionStorage.setItem(email, items[2]);
                        changeImage = true;
                    }
                }
            }
        }
        if (changeImage) {
            var menuUsuario = document.getElementById("menuUsuario");
            var elementosMenu = menuUsuario.children;
            $(elementosMenu[0]).hide();
            $(elementosMenu[1]).hide();
            $(elementosMenu[3]).hide();
            var avatarNavBar = document.getElementById("avatarNavBar");
            avatarNavBar.src = Foto;
            var cs = document.getElementById("btnCS");
            $(cs).show();
            document.getElementById("ImagenUsuComment").src = Foto;
        }
        if (!changeImage) {
            e.stopPropagation();
            var erroriniciosesion = document.querySelector(".MensajeErrorInicioSesion");
            $(erroriniciosesion).show();
            setTimeout(() => $(erroriniciosesion).hide(), 2000);
        }
    } else {
        e.stopPropagation();
        var erroriniciosesion = document.querySelector(".MensajeErrorInicioSesion");
        $(erroriniciosesion).show();
        setTimeout(() => $(erroriniciosesion).hide(), 2000);
    }
}

// Función que permite el cierre de sesión
function cierraSesion() {
    sessionStorage.removeItem(sessionStorage.key(0));
    var menuUsuario = document.getElementById("menuUsuario");
    var elementosMenu = menuUsuario.children;
    $(elementosMenu[0]).show();
    $(elementosMenu[1]).show();
    $(elementosMenu[3]).show();
    var avatarNavBar = document.getElementById("avatarNavBar");
    avatarNavBar.src = "assets/avatar.svg";
    var cs = document.getElementById("btnCS");
    $(cs).hide();
    document.getElementById("ImagenUsuComment").src = "";
}

// Función que permite a un usuario comentar
function Comentar() {
    var newComment = document.getElementById("ComentarioUusario");
    console.log(newComment.value);
    let date = new Date();
    let output = String(date.getDate()).padStart(2, '0') + '/' + String(date.getMonth() + 1).padStart(2, '0') + '/' + date.getFullYear();
    var titulo = document.querySelector(".titulo");
    var usu = sessionStorage.getItem(sessionStorage.key(0));
    if (usu != null) {
        var Foto;
        var salida = false;
        for (let i = 0; i < objeto2.users.length; i++) {
            if (objeto2.users[i].email == sessionStorage.key(0)) {
                Foto = objeto2.users[i].image;
                i = objeto2.users.length + 1;
                salida = true;
            }
        }
        if (!salida) {
            for (let j = 0; j < localStorage.length; j++) {
                if (localStorage.key(j).includes("Usuario")) {
                    var splitUsu = localStorage.getItem(localStorage.key(j)).split("/$/");
                    if (splitUsu[0] == sessionStorage.key(0)) {
                        Foto = splitUsu[3];
                        j = localStorage.length + 1;
                        salida = true;
                    }
                }
            }
        }
        var newComment2 = titulo.textContent + "@" + usu + "@" + output + "@" + Foto + "@" + newComment.value;
        console.log(newComment2);
        localStorage.setItem('Comentario' + (localStorage.length + 1), newComment2);
        var comentario = document.querySelector(".bg-white");
        var bloqueComentarios = comentario.parentNode;
        var newComentario = comentario.cloneNode(true);
        newComentario.children[0].children[0].src = Foto;
        newComentario.children[0].children[1].children[0].textContent = usu;
        newComentario.children[0].children[1].children[1].textContent = output;
        newComentario.children[1].children[0].textContent = newComment.value;
        if ($(newComentario).is(':hidden')) {
            $(newComentario).show();
        }
        bloqueComentarios.appendChild(newComentario);
    } else {
        var errorComentario = document.querySelector(".errorComentar");
        $(errorComentario).show();
        setTimeout(() => {
            $(errorComentario).hide();
        }, 2000);
    }
    newComment.value = "";
}

// Función que añade los comentarios que esten en el JSON.
function SetComments(comentarios, nombreAutor) {
    var comentario = document.querySelectorAll(".bg-white");
    for (let k = 1; k < comentario.length; k++) {
        comentario[k].remove();
    }
    comentario = comentario[0];
    $(comentario).show();
    var padre = comentario.parentNode;
    for (let i = 0; i < comentarios.length; i++) {
        var c2 = comentario.cloneNode(true);
        
        for (let j = 0; j < objeto2.users.length; j++) {
            if (objeto2.users[j].nickname == comentarios[i].nickname) {
                c2.childNodes[1].childNodes[0].src = objeto2.users[j].image;
                j = objeto2.users.length;
            }
        }
        c2.children[0].children[1].children[0].textContent = comentarios[i].nickname;
        c2.children[0].children[1].children[1].textContent = comentarios[i].date;
        c2.children[1].children[0].textContent = comentarios[i].comment;
        if (c2.childNodes[3].childNodes[1].textContent == "") {
            $(c2).hide();
        }
        padre.insertBefore(c2, padre.lastChild);
    }
    setComentLocalStorage(comentario, nombreAutor, padre);
    padre.removeChild(comentario);
}

// Función que añade los comentarios que esten en localStorage
function setComentLocalStorage(comentario, nombreAutor, padre) {
    for (let g = 0; g < localStorage.length; g++) {
        var c2 = comentario.cloneNode(true);
        let key = localStorage.key(g);
        var item = localStorage.getItem(key);
        var splitComment = item.split("@");
        if (splitComment[0] == nombreAutor) {
            c2.children[0].children[1].children[0].textContent = splitComment[1];
            c2.children[0].children[1].children[1].textContent.textContent = splitComment[2];
            document.getElementById("AVATARC").src = splitComment[3];
            c2.children[1].children[0].textContent = splitComment[4];
            padre.insertBefore(c2, padre.lastChild);
        }
    }
}

// Comprueba si un usuario esta en el JSON
function ComprobarUsuarioJSON(email) {
    for (let i = 0; i < objeto2.users.length; i++) {
        if (objeto2.users[i].email == email) {
            return true;
        }
    }
    return false;
}

// Comprueba si un usuario esta en el Local Storage
function ComprobarUsuarioLocalStorage(email) {
    for (let i = 0; i < localStorage.length; i++) {
        if (localStorage.key(i).includes("Usuario")) {
            var splitLS = localStorage.getItem(localStorage.key(i)).split("/$/");
            if (splitLS[0] == email) {
                return true;
            }
        }
    }
    return false;
}

// Despliega las campos para registrarse
function desplegarRegistrate(e) {
    var div = document.getElementById("inputRegistro");
    $(div).show();
    var is = document.getElementById("btnIS");
    $(is).hide();
    var cs = document.getElementById("btnCS");
    $(cs).hide();
    var reg = document.getElementById("btnReg");
    $(reg).hide();
    var cf = document.getElementById("btnConfirmar");
    $(cf).show();
    var can = document.getElementById("btnCancelar");
    $(can).show();
    e.stopPropagation();
}

// Función que registra a un usuario cuando se le daa al botón acceptar si estan todos los campos rellenados y no estan repetidos.
function Aceptar(e) {
    var inpEmail = document.getElementById("exampleDropdownFormEmail1");
    var inpPass = document.getElementById("exampleDropdownFormPassword1");
    var inpNick = document.getElementById("exampleDropdownFormNickname1");
    if (!ComprobarUsuarioJSON(inpEmail.value) && !ComprobarUsuarioLocalStorage(inpEmail.value)) {
        var Foto;
        var aleat = Math.random();
        if (aleat < 0.5) {
            Foto = "assets/MaleAvatar.svg";
        } else {
            Foto = "assets/FemaleAvatar.svg";
        }
        var value = inpEmail.value + "/$/" + inpPass.value + "/$/" + inpNick.value + "/$/" + Foto;

        localStorage.setItem("Usuario" + localStorage.length + 1, value);
        Cancelar();
    } else {
        e.stopPropagation();
        var error;
        if (inpEmail.value != "" && inpPass.value != "" && inpNick.value != "") {
            error = document.querySelector(".MensajeErrorEmail");
            setTimeout(() => inpEmail.classList.add("shakeBusqueda"), 100);
            setTimeout(() => inpEmail.classList.remove("shakeBusqueda"), 200);
        } else {
            error = document.querySelector(".MensajeErrorRegistrarse");
           
        }
        $(error).show();
        setTimeout(() => $(error).hide(), 2000);
    }
}

//Función que esconde los campos del registro y establece los de iniciar sesión
function Cancelar() {
    var div = document.getElementById("inputRegistro");
    $(div).hide();
    var is = document.getElementById("btnIS");
    $(is).show();
    var cs = document.getElementById("btnCS");
    $(cs).hide();
    var reg = document.getElementById("btnReg");
    $(reg).show();
    var cf = document.getElementById("btnConfirmar");
    $(cf).hide();
    var can = document.getElementById("btnCancelar");
    $(can).hide();
}

//Función que a partir de los JSON leidos establece el header de la página
function SetHeader(objeto) {
    var elemento = document.querySelector(".navbar-nav");
    for (let i = 0; i < objeto.subcategory.length; i++) {
        var elem = document.createElement("li");
        elem.className = "nav-item";
        var elem2 = document.createElement("a");
        elem2.className = "nav-link";
        elem2.href = "#";
        elem2.textContent = objeto.subcategory[i].name;
        elem.appendChild(elem2);
        elemento.appendChild(elem);
    }
    elemento.addEventListener("click", e => {
        let titulos = document.querySelectorAll(".page-section-heading");
        for (let i = 0; i < titulos.length; i++) {
            console.log(titulos[i].textContent);
            if (titulos[i].textContent == e.target.textContent) {
                ScrollA(titulos[i]);
                i = titulos.length + 1;
            }
        }
    });
}

//Función que a partir de los JSON leídos establece el cuerpo de la WebApp
function SetBody(objeto) {
    var elemento = document.querySelector(".Co");
    console.log(elemento.childNodes);
    var elem = elemento.childNodes[1].childNodes[1];
    console.log(elem);
    for (let i = 0; i < objeto.subcategory.length; i++) {
        console.log(elem);
        var element = elem.cloneNode(true);
        element.id = objeto.subcategory[i].name;
        element.childNodes[1].textContent = objeto.subcategory[i].name;
        var e = element.childNodes[5].childNodes[1];
        console.log(e);
        for (let j = 0; j < objeto.subcategory[i].authors.length; j++) {
            var e2 = e.cloneNode(true);
            var imagen = objeto.subcategory[i].authors[j].image.name;
            if (isMobile()) {
                e2.childNodes[1].childNodes[1].src = imagen;
                e2.childNodes[1].childNodes[1].width = "96";
                e2.childNodes[1].childNodes[1].height = "69";
            } else {
                e2.childNodes[1].childNodes[1].src = imagen;
                e2.childNodes[1].childNodes[1].width = "356";
                e2.childNodes[1].childNodes[1].height = "257";
            }
            e2.childNodes[1].childNodes[1].alt = objeto.subcategory[i].authors[j].name;
            var subTituloImagen = objeto.subcategory[i].authors[j].name + "\n" + objeto.subcategory[i].authors[j].work + "\n" +
                objeto.subcategory[i].authors[j].birthDate + "\n" + objeto.subcategory[i].authors[j].deathDate;
            e2.childNodes[1].childNodes[3].innerText = subTituloImagen.toString();
            element.childNodes[5].appendChild(e2);
        }
        element.childNodes[5].removeChild(e);
        var e3 = document.createElement("section");
        e3.className = "page-section info";
        e3.id = "info";
        e3.appendChild(element);
        elemento.appendChild(e3);
    }
    elemento.removeChild(elemento.childNodes[1]);
}

// Función que cambia el cuerpo de la página por la de la información de un cintifico
function ModificarContenido() {
    let elementoCont = document.querySelectorAll(".Co");
    elementoCont[0].addEventListener("click", e => {
        var elementoClickado = e.target.parentNode;
        if (elementoClickado.className.includes('info-item')) {
            var nombreAutor = elementoClickado.childNodes[1].alt;
            var subcategoria = elementoClickado.parentNode.parentNode.parentNode.childNodes[1].textContent;
            var subcategoriajson;
            for (let i = 0; i < objeto.subcategory.length; i++) {
                if (objeto.subcategory[i].name == subcategoria) {
                    subcategoriajson = objeto.subcategory[i];
                    i = objeto.subcategory.length;
                }
            }
            for (let i = 0; i < subcategoriajson.authors.length; i++) {
                if (subcategoriajson.authors[i].name == nombreAutor) {
                    startMap(subcategoriajson.authors[i]);
                    var titulo = document.querySelector(".titulo");
                    titulo.textContent = nombreAutor;
                    var mostrar = document.querySelector('.informacion');
                    SetComments(subcategoriajson.authors[i].coments, nombreAutor);
                    FetchWikiExtract(nombreAutor);
                    var v = document.querySelector(".videos");
                    if (!jQuery.isEmptyObject(subcategoriajson.authors[i].documentales)) {
                        $(v).show();
                        while (v.childNodes[1].children.length > 2) {
                            v.childNodes[1].children[v.childNodes[1].children.length - 1].remove();
                        }
                        for (let b = 0; b < subcategoriajson.authors[i].documentales.length; b++) {
                            var videoGenerico = '<lite-youtube videoid="idgenericoremplazar"></lite-youtube>';
                            videoGenerico = videoGenerico.replace("idgenericoremplazar",
                                subcategoriajson.authors[i].documentales[b].url.substring(
                                    subcategoriajson.authors[i].documentales[b].url.lastIndexOf("/") + 1, subcategoriajson.authors[i].documentales[b].url.length
                                )
                            );
                            console.log(videoGenerico);
                            var vid = v.childNodes[1].children[1].cloneNode(true);
                            vid.childNodes[1].childNodes[1].innerHTML = videoGenerico;
                            v.childNodes[1].appendChild(vid);
                        }
                        v.childNodes[1].removeChild(v.childNodes[1].children[1]);

                    } else {
                        $(v).hide();
                    }
                    $(mostrar).show();
                    i = subcategoriajson.authors.length;
                }
            }
            $(elementoCont[0]).hide();
            scrollTo(0, 0);
        }
    });
}
ModificarContenido();
