//odenar una lista
document.addEventListener("DOMContentLoaded", function() {//
    const list = document.querySelector("#objetivos");//seleciona
    const items = Array.from(list.children);//convierte los elemento a un array
    items.sort((a, b) => a.textContent.localeCompare(b.textContent));//ordena
    list.innerHTML = "";//para poder agreagar la lista ordenad a es necesario limpiar 
    items.forEach(item => list.appendChild(item));//agrega
});
//validaciion de los formularios
document.addEventListener("DOMContenLoaded", ()=>){
    //selecionar datos
    const formulario = document.querySelector("#contact-form");
    const nombreInput = document.querySelector("#nombre");
    const emailInput = document.querySelector("#email");
    const mensajeInput = document.querySelector("#mensaje");

    function validarnombre(){
        const nombre = nombreInput.value.trim();
        
}
