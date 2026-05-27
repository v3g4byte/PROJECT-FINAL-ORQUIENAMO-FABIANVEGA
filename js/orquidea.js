/* Orquidea Enamorada: orquidea.js
Nombre: Fabián Alejandro Vega Irizarry
Número de estudiante: 802-22-4327
Fecha: 26 de mayo de 2026
Descripción: Avance Proyecto Final
*/

document.addEventListener("DOMContentLoaded", function() { //Espera a que el sitio web cargue completamente para poder ejecutar

  /*
  *1: Generar pétalos 
  Esta función/adición a mi projecto es la que considero como mi inovación basado en este curso de aplicaciones web. Es complicadita, por lo que voy a poner muchos comentarios explicando qué hice.*/

  /*JavaScript requiere el uso de 'keywords' de declaración al frente de cada variable. 
  Cuando declaras 'const' significa que a esa variable su valor nunca será reasignado.
  Cuando declaras 'let' significa que a esa variable su valor sí se puede reasignar.*/

  if (window.innerWidth > 835) { //solo funciona en pantallas más grandes a 835px
    const canvas = document.createElement("canvas"); //Creo un elemento <canvas> que me permite dibujar gráficos con JavaScript    
    canvas.id = "petal-canvas"; //conecta con #petalcanvas en el css
    document.body.prepend(canvas); //Para que forme parte del <body>

    //Cree una función para que el tamaño del canvas sea de acuerdo al tamaño de la ventana (evita que se vea borroso o cortado si cambias el size de la ventana).
    function ResizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    ResizeCanvas(); //Llamo la función imediatamente.
    window.addEventListener("resize", ResizeCanvas); //Cuando ocurre el evento de resize (cambia el tamaño de la ventana), corre la función de nuevo.

    //Un arreglo de colores para los pétalos.
    const colors = [
      "#dda0c3b3",
      "#c778aa99",
      "#f0b4d2a6",
      "#b464968c",
      "#ffc8e199",
    ];

    //Creación de parámetros de pétalos: 
    //Math.random está devolviendo de 0.0-1.0.
    //h < w le da esa apariencia ovalada al pétalo.
    //Valores entre los math.random son arbitrarios, fui probando hasta que en cada característica del pétalo (tamaño, rapidez, vaivén, etc) fui satisfecho.
    //Uso Math.PI * 2 porque ese es el valor de un circulo completo (360 grados en radianes) (para rotation) y porque la onda del seno se completa en pi * 2 radianes (para swayOffset).  
    function MakePetals() {
      return {
        x: Math.random() * canvas.width, //Pétalo aparece aleatoriamente en el eje horizontal.
        y: Math.random() * canvas.height - canvas.height, //Pétalo aparece aleatoriamente en el eje vertical (al restarle el height al canvas denuevo, logro que siempre el valor sea negativo o 0, lo que lleva a que aparezcan desde arriba de la ventana donde no se ven).
        w: 8 + Math.random() * 10, //Anchura aleatoria del pétalo. 
        h: 5 + Math.random() * 7, //Altura aleatoria del pétalo. 
        speed: 0.4 + Math.random() * 0.8, //Velocidad aleatoria con la que caen los pétalos. 
        sway: 0.3 + Math.random() * 0.5, //Vaivén aleatorio de los pétalos 
        swayOffset: Math.random() * (Math.PI * 2), //Para darle un ángulo aleatorio inicial en el sin del pétalo que logra que cada uno tenga un vaivén distinto.
        rotation: Math.random() * (Math.PI * 2), //Cuando multiplico (Math.PI * 2) con Math.random() me da un ángulo aleatorio entre 0 y 360 (en radianes) para que cada pétalo comience inclinado diferente.
        rotSpeed: (Math.random() - 0.5) * 0.02, //Rapidez y dirección en que pétalo gira (negativo o positivo controla si 'clockwise' o 'counter clockwise' y la cantidad controla la velocidad en que gira en esa dirección (aunque para que se vea suave puse el * 0.02 para que los valores se mantengan extremadamente pequeños).
        color: colors[Math.floor(Math.random() * colors.length)], //Para determinar el color aleatorio del pétalo (el floor redondea hacia abajo para que siempre sea un número entero, osea un valor válido del índice del arreglo).
        opacity: 0.4 + Math.random() * 0.5, //Valor de transparencia de pétalos para que de la ilusión de unos más cerca y otros más lejos.
      };
    }

    const num_petals = 28; //Cantidad de pétalos que van a poder estar en pantalla a la vez.

    let petals = Array.from({ length: num_petals }, MakePetals); //Crea un arreglo de 28 'slots' e invoca la función de los parámetros de los pétalos una vez por cada 'slot' para obtener un arreglo de 28 pétalos distintos. 

    let frame = 0; //Contador que incrementa por cada frame. 

    const draw = canvas.getContext("2d"); //Herramienta de renderizar 2d, es lo que permite usar los comandos de crear los pétalos abajo.

    //Creación de pétalos gráficamente:
    function DrawPetals() {
      draw.clearRect(0, 0, canvas.width, canvas.height); //Borra el canvas completo antes de dibujar/redibujar el pétalo (sin eso 'dibuja' donde ya estuvo 'dibujado' y aparece un rastro).
      frame++; //Avanza por 1 cada llamda a la función (osea, llega a 60 después de un segundo si mi monitor es 60hz).

      petals.forEach((p) => { //Itera sobre los 28 pétalos (ocurre 28 veces por frame y una vez por pétalo).
        p.x += Math.sin(frame * 0.01 + p.swayOffset) * p.sway; //frame (como siempre crece) logra que seno(sin) oscile de -1.0 a 1.0. El 0.01 lentifica el proceso de incrementación, lo que lleva a un vaivén suave. El swayOffset logra que cada pétalo tenga un vaivén independiente (no todos moviéndose en direcciones sincronizadamente). El sway controla que tan lejos se mueven de izquierda a derecha.  
        p.y += p.speed; //Pétalo se cae por su valor de speed cada frame.
        p.rotation += p.rotSpeed; //Pétalo lentamente gira por su valor de rotSpeed cada frame.

        //Object.assign reemplaza el pétalo(p) cuando cae por debajo de la ventana y sobreescribe sus valores con la intención de perpetuar el ciclo.
        if (p.y > canvas.height + 20) {
          Object.assign(p, MakePetals(), { y: -20, x: Math.random() * canvas.width });
        }

        //'Dibujo' del pétalo:
        draw.save(); //Guarda el estado del canvas para que el próximo pétalo no se vea afectado (lo importante es que guarda origen de canvas en (0,0) y rotación de canvas 0 porque globalAlpha y fillStyle cambia por cada pétalo).
        draw.translate(p.x, p.y); //Mueve el origen del canvas 0,0 (esquina superior izquierda) a las coordenadas del pétalo(p) (queremos esto para que rotate() gire alrededor del centro del pétalo y no de la esquina izquierda superior).
        draw.rotate(p.rotation); //Rota el canvas a p.rotation para poder dibujar el pétalo a ese ángulo de inclinación.
        draw.globalAlpha = p.opacity; //Aplica el valor de transparencia. 
        draw.fillStyle = p.color; //Selecciona el color aleatorio determinado anteriormente para el pétalo.
        draw.beginPath(); //Inicia un nuevo trazo de dibujo (sin esto, dibujos anteriores pueden conectarse con el nuevo pétalo y causar pétalos unidos por líneas raras).
        draw.ellipse(0, 0, p.w / 2, p.h / 2, 0, 0, Math.PI * 2); //Dibuja forma ovalada (x y y son 0 porque ya tenemos el origen que queremos por el translate(), w y h dividido entre 2 porque lo que pide es radio x y radio y, rotacion 0 aquí porque ya se la aplicamos en rotate(), ángulo de inicio en 0 y ángulo final en PI * 2 que forma una vuelta completa). 
        draw.fill(); //Rellena forma del pétalo con el color seleccionado en fillStyle.
        draw.restore(); //Canvas vuelve al estado de cuando fue guardado (draw.save()). Sin esto cada pétalo heredaría la posición y rotación del canvas del anterior (osea, queremos que cada pétalo realize sus transformaciónes en base al canvas sin transformaciones).
      });

      requestAnimationFrame(DrawPetals); //Se deja llevar del refresh rate (60hz, 120hz, etc..) de tu monitor para invocar a DrawPetals(). En otras palabras, cuando todos los procesos anteriores terminan, esto le dice al browser que espere al próximo refresh para ejecutar DrawPetals.
    }
    DrawPetals(); //Llama a la función sólo la primera vez para empezar el loop de 'animación' (después de esta llamda, requestAnimationFrame sigue llamándola automáticamente).

  }


  /* 
  *2: Slogan estilo "typewriter"
   Borra el slogan y lo reescribe letra por letra */

  //querySelector devuelve el primer elemento que coincide lo seleccionado 
  const slogan = document.querySelector("h2.smaller"); //Busco en el html el <h2> que tiene la clase .smaller y lo guarda en slogan.
  const fulltext = slogan.textContent.trim(); //Guardo el texto de h2.smaller (con textContent extraigo el texto del elemento y con trim le quito los espacios en blanco al frente y atrás)
  slogan.textContent = ""; //Borra el texto de h2.smaller (espacio vacío que va a ser escrito letra por letra)

  let index = 0; //Contador de qué letra se escribirá próximo (0 porque índices empiezan en 0)

  //setTimeout espera 600 milisegundos antes de comenzar a ejecutar la función que tiene dentro para cerciorar que los otros elementos ya hayan cargado
  setTimeout(function () {
    const typing = setInterval(function () {
      slogan.textContent += fulltext[index]; //añade la letra del índice determinado
      index++; //para seguir a la próxima letra
      if (index >= fulltext.length) { //chequea si index llegó al número total de letras del texto, si es cierto, detiene al setInterval con clearInterval
        clearInterval(typing);
      }
    }, 90); //setInterval espera 90 milisegundos entre ejecutar la función que escribe cada letra, sin clearInterval sigue corriendo aunque no hayan letras que añadir
  }, 600);


  /* 
  *3: Botón de subir al inicio de la página 
  Crear un botón que aparece luego de que escrolees la página una cierta distancia, y al presionarlo te devuelva de manera suave al inicio de la página*/

  const upbtn = document.createElement("button"); //crea un elemento <button>
  upbtn.id = "upbtn";
  upbtn.textContent = "↑"; //carácter que aparece en el botón
  upbtn.title = "Volver A Inicio"; //texto que aparece cuando pones el mouse encima del botón sin hacer click
  document.body.appendChild(upbtn); //lo conecta como último elemento de <body> 

  //Esconde y Enseña:
  window.addEventListener("scroll", function () { //cada vez que escroleo ejecuta la función
    if (window.scrollY > 325) { //la función chequea si he escroleado más de 325 pixeles, si es cierto, hace el botón visible
      upbtn.style.display = "block";
      upbtn.style.opacity = "1";
    } else { //estoy a menos de 325px del inicio; ejecuta esto
      upbtn.style.opacity = "0"; //transparente con la transición
      //espera 300 milisegundos para ejecutar la función que lo que hace es ocultar el botón de nuevo pero delay es necesario para que se vea los efectos de transición  
      setTimeout(function () {
        if (window.scrollY <= 325) upbtn.style.display = "none";
      }, 300);
    }
  });

  // Scroll suave hacia el inicio
  upbtn.addEventListener("click", function () { //ejecuta función cuando haces click que te desplaza hacia el inicio (top 0) con scrollTo de manera sutil (smooth)
    window.scrollTo({ top: 0, behavior: "smooth" });
  });


  /* ============================================================
   *4 Imágenes y gif para que puedas hacer click para "fullscreen" 
   */

  const fullscreen = document.createElement("div"); //crea un <div>
  fullscreen.id = "fullscreen"; //conecta con #fullscreen en el css

  const fullimg = document.createElement("img"); //crea un <img>
  fullimg.id = "fullimg"; //conecta con #fullimg en el css

  fullscreen.appendChild(fullimg); //conecta imágen con fullscreen
  document.body.appendChild(fullscreen); //conecta fullscreen como último elemento del <body>

  //Para que cierre el 'fullscreen' cuando presionas en el área fuera de la imágen  
  fullscreen.addEventListener("click", function (c) { //si estás en 'fullscreen' y haces click, ejecuta la función para verificar si el click fue encima de la imágen (fullimg): si eso es cierto, no pasa nada pero si es falso pues el fullscreen se oculta y vuelves a ver la página normal
    if (c.target !== fullimg) {
      fullscreen.style.display = "none";
    }
  });

  //Hace las imágenes clickeables 
  document.querySelectorAll("main img").forEach(function (img) { //selecciona todas las imágenes en <main> e itera por ellas 
    img.style.cursor = "zoom-in"; //cambia cursor a lupa con "+" cuando encima de una imágen
    img.addEventListener("click", function () { //copia src y alt de la imágen clickeada a fullimg de fullscreen 
      fullimg.src = img.src;
      fullimg.alt = img.alt;
      fullscreen.style.display = "flex"; //hace visible fullscreen (flex para centrar las imágenes) 
    });
  });

  /* 
   *5 Cuando escrolees las cajas de index.html, aparecen y desaparecen animadas
   */
  if (window.innerWidth > 835) { //solo funciona en pantallas más anchas que 835px
    const boxes = document.querySelectorAll(".box"); //selecciona todos los elementos con .box en la página
    boxes.forEach(function (b, i) { //itera sobre cada caja (b) con su índice (i)
      b.classList.add(i % 2 === 0 ? "reveal-left" : "reveal-right"); //0 y par = reveal-left e impares = reveal-right
    });

    window.addEventListener("scroll", function () {//cada vez que scrolleas ejecuta la función 
      boxes.forEach(function (box) { //itera sobre cada caja (3)
        //getBoundingClientRect devuelve la posición del elemento relativo al viewport
        //rect.top = distancia desde el tope del elemento al tope de la ventana
        //rect.bottom = distancia desde el fondo del elemento al tope de la ventana
        const rect = box.getBoundingClientRect();
        //el top va a ser > innerHeight cuando la caja haya salido completamente por debajo de la ventana
        if (rect.top < window.innerHeight && rect.bottom > 0) { //el bottom va a ser < 0 cuando la caja haya salido completamente por arriba de la ventana
          box.classList.add("visible");
        } else {
          box.classList.remove("visible");
        }
      });
    });
  }


  /* 
   *6. Botón "Visitar Tienda" animado
   */

  const visitbtn = document.createElement("a"); //crea un <a>
  visitbtn.id = "visitar-btn"; //conecta visitbtn con #visitar-btn
  visitbtn.href = "tienda.html"; //destino de realizar click en el botón
  visitbtn.textContent = "Visitar Tienda →"; //texto del botón

  const coleccion = document.querySelector(".coleccion"); //busca a .collecion en el HTML
  coleccion.appendChild(visitbtn); //conecta al botón como último elemento de .coleccion

}); // end 