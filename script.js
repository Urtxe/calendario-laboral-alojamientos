var festivosDonosti = {
    2025: [
        '2025-01-01', '2025-01-06', '2025-01-20', '2025-04-18', '2025-04-21',
        '2025-04-17', '2025-05-01', '2025-07-25', '2025-07-29', '2025-07-31',
        '2025-08-15', '2025-11-01', '2025-12-06', '2025-12-08', '2025-12-25'
    ],
    2026: [
        '2026-01-01', // Año Nuevo
        '2026-01-06', // Reyes
        '2026-01-20', // San Sebastián (Local)
        '2026-03-19', // San José (Sustituye a festivo caído en domingo)
        '2026-04-02', // Jueves Santo
        '2026-04-03', // Viernes Santo
        '2026-04-06', // Lunes de Pascua
        '2026-05-01', // Día del Trabajo
        '2026-07-25', // Santiago Apóstol
        '2025-07-29', // Festivo Alojamientos, Santa Marta
        '2026-07-31', // San Ignacio (Gipuzkoa)
        '2026-08-15', // Asunción de la Virgen
        '2026-10-12', // Fiesta Nacional
        '2026-12-08', // La Inmaculada
        '2026-12-25'  // Navidad
    ]
};

var mesActual = new Date().getMonth();
var anioActual = new Date().getFullYear();
var diasMarcados = {};

// 'modoSeleccionado' guardará la acción elegida (ej: 'fiesta', 'vacacion').
// Si es 'null', la acción por defecto será 'trabajado'.
var modoSeleccionado = null; 

var dataGuardada = localStorage.getItem('misDiasMarcados');
if (dataGuardada) {
    diasMarcados = JSON.parse(dataGuardada);
}

var nombresMeses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

function getFechaKey(fecha) {
    var anio = fecha.getFullYear();
    var mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    var dia = fecha.getDate().toString().padStart(2, '0');
    return anio + '-' + mes + '-' + dia;
}

function esFestivo(fecha) {
    var fechaStr = getFechaKey(fecha);
    var festivos = festivosDonosti[fecha.getFullYear()];
    return festivos ? festivos.indexOf(fechaStr) !== -1 : false;
}

function renderCalendario() {
    var calendario = document.getElementById('calendario');
    calendario.innerHTML = '';

    var primerDia = new Date(anioActual, mesActual, 1).getDay();
    var diasMes = new Date(anioActual, mesActual + 1, 0).getDate();
    var primerDiaSemana = primerDia === 0 ? 6 : primerDia - 1;

    for (var i = 0; i < primerDiaSemana; i++) {
        var vacio = document.createElement('div');
        calendario.appendChild(vacio);
    }

    for (var dia = 1; dia <= diasMes; dia++) {
        var fecha = new Date(anioActual, mesActual, dia);
        var fechaKey = getFechaKey(fecha);
        var marcado = diasMarcados[fechaKey];
        var festivo = esFestivo(fecha);

        var celda = document.createElement('div');
        celda.className = 'day-cell';
        celda.innerHTML = '<span class="day-number">' + dia + '</span>';

        if (marcado) {
            celda.classList.add(marcado.tipo);
            if (marcado.esFestivo) {
                celda.innerHTML += '<span class="emoji">🎉</span>';
            }
        } else if (festivo) {
            celda.classList.add('festivo');
            celda.innerHTML += '<span class="emoji">🎉</span>';
        }

        // --- CAMBIO ---
        // Ya no usamos la clase 'selected'
        
        // --- CAMBIO ---
        // El clic en la celda ahora llama a 'procesarClickDia'
        celda.onclick = (function(d) {
            return function() { procesarClickDia(d); };
        })(dia);
        
        calendario.appendChild(celda);
    }

    document.getElementById('mesAnio').textContent = nombresMeses[mesActual] + ' ' + anioActual;
}

// --- FUNCIÓN NUEVA ---
// Se llama al hacer clic en un botón de acción (ej: 'Fiesta')
function seleccionarModo(tipo) {
    // Si pulsamos el mismo botón otra vez, lo desactivamos (volvemos al modo 'trabajado' por defecto)
    if (modoSeleccionado === tipo) {
        modoSeleccionado = null;
    } else {
        modoSeleccionado = tipo;
    }
    // Actualizamos el estilo de los botones para saber cuál está activo
    actualizarVisualBotones();
}

// --- FUNCIÓN NUEVA ---
// Añade un borde al botón que está activo para que el usuario lo sepa
function actualizarVisualBotones() {
    var botones = document.querySelectorAll('.action-buttons button');
    botones.forEach(function(btn) {
        var tipoBoton = null;
        // Extraemos el tipo (ej: de 'btn-fiesta' saca 'fiesta')
        btn.classList.forEach(function(clase) {
            if (clase.startsWith('btn-')) {
                tipoBoton = clase.replace('btn-', '');
            }
        });

        if (tipoBoton && tipoBoton === modoSeleccionado) {
            // Estilo para el botón activo
            btn.style.outline = '3px solid #333';
            btn.style.transform = 'scale(1.05)';
        } else {
            // Estilo para botones inactivos
            btn.style.outline = 'none';
            btn.style.transform = 'scale(1)';
        }
    });
}

// --- FUNCIÓN NUEVA ---
// Esta función reemplaza a 'seleccionarDia' y 'marcarDia'
// Se ejecuta CADA VEZ que se hace clic en un día del calendario
function procesarClickDia(dia) {
    // 1. Decide qué tipo aplicar
    // Si hay un modo seleccionado (fiesta, vacacion, etc.), se usa ese.
    // Si 'modoSeleccionado' es 'null', se usa el modo por defecto: 'trabajado'.
    var tipoParaAplicar = modoSeleccionado;
    if (tipoParaAplicar === null) {
        tipoParaAplicar = 'trabajado';
    }

    // 2. Obtiene los datos del día (como hacía 'marcarDia')
    var fecha = new Date(anioActual, mesActual, dia);
    var fechaKey = getFechaKey(fecha);
    var yaEsFestivo = esFestivo(fecha);

    // 3. Aplica o quita la marca (lógica de 'toggle')
    if (diasMarcados[fechaKey] && diasMarcados[fechaKey].tipo === tipoParaAplicar) {
        // Si ya estaba marcado con este tipo, lo borra
        delete diasMarcados[fechaKey];
    } else {
        // Si no, lo marca
        diasMarcados[fechaKey] = { tipo: tipoParaAplicar, esFestivo: yaEsFestivo };
    }

    // 4. Actualiza todo
    renderCalendario();
    calcularBalance();
    guardarDatos();
}


function cambiarMes(direccion) {
    mesActual += direccion;
    if (mesActual > 11) {
        mesActual = 0;
        anioActual++;
    } else if (mesActual < 0) {
        mesActual = 11;
        anioActual--;
    }
    // --- CAMBIO ---
    // Ya no necesitamos resetear 'diaSeleccionado' ni ocultar los botones
    renderCalendario();
}

function guardarDatos() {
    localStorage.setItem('misDiasMarcados', JSON.stringify(diasMarcados));
}

function limpiarCalendario() {
    // Pedimos confirmación para una acción destructiva
    var confirmacion = confirm("¿Estás seguro de que quieres borrar todos los días marcados? Esta acción no se puede deshacer.");

    if (confirmacion) {
        // 1. Borra todos los datos
        diasMarcados = {};
        
        // 2. Resetea el modo seleccionado
        modoSeleccionado = null;
        
        // 3. Guarda el estado vacío
        guardarDatos();
        
        // 4. Actualiza la vista
        renderCalendario();
        calcularBalance();
        actualizarVisualBotones();
    }
}

function calcularBalance() {
    var horasTrabajadas = 0;
    var horasRequeridas = parseInt(document.getElementById('horasAnuales').value);
    var diasTrabajados = 0;
    var diasFiesta = 0;
    var festivosTrabajados = 0;

    for (var fecha in diasMarcados) {
        var data = diasMarcados[fecha];
        if (data.tipo === 'trabajado' || data.tipo === 'baja') {
            horasTrabajadas += 8;
            diasTrabajados++;
            
            if (data.esFestivo) {
                festivosTrabajados++;
                horasRequeridas -= 4; // Ajuste por festivo trabajado
            }
        }
        if (data.tipo === 'fiesta') {
            diasFiesta++;
        }
    }

    var balance = horasTrabajadas - horasRequeridas;
    var diasBalance = balance / 8;

    document.getElementById('diasTrabajados').textContent = diasTrabajados;
    document.getElementById('diasFiesta').textContent = diasFiesta;
    document.getElementById('horasTrabajadas').textContent = horasTrabajadas + 'h';
    document.getElementById('horasRequeridas').textContent = horasRequeridas + 'h';
    document.getElementById('festivosTrabajados').textContent = festivosTrabajados;

    var balanceResult = document.getElementById('balanceResult');
    document.getElementById('balanceHoras').textContent = 
        (balance >= 0 ? '+' : '') + balance + ' horas';
    document.getElementById('balanceDias').textContent = 
        (diasBalance >= 0 ? '+' : '') + diasBalance.toFixed(1) + ' días';

    if (balance >= 0) {
        balanceResult.className = 'balance-result positive';
        document.getElementById('balanceMensaje').textContent = 
            'Has trabajado más horas de las requeridas';
    } else {
        balanceResult.className = 'balance-result negative';
        document.getElementById('balanceMensaje').textContent = 
            'Te faltan horas por completar';
    }
}

// --- Código de inicialización ---
document.getElementById('diasAnuales').addEventListener('input', calcularBalance);
document.getElementById('horasAnuales').addEventListener('input', calcularBalance);

renderCalendario();
calcularBalance();
actualizarVisualBotones(); // Lo llamamos al inicio por si acaso