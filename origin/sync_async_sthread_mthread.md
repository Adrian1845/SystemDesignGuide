Cuando iba a 4.º de la ESO, tenía un profesor de historia que decía lo siguiente: *«Los hombres solo podemos hacer una cosa; las mujeres pueden hacer varias a la vez»*. A mí me daba la risa porque yo no sé él, pero yo por lo menos a varias cosas estoy pendiente en el trabajo. Este tío lo que pasa es que estaba muy comido de la cabeza y decía todo el rato que las mujeres eran el sexo superior o movidas así. El caso es que mi profesor, un visionario, estaba hablando de hilos pero a un nivel algo más sofisticado; solo tardé en descubrirlo unos 5 años, pero el tío iba bien encaminado.

Para este funcionario, nosotros los hombres somos máquinas que tenemos un hilo síncrono: no funcionamos con más de una tarea a la vez, con su *input* y su *output*, algo al estilo FIFO (*first in, first out*). En cambio, las mujeres son multihilo, asíncronas, usan *Round Robin*. Y como los programas los creamos nosotros y se basan un poco en cómo haríamos las propias tareas, vamos a repasar estos conceptos hoy.

---

### Síncrono vs. Asíncrono

Estos dos conceptos son sencillos de entender, pero la verdad es que cuando empecé a currar nunca usé nada asíncrono: todo era síncrono (y *single-threaded*) y realmente tampoco tenía tanta experiencia con arquitecturas asíncronas.

Para que nos situemos: una **arquitectura síncrona** es tan sencilla como ver tus datos en la web en la que te acabas de registrar. La página espera a tener tus datos para cargar; mientras tanto te sale el icono de carga o directamente estás esperando a que se renderice la pantalla entera. No tiene más, es a lo que estamos acostumbrados: le doy al botón de la tele y se enciende.

#### ¿En qué situaciones usamos arquitectura síncrona?
* Prácticamente siempre.
* Flujos que necesiten información inmediata.
* Procesos que vayan paso a paso y donde cada paso dependa del anterior.
* *Piensa en estos flujos como:* «Tengo que ir a echar gasolina o me quedo tirado».

#### Contras:
* Tener que probar algo que está al final del flujo y tener que esperar como un condenado.

---

En cambio, una **arquitectura asíncrona** es algo que se usa mucho pero no es tan intuitivo para la gente que no ha programado nunca o en empresas más pequeñas que no utilizan colas ni *brokers* de mensajería. 

Un ejemplo que me gusta poner cuando se lo explico a gente que nunca ha trabajado con ellas es el botón de registrarte en una web. Tú te registras, pero el correo de bienvenida llega cuando le apetece: no estás esperando a que llegue el email para comprobar si puedes iniciar sesión o no. Esto se debe a que la arquitectura manda un mensaje a una cola/*broker* y un servicio lo consume y procesa por su cuenta. No hay ningún servicio bloqueando ese flujo.

#### ¿En qué situaciones usamos arquitectura asíncrona?
* Flujos donde no queremos dejar al usuario bloqueado.
* Procesos que no necesitan ser ejecutados inmediatamente.
* Cuando una acción afecta a varios servicios y no queremos ir invocándolos uno por uno.
* *Piensa en esto como:* «Mientras me descargo un juego, puedo estar con el móvil viendo qué ha subido Noobie».

#### Contras:
* Tener que levantar muchos servicios y muchas colas localmente.
* Tener que conectarme a entornos de prueba porque en local cuesta horrores montar todo.

---

### Single-threaded vs. Multithreaded

Aquí cambiamos un poco el modo de pensar: ya no tratamos de ver cómo manejamos la acción de un usuario para hacerle esperar o no, sino la forma directa en que procesamos esa acción. 

Imagina que vas al gimnasio y, para tu desgracia, te ha tocado el abuelete que hace 15 series en la única máquina de pecho que hay (*single-threaded*). Te toca esperar como un pelele a que el tío termine: es un cuello de botella en hora punta. En cambio, si hay 20 máquinas, estás de suerte porque los chavales y tú vais a poder entrenar a la vez sin perder el tiempo.

Llevándolo al terreno del software:
* **Un hilo (*single-threaded* / worker único):** Registro a un usuario en una base de datos y listo, un proceso lineal.
  * *Contras:* Como te entren 10 peticiones pesadas que se tiren un rato, colapsas el sistema y tu *manager* se quejará de los tiempos de respuesta.
* **Multihilo (*multithreaded*):** Imagina que necesito emitir una factura consultando la información del usuario y del pedido (dos bases de datos diferentes). Podría esperar a recibir los datos del usuario y luego los del pedido, pero ¿para qué tanta espera si puedo pedir los dos a la vez y luego procesarlos juntos?
  * *Contras:* Son más difíciles de programar y depurar, los hilos se pueden pisar si no están bien sincronizados y te puedes comer los recursos de la máquina sin darte cuenta.

---

### Cerebro

El problema de mi profesor yo creo que era otro (nunca me cayó muy bien, la verdad; casi me suspende por vacilarle), pero lo importante es que nos dejó una lección muy valiosa sobre cómo los sistemas pueden programarse de varias maneras para cumplir diferentes tareas. 

Es fundamental conocer estas diferencias cuando afrontamos una decisión de arquitectura: intentar usar el «cerebro de un hombre» (*single thread* síncrono) para un servicio con un volumen masivo de tráfico no va a salir bien, y viceversa.

**Adrián, *aka* Novato.**

---

*Muchas gracias por leer. Si quieres ser parte de esta aventura, no dudes en suscribirte.*