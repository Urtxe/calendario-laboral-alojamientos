
📅 Calculadora de Balance Laboral
Una aplicación web de una sola página diseñada para la gestión y el cálculo del balance de horas de la jornada laboral anual.

🚀 Demo en Vivo
Puedes ver y usar la aplicación en vivo aquí:

https://urtxe.github.io/calendario-laboral-alojamientos/

ℹ️ Descripción
Esta herramienta permite a los usuarios llevar un control detallado de sus días trabajados, festivos, vacaciones y bajas. La aplicación calcula automáticamente el balance total de horas (comparando las horas trabajadas contra las requeridas anualmente) y lo muestra de forma clara y visual.

Los datos se guardan localmente en el navegador del usuario (localStorage), permitiendo que la información persista entre sesiones.

✨ Características Principales
Calendario Interactivo: Navegación sencilla entre meses y años.

Gestión de Días: Permite marcar días con 5 estados diferentes:

💼 Trabajado

📅 Fiesta

🏖️ Vacación

🏠 Abonable

🏥 Baja

Cálculo de Balance: Cuadro de mandos que muestra el total de días trabajados, festivos y el balance final de horas (positivo o negativo).

Festivos Trabajados: Lógica especial que ajusta el cómputo de horas requeridas si se trabaja en un día festivo.

Diseño Responsivo: Optimizado para funcionar perfectamente tanto en ordenadores de escritorio como en dispositivos móviles (probado en 390px).

Persistencia de Datos: Los días marcados se guardan en el navegador. No se pierden al cerrar la pestaña.

Reinicio Sencillo: Un botón "Resetear" permite borrar todos los datos y empezar de cero, previa confirmación.

🛠️ Cómo Usar
La aplicación tiene una interfaz de usuario intuitiva con dos modos de marcado:

1. Modo por Defecto (💼 Trabajado)
Por defecto, la herramienta está en modo "Trabajado".

Simplemente haz clic en un día para marcarlo como trabajado.

Vuelve a hacer clic para desmarcarlo.

2. Modo Específico (Fiesta, Vacación, etc.)
Si quieres marcar un día con otro estado:

Haz clic en uno de los botones de acción (ej: 🏖️ Vacación). El botón se quedará seleccionado (con un borde).

Ahora, todos los días que cliques se marcarán como "Vacación".

Para salir de este modo y volver al modo por defecto, simplemente vuelve a pulsar el botón de "Vacación".

Limpiar el Calendario
Haz clic en el botón 🧹 Resetear.

Confirma tu decisión en la ventana emergente.

Todos los días marcados se borrarán y el balance se reiniciará.

💻 Tecnologías Utilizadas
Este proyecto está construido desde cero ("from scratch") sin necesidad de frameworks o librerías externas.

HTML5

CSS3 (con Flexbox, Grid y Media Queries para el diseño responsivo)

JavaScript (Vanilla JS) (Para toda la lógica del calendario, manejo de eventos y localStorage)

Desarrollado por Mikel Urtxegi.


Este software se distribuye bajo GPL v3 para usos no comerciales. Para usos comerciales, contactar al autor para obtener licencia.