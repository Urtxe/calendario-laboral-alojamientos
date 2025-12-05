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
        '2026-07-29', // Festivo Alojamientos, Santa Marta
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
var objetivosAnuales = {};

var modoSeleccionado = null; 

var dataGuardada = localStorage.getItem('misDiasMarcados');
if (dataGuardada) {
    diasMarcados = JSON.parse(dataGuardada);
}

var objetivosGuardados = localStorage.getItem('misObjetivosAnuales');
if (objetivosGuardados) {
    objetivosAnuales = JSON.parse(objetivosGuardados);
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

        celda.onclick = (function(d) {
            return function() { procesarClickDia(d); };
        })(dia);
        
        calendario.appendChild(celda);
    }

    document.getElementById('mesAnio').textContent = nombresMeses[mesActual] + ' ' + anioActual;
}

function seleccionarModo(tipo) {
    if (modoSeleccionado === tipo) {
        modoSeleccionado = null;
    } else {
        modoSeleccionado = tipo;
    }
    actualizarVisualBotones();
}

function actualizarVisualBotones() {
    var botones = document.querySelectorAll('.action-buttons button');
    botones.forEach(function(btn) {
        var tipoBoton = null;
        btn.classList.forEach(function(clase) {
            if (clase.startsWith('btn-')) {
                tipoBoton = clase.replace('btn-', '');
            }
        });

        if (tipoBoton && tipoBoton === modoSeleccionado) {
            btn.style.outline = '3px solid #333';
            btn.style.transform = 'scale(1.05)';
        } else {
            btn.style.outline = 'none';
            btn.style.transform = 'scale(1)';
        }
    });
}

function procesarClickDia(dia) {
    var tipoParaAplicar = modoSeleccionado;
    if (tipoParaAplicar === null) {
        tipoParaAplicar = 'trabajado';
    }

    var fecha = new Date(anioActual, mesActual, dia);
    var fechaKey = getFechaKey(fecha);
    var yaEsFestivo = esFestivo(fecha);

    if (diasMarcados[fechaKey] && diasMarcados[fechaKey].tipo === tipoParaAplicar) {
        delete diasMarcados[fechaKey];
    } else {
        diasMarcados[fechaKey] = { tipo: tipoParaAplicar, esFestivo: yaEsFestivo };
    }

    renderCalendario();
    calcularBalance();
    guardarDatos();
    actualizarTablaResumen();
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
    
    // --- NUEVO: Sincronizar UI al cambiar con flechas ---
    actualizarInputsAlCambiarAnio();
    
    renderCalendario();
    calcularBalance();
}

// Función auxiliar para actualizar los inputs cuando cambia el año (por flecha o manual)
function actualizarInputsAlCambiarAnio() {
    // 1. Actualizar el input del año
    document.getElementById('inputAnio').value = anioActual;

    // 2. Actualizar el input de horas objetivo según memoria
    var horasDelAnio = objetivosAnuales[anioActual] || 0;
    document.getElementById('horasAnuales').value = horasDelAnio === 0 ? '' : horasDelAnio;
}

function guardarDatos() {
    localStorage.setItem('misDiasMarcados', JSON.stringify(diasMarcados));
}

function limpiarCalendario() {
    var confirmacion = confirm("¿Estás seguro de que quieres borrar todos los días marcados? Esta acción no se puede deshacer.");

    if (confirmacion) {
        diasMarcados = {};
        modoSeleccionado = null;
        guardarDatos();
        renderCalendario();
        calcularBalance();
        actualizarVisualBotones();
        actualizarTablaResumen();
    }
}

function calcularBalance() {
    var horasTrabajadas = 0;
    var horasRequeridas = objetivosAnuales[anioActual] || parseInt(document.getElementById('horasAnuales').value) || 0;
    var diasTrabajados = 0;
    var diasFiesta = 0;
    var festivosTrabajados = 0;

    for (var fecha in diasMarcados) {
        var anioDeLaFecha = parseInt(fecha.split('-')[0]);

        if (anioDeLaFecha !== anioActual) {
            continue; 
        }

        var data = diasMarcados[fecha];
        
        if (data.tipo === 'trabajado' || data.tipo === 'baja') {
            horasTrabajadas += 8;
            diasTrabajados++;
            
            if (data.esFestivo) {
                festivosTrabajados++;
                horasRequeridas -= 4; 
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
    var mensajeAnio = 'Balance ' + anioActual + ': ';

    document.getElementById('balanceHoras').textContent = 
        (balance >= 0 ? '+' : '') + balance + ' horas';
    document.getElementById('balanceDias').textContent = 
        (diasBalance >= 0 ? '+' : '') + diasBalance.toFixed(1) + ' días';

    if (balance >= 0) {
        balanceResult.className = 'balance-result positive';
        document.getElementById('balanceMensaje').textContent = 
            mensajeAnio + 'Has trabajado más horas de las requeridas';
    } else {
        balanceResult.className = 'balance-result negative';
        document.getElementById('balanceMensaje').textContent = 
            mensajeAnio + 'Te faltan horas por completar';
    }
}

function actualizarTablaResumen() {
    var datosPorAnio = {};

    for (var fecha in diasMarcados) {
        var anio = fecha.split('-')[0];
        var data = diasMarcados[fecha];

        if (!datosPorAnio[anio]) {
            datosPorAnio[anio] = { trabajadas: 0, festivos: 0 };
        }

        if (data.tipo === 'trabajado' || data.tipo === 'baja') {
            datosPorAnio[anio].trabajadas += 8;
            if (data.esFestivo) {
                datosPorAnio[anio].festivos++;
            }
        }
    }

    var cuerpoTabla = document.getElementById('cuerpoTablaResumen');
    cuerpoTabla.innerHTML = '';
    
    var todosLosAnios = new Set([
        ...Object.keys(datosPorAnio), 
        ...Object.keys(objetivosAnuales)
    ]);
    
    var aniosOrdenados = Array.from(todosLosAnios).sort();

    if (aniosOrdenados.length === 0) {
        cuerpoTabla.innerHTML = '<tr><td colspan="5">Sin datos registrados</td></tr>';
        return;
    }

    aniosOrdenados.forEach(function(anio) {
        var trabajadas = datosPorAnio[anio] ? datosPorAnio[anio].trabajadas : 0;
        var festivos = datosPorAnio[anio] ? datosPorAnio[anio].festivos : 0;
        
        var objetivoBase = objetivosAnuales[anio] || 0;
        var objetivoReal = objetivoBase - (festivos * 4); 

        var balance = trabajadas - objetivoReal;
        
        var colorBalance = balance >= 0 ? '#4caf50' : '#f44336'; 
        var simbolo = balance > 0 ? '+' : '';

        var fila = document.createElement('tr');
        fila.innerHTML = 
            `<td><strong>${anio}</strong></td>` +
            `<td>${trabajadas}h</td>` +
            `<td>${objetivoBase}h</td>` +
            `<td>${festivos}</td>` +
            `<td style="color:${colorBalance}; font-weight:bold;">${simbolo}${balance}h</td>`;
        
        cuerpoTabla.appendChild(fila);
    });
}

// --- EVENT LISTENERS ---

// 1. Escuchar cambios manuales en el INPUT DE AÑO
var inputAnio = document.getElementById('inputAnio');
inputAnio.addEventListener('input', function() {
    var nuevoAnio = parseInt(this.value);
    // Validación simple: entre 1900 y 2100 para no romper cálculos
    if (nuevoAnio && nuevoAnio > 1900 && nuevoAnio < 2100) {
        anioActual = nuevoAnio;
        // Al cambiar el año manualmente, hay que actualizar horas y calendario
        // No llamamos a 'actualizarInputsAlCambiarAnio' aquí para no sobreescribir lo que estás escribiendo
        
        var horasDelAnio = objetivosAnuales[anioActual] || 0;
        document.getElementById('horasAnuales').value = horasDelAnio === 0 ? '' : horasDelAnio;
        
        renderCalendario();
        calcularBalance();
    }
});

// 2. Escuchar cambios en el INPUT DE HORAS (Objetivos)
var inputHoras = document.getElementById('horasAnuales');
inputHoras.addEventListener('input', function() {
    var valor = parseInt(inputHoras.value) || 0;
    objetivosAnuales[anioActual] = valor;
    localStorage.setItem('misObjetivosAnuales', JSON.stringify(objetivosAnuales));
    
    calcularBalance();
    actualizarTablaResumen();
});


// --- INICIALIZACIÓN ---
renderCalendario();
actualizarInputsAlCambiarAnio(); // Carga año y horas iniciales
calcularBalance();
actualizarVisualBotones();
actualizarTablaResumen();