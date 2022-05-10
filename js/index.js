const requestURL = "https://raw.githubusercontent.com/AlejandroM816/Tecnologia-multimedia/main/json/CategoriasYautores.json";

const request = new XMLHttpRequest();
request.open('GET', requestURL);
request.responseType = 'json'
request.send();
request.onload = function () {
    const objeto = request.response;
    SetHeader(objeto);
    SetBody(objeto);
    console.log(objeto.subcategory);
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
}

function SetBody(objeto) {
    var elemento = document.querySelector(".Co");
    console.log(elemento.childNodes);
    var elem = elemento.childNodes[1].childNodes[1];
    console.log(elem);
    for (let i = 0; i < objeto.subcategory.length; i++) {
        console.log(elem);
        var element = elem.cloneNode(true);
        element.childNodes[1].textContent = objeto.subcategory[i].name;
        var e = element.childNodes[5].childNodes[1].childNodes[1];
        console.log(e);
        for (let j = 0; j < objeto.subcategory[i].authors.length; j++) {
            var e2=e.cloneNode(true);
            e2.childNodes[1].src = objeto.subcategory[i].authors[j].image.name;
            var aux = objeto.subcategory[i].authors[j].name + "·" + objeto.subcategory[i].authors[j].work + "·" +
                objeto.subcategory[i].authors[j].birthDate + "·" + objeto.subcategory[i].authors[j].deathDate;
            console.log(aux);
            e2.childNodes[3].textContent = aux;

            element.childNodes[5].childNodes[1].appendChild(e2);
        }
        elemento.appendChild(element);
    }
}


function Inicio(irTop) {
    var elementos = document.querySelectorAll(".page-section");
    $(elementos).show();
    $(elementos[elementos.length - 1]).hide();
    var elemento = document.querySelector(".informacion");
    $(elemento).hide();
    if (irTop == 1) {
        scrollTo(0, 0);

    }
}

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
function desplegarPerfil() {
    var div = document.getElementById("Contenido");
    var contenido = '<div class="container"><h2 class="page-section-heading text-center text-uppercase text-secondary mb-0">EDITAR PERFIL</h2><div class="divider-custom"><div class="divider-custom-line"></div><div class="divider-custom-icon"><i class="fas fa-star"></i></div><div class="divider-custom-line"></div></div>';
    contenido += '<center><div class="together">Nuevo nickname: <input type="text" class="form-control" placeholder="Nombre de usuario*"><\div>'; //nombre usuario
    contenido += '<div class="together">Nueva Contraseña: <input type="text" class="form-control" placeholder="Contraseña*"><\div>'; //Contraseña
    contenido += '<div class="together">Seleciona foto de Perfil: <form enctype="multipart/form-data" method="POST"><input name="uploadedfile" type="file" /></form><div>';
    contenido += '<div class="together"><button type="button" class="btn btn-primary">Aplicar cambios</button><div>';
    contenido += '<\center>';
    div.innerHTML = contenido;
}

function desplegarRegistrate() {
    var div = document.getElementById("Contenido");
    var contenido = '<div class="container"><h2 class="page-section-heading text-center text-uppercase text-secondary mb-0">REGISTRATE</h2><div class="divider-custom"><div class="divider-custom-line"></div><div class="divider-custom-icon"><i class="fas fa-star"></i></div><div class="divider-custom-line"></div></div>';
    contenido += '<center><div class="together">Nickname: <input type="text" class="form-control" placeholder="Nombre de usuario*"><\div>'; //nombre usuario
    contenido += '<center><div class="together">Correo Electronico: <input type="text" class="form-control" placeholder="@gmail.com"><\div>'; //Correo electronico
    contenido += '<div class="together">Contraseña: <input type="text" class="form-control" placeholder="Contraseña*"><\div>'; //Contraseña
    contenido += '<div class="together">Seleciona foto de Perfil: <form enctype="multipart/form-data" method="POST"><input name="uploadedfile" type="file" /></form><div>';
    contenido += '<div class="together"><button type="button" class="btn btn-primary">Registrarse</button><div>';
    contenido += '<\center>';
    div.innerHTML = contenido;
}

function desplegarOlvidadoCon() {
    var div = document.getElementById("Contenido");
    var contenido = '<div class="container"><h2 class="page-section-heading text-center text-uppercase text-secondary mb-0">RESTABLECER CONTRASEÑA</h2><div class="divider-custom"><div class="divider-custom-line"></div><div class="divider-custom-icon"><i class="fas fa-star"></i></div><div class="divider-custom-line"></div></div>';
    contenido += '<center><div class="together">Correo Electronico: <input type="text" class="form-control" placeholder="@gmail.com"><\div>'; //Correo electronico
    contenido += '<div class="together"><button type="button" class="btn btn-primary">Enviar nueva contraseña</button><div>';
    contenido += '<\center>';
    div.innerHTML = contenido;
}
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