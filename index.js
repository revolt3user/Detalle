import corazones  from "./corazones.js";
const imagenes = document.querySelectorAll('img');
const audio = document.querySelector('audio');

// Reproducir el audio al cargar la página
audio.volume = 0.3; // Ajustar el volumen al 50%


function incio(){
        // Despazar cada imagen 100px a la derecha y girarla 45 grados
    imagenes.forEach((img, index) => {
        img.style.transform = `translateX(${30 * (index-5)}px) rotate(${4 * (index-5)}deg) translateY(200px)`;
        img.style.transition = 'transform 0.5s ease-in-out';
    });
}


async function main(){
    audio.play();
    incio();
    corazones();
    await new Promise(resolve => setTimeout(resolve, 3000));
    for (let i = 0; i < imagenes.length; i++) {
        const element = imagenes[ imagenes.length - 1 - i];
        // cambiar la posición y rotación de cada imagen
        element.style.transform = `translateX(0px) rotate(0deg) translateY(100px) scale(1.2)`;
        await new Promise(resolve => setTimeout(resolve, 3000));
        element.style.transform = `translateX(600px) rotate(10deg) translateY(100px) scale(1.2)`;
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
    main();
}

document.querySelector('div.panelArriba').addEventListener('click', async () => {
    document.querySelector('div.panelArriba').style.opacity = '0';
    await new Promise(resolve => setTimeout(resolve, 2000));
    document.querySelector('div.panelArriba').style.display = 'none';
    main();
});
// main();