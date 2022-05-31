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

function isMobile() {
    return (
        (navigator.userAgent.match(/Android/i)) ||
        (navigator.userAgent.match(/webOS/i)) ||
        (navigator.userAgent.match(/iPhone/i)) ||
        (navigator.userAgent.match(/iPod/i)) ||
        (navigator.userAgent.match(/iPad/i)) ||
        (navigator.userAgent.match(/BlackBerry/i))
    );
}

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
        console.log(TextoCambiar);
        document.querySelector(".lead").innerText = TextoCambiar;
    }



}

function removeTags(str) {
    if ((str === null) || (str === ''))
        return false;
    else
        str = str.toString();
    str = str.replace(/(\[(?:[^[\]]*?)\]\s*?(?=\[))|(\[(?:[^[\]]*?)\](?!\s*[\|&]\s*.))|(?:\[[^[\]]*?])/g, '');
    return str.replace(/<\/?[a-z][a-z0-9]*[^<>]*>|<!--.*?-->/img, '');
}

function Leer() {
    var elemento = document.querySelector(".lead");
    if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
    } else {
        speechSynthesis.speak(new SpeechSynthesisUtterance(elemento.textContent));
    }
}

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
        c2.childNodes[1].childNodes[2].childNodes[0].textContent = comentarios[i].nickname;
        c2.childNodes[1].childNodes[2].childNodes[1].textContent = comentarios[i].date;
        c2.childNodes[3].childNodes[1].textContent = comentarios[i].comment;
        if (c2.childNodes[3].childNodes[1].textContent == "") {
            $(c2).hide();
        }
        padre.insertBefore(c2, padre.lastChild);

    }

    setComentLocalStorage(comentario, nombreAutor, padre);
    padre.removeChild(comentario);


}

function setComentLocalStorage(comentario, nombreAutor, padre) {
    for (let g = 0; g < localStorage.length; g++) {
        var c2 = comentario.cloneNode(true);
        let key = localStorage.key(g);
        var item = localStorage.getItem(key);
        var splitComment = item.split("@");
        if (splitComment[0] == nombreAutor) {
            c2.childNodes[1].childNodes[2].childNodes[0].textContent = splitComment[1];
            c2.childNodes[1].childNodes[2].childNodes[1].textContent = splitComment[2];
            document.getElementById("AVATARC").src = splitComment[3];
            c2.childNodes[3].childNodes[1].textContent = splitComment[4];
            padre.insertBefore(c2, padre.lastChild);
        }
    }

}

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

function ScrollA(div) {
    window.scrollTo(0, $(div).offset().top);
}

function iniciaSesion() {
    var inpEmail = document.getElementById("exampleDropdownFormEmail1");
    var inpPass = document.getElementById("exampleDropdownFormPassword1");
    var email = inpEmail.value;
    var pass = inpPass.value;
    let noEncontrados = 0;
    var Foto;
    var changeImage;
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

}

function busca() {

    var inp = document.getElementById("buscadorTexto");
    if (inp.classList.contains("shakeBusqueda")) {
        inp.classList.remove("shakeBusqueda");
    }
    var texto = inp.value;
    var titulos = document.querySelectorAll(".page-section-heading");
    let noEncontrados = 0;
    for (let i = 0; i < titulos.length; i++) {
        if (titulos[i].textContent.includes(texto.toUpperCase())) {
            $(titulos[i].parentNode).show();
        } else {
            noEncontrados++;
            $(titulos[i].parentNode).hide();
        }
    }

    if (noEncontrados == titulos.length) {
        setTimeout(() => inp.classList.add("shakeBusqueda"), 100);

        for (let i = 0; i < titulos.length; i++) {
            $(titulos[i].parentNode).show();
        }
    }
}

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
            var imagen=objeto.subcategory[i].authors[j].image.name;
            if (isMobile()) {
                //var formato=imagen.slice(imagen.lastIndexOf("."),imagen.length);
               // e2.childNodes[1].childNodes[1].src = imagen.replace(formato,"_telefono")+formato;
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


function Inicio() {
    Volver();
    scrollTo(0, 0);

}

/*
function MoverA(elemento) {
    Inicio(0);
    console.log(elemento);
    var div = elemento.textContent;
    var elementos = document.querySelectorAll(".page-section-heading");
    for (let i = 0; i < elementos.length; i++) {
        if (div == elementos[i].textContent) {
            console.log(i);
            var x = elementos[i].getBoundingClientRect().left + scrollX - elementos[i].getBoundingClientRect().width;
            console.log(i);
            var y = elementos[i].getBoundingClientRect().top + scrollY - elementos[i].getBoundingClientRect().height;
            console.log(y);
            scrollTo(x, y);
        }
    }
}
*/

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


function ComprobarUsuarioJSON(email) {
    for (let i = 0; i < objeto2.users.length; i++) {
        if (objeto2.users[i].email == email) {
            return true;
        }
    }
    return false;
}

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

function Aceptar(e) {
    var inpEmail = document.getElementById("exampleDropdownFormEmail1");
    if (!ComprobarUsuarioJSON(inpEmail.value) && !ComprobarUsuarioLocalStorage(inpEmail.value)) {
        var inpPass = document.getElementById("exampleDropdownFormPassword1");
        var inpNick = document.getElementById("exampleDropdownFormNickname1");
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
        var error = document.querySelector(".MensajeErrorEmail");
        $(error).show();
        setTimeout(() => inpEmail.classList.add("shakeBusqueda"), 100);
        setTimeout(() => inpEmail.classList.remove("shakeBusqueda"), 200);
        setTimeout(() => $(error).hide(), 2000);
    }
}

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

function Volver() {
    let elementoCont = document.querySelectorAll(".Co");
    $(elementoCont).show();
    var ocultar = document.querySelector('.informacion');
    $(ocultar).hide();
}

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
                    var comentario = document.querySelector(".comment-text");
                    const wikiData = FetchWikiExtract(nombreAutor);
                    var v = document.querySelector(".videos");

                    /*
                        <lite-youtube videoid="2tsQ75zSWLs"></lite-youtube>
                    */

                    if (!jQuery.isEmptyObject(subcategoriajson.authors[i].documentales)) {
                        $(v).show();
                        //const videoGenerico= '<div class="col-md-6 col-lg-4 mb-5"><div class="info-item mx-auto"><div class="ratio ratio-16x9"><lite-youtube videoid="2tsQ75zSWLs"></lite-youtube></div> </div></div>'

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
                    //comsole.log(wikiData);
                    $(mostrar).show();
                    i = subcategoriajson.authors.length;
                }
            }
            $(elementoCont[0]).hide();
            scrollTo(0, 0);
        }

    })
}
ModificarContenido();





/*
function ModificarContenido() {
    let elementoCont = document.querySelectorAll(".Co");
    console.log(elementoCont);
    elementoCont[0].addEventListener("click", e => {
        var elementoClickado = e.target.parentNode;
        console.log(elementoClickado.childNodes);
        if (elementoClickado.className.includes('info-item') && !elementoClickado.id.includes('noClick') && !elementoClickado.id.includes('nada')) {
            var padreelementoClickado = document.querySelectorAll(".page-section");
            console.log(padreelementoClickado);

            let count = 0;
            for (item of padreelementoClickado) {
                if (count < padreelementoClickado.length - 1) {
                    console.log(count);
                    $(item).hide();
                }
                count += 1;
            }
            console.log(padreelementoClickado);
            $(padreelementoClickado[padreelementoClickado.length - 1]).show();
            var textoalternativo = elementoClickado.childNodes[1].alt;
            console.log(textoalternativo);
            var headerSeccion = document.querySelectorAll(".page-section-heading");
            var palabra = headerSeccion[headerSeccion.length - 1].textContent;
            headerSeccion[headerSeccion.length - 1].textContent = textoalternativo;

            scrollTo(0, 0);
        } else {
            if (elementoClickado.id.includes('noClick')) {
                var mostrar = document.querySelector('.informacion');
                var textoalternativo = elementoClickado.childNodes[1].alt;
                var titulo = document.querySelector('.titulo');
                titulo.textContent = textoalternativo;
                $(mostrar).show();
                var x = mostrar.getBoundingClientRect().left + scrollX;
                console.log(x);
                var y = mostrar.getBoundingClientRect().top + scrollY;
                console.log(y);
                scrollTo(x, y);
            }

        }

    })

}
ModificarContenido();
*/