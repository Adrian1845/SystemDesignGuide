Una de las cosas que habrás escuchado 100% si estás en el sector IT es sobre el monolito. El monolito está muy demonizado ya que normalmente se asocia a código legacy con sus infinitas malas prácticas y su burocracia horrible, donde ni eres capaz de arrancarlo en local. Por el contrario, habrás escuchado hablar de los microservicios como la solución definitiva a las malas prácticas y como el Santo Grial para facilitar el testeo de la app.

Realmente ni el monolito es tan malo ni los microservicios son tan buenos. Ambas son formas de llegar a lo mismo, cada una con sus pros y sus contras. Como se suele decir: no es el coche, es el conductor.

Vamos a repasar los básicos de los monolitos y los microservicios (que ya os sabéis de sobra) y cómo podemos utilizarlos a nuestro favor en una entrevista sobre diseño de sistemas.



Monolito

Un monolito al final no es más que toda la aplicación junta, no tiene mucha pérdida. Esta manera de estructurar el código es muy habitual y sumamente útil para empresas pequeñas con poco volumen.

Yo, personalmente, he visto muchos de estos en peluquerías, gimnasios, restaurantes… Son modelos de negocio donde el software es un mero complemento: no tienen mucho tráfico ni unos requerimientos espectaculares. A muchos de estos negocios podrías quitarles el ordenador para siempre y lo único que cambiaría es que volverían al papel. Mi gimnasio, en concreto, usa papel todavía para llevar las cuentas.

El monolito se encarga de todo: tiene dentro todas las funcionalidades, desde el registro de usuarios pasando por la pasarela de pagos hasta el envío del correo de bienvenida.

Esto lo hace bastante cómodo para desarrollar, ya que va todo en pack: seguir el flujo es sencillo y solo necesitas levantar una aplicación. Sin embargo, viene con varios contras que para las empresas con más tráfico son difíciles de gestionar:





Son difíciles de escalar.



Trabajar en paralelo se vuelve complejo.



Tienes todo el código acoplado: un cambio en un módulo puede afectar a toda la aplicación.



La mayoría del trabajo tiene que ser síncrono.



Un fallo crítico te tumba toda la empresa.

Otros problemas de los monolitos surgen a la hora de pasar ciertas pipelines o implementar nuevas tecnologías, ya que afectan a todo el codebase. En mi caso, en la empresa tenemos microservicios que pesan más de 1 GB; si todo estuviera acoplado en un único monolito, la aplicación pesaría más de 10 GB, tendría a saber cuántos miles de tests y pasar una pipeline tardaría probablemente más de 4 horas.



Microservicios

Los microservicios son el enfoque opuesto: pequeñas piezas de código independientes que interactúan entre sí. En el ejemplo anterior, en vez de tenerlo todo junto, tendríamos el registro de usuarios por un lado, la pasarela de pagos por otro y el servicio de correos al final del flujo.

Estos servicios, aunque interactúan entre sí, no llegan al nivel de acoplamiento de un monolito. Puedes implementar una herramienta de calidad de código en el servicio de pagos sin que afecte a los demás. Si quieres añadir un servicio nuevo que emita facturas, puedes conectarlo con el servicio de correos sin alterar el resto.

Suena idílico y parece que todo son ventajas, pero si estás avispado te habrás dado cuenta de que no todo es color de rosa. Los microservicios traen consigo el problema fundamental de todo sistema distribuido: la complejidad de probar las aplicaciones y centralizar los datos.





Necesitas unificar todos los logs.



Para probar flujos completos debes levantar varios servicios a la vez.



Desalineamientos de código que requieren mucha comunicación entre equipos.



Suele ser necesario bastante trabajo asíncrono, lo que aumenta exponencialmente la complejidad.



En big corpo, te van a amargar la vida con los permisos y las VPNs. (Este último punto no es culpa directa de los microservicios, pero aquí el que perdona murió en la cruz).



Cara a cara con el sistema

Imagínate que te proponen desarrollar una aplicación para un bar de barrio que quiere recibir reservas desde su web. Viendo las dos opciones, ¿montarías un sistema distribuido? Obviamente no, un monolito le viene como anillo al dedo.

Que el monolito haya sido tan criticado no significa que sea una mala solución por definición. Un monolito bien estructurado, con buenas prácticas y arquitectura limpia, da gusto trabajarlo; del mismo modo que un ecosistema de microservicios puede estar hecho de pena. He vivido ambas situaciones y para el desarrollador la faena es la misma, sean microservicios distribuidos o un monolito inmanejable.

Lo más importante y que resume bien la lección de hoy es esto:



Monolito: si la aplicación es pequeña y no se prevé una escalabilidad brutal a corto/medio plazo.

Microservicios: si hay alta complejidad de dominio, se prevé escalar mucho y se cuenta con el equipo y el plan para mantenerlos a largo plazo.

Podríamos estar todo el día analizando casos de uso, ventajas y desventajas, pero no es el objetivo. Nadie con más de dos neuronas va a desplegar un clúster de Kubernetes para una peluquería: primero por el coste de mantenerlo y segundo porque es complicarse la vida sin necesidad.

Como desarrolladores, ingenieros o arquitectos, tenemos que conocer ambas soluciones y mantener los pies en el suelo. En consultoría para grandes clientes se tiende a vender la solución más compleja posible (a todos nos gustan los retos técnicos y un monolito sabe a poco). Además, muchos lo hacen para poder poner en el currículum que diseñaron un sistema asíncrono… aunque a la empresa le cueste 3.000 € al mes mantenerlo a flote. Pero si te quedas un par de años en ese proyecto, serás tú quien sufra las consecuencias de una mala decisión de arquitectura.



Una disculpa por no haber publicado nada, estaba de vacaciones y estoy preparando algo que va a complementar mejor las lecciones

Adrián, aka Novato.



Muchas gracias por leer. Si quieres ser parte de esta aventura, no dudes en suscribirte.

