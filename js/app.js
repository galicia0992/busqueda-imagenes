const formulario = document.querySelector("#formulario")
const terminoBusqueda = document.querySelector("#termino")
const resultado = document.querySelector("#resultado")
const paginacion = document.querySelector("#paginacion")

const registrosPorPagina = 40
let totalPaginas
let iterador
let paginaActual = 1


    formulario.addEventListener("submit", validarFormulario)


function validarFormulario(e){
    e.preventDefault()
    if(terminoBusqueda.value == ""){
        mosttrarAlerta("termino busqueda")
    }else{
        buscarImagenes(terminoBusqueda.value)
    }
    
}

function mosttrarAlerta(mensaje){
    const existeAterta = document.querySelector(".bg-red-100")
    
    if(!existeAterta){
        const alerta = document.createElement("p")
        alerta.classList.add("bg-red-100", "border-red-400", "text-red-700", "px-4", "py-3", "rounded", "max-w-lg", "mx-auto", "mt-6", "text-center")
        alerta.innerHTML = `<strong class="font-bold">Error</strong>
        <span class="block sm:inline">${mensaje}</span>`
        formulario.appendChild(alerta)
    }
    
}

function buscarImagenes(termino){
    const key = '26714723-b7925496bf72cf60e02a82c1a'
    const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${registrosPorPagina}&page=${paginaActual}`
    fetch(url)
    .then(response =>{
        return response.json()
    })
    .then(data =>{ 
        totalPaginas = calcularPaginas(data.totalHits)
        console.log(totalPaginas)
        console.log(data.hits)
        mostrarImagenes(data.hits)
    })


}
function *crearPaginador(total){
    for(let i = 1; i <= total; i++ ){
        yield i
    }
}

function calcularPaginas(total){
    return parseInt(Math.ceil(total/registrosPorPagina))
}

function mostrarImagenes(imagenes){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild)
    }


    imagenes.map(item =>{
        console.log(item)
        const {previewURL, likes, views, largeImageURL} = item
        resultado.innerHTML += `
        <div class="w-1/2, md:w-1/3, lg:w-1/4 p-3 mb-4">
          <div class="bg-white">
            <img class="w-full" src="${previewURL}">
              <div class="p-4">
                <p class="font-bold">${likes}<span class="font-light"> Me Gusta</span></p>
                <p class="font-bold">${views}<span class="font-light"> Veces Vista</span> </p>
                <a class="w-full bg-blue-800 block hover:bg-blue-500 text-white uppercase font-bold text-center p-1 rounded mt-5" 
                href=${largeImageURL} target="_blank" rel="noopener noreferrer"><span> Ver Imagen </span> </a>
              <div/>
           </div> 
        </div>
        `
    })
    while(paginacion.firstChild){
        paginacion.removeChild(paginacion.firstChild)
    }
    imprimirPaginador()
}
function imprimirPaginador(){
    iterador = crearPaginador(totalPaginas)

    while(true){
        const {value, done} = iterador.next()
        if(done) return
        const boton = document.createElement("a")
        boton.href = "#"
        boton.dataset.pagina = value
        boton.textContent = value
        boton.classList.add("siguiente", "bg-yellow-400", "px-4", "py-1", "mr-2", "font-bold", "mb-10", "rounded")
        boton.onclick = () =>{
            paginaActual = value
            buscarImagenes()
        }
        paginacion.appendChild(boton)
    }
}