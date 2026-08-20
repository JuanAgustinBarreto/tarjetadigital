/* =======================================================
   1) CONFIGURACIÓN — EDITÁ SOLO ESTO
   La foto va en:  img/abuelo.jpg
   ======================================================= */
const CONFIG = {
  nombre: "Juanico",
  fecha: "19 de diciembre",
  hora: "21:00 hs",
  lugar: "Salón La Familia",
  direccion: "Feliciano 448",
  telefono: "5493435451818", // sin +, sin espacios
  valor: "$40.000",
};

// Fecha y hora del evento para el contador (año, mes-1, día, hora, minuto)
const FECHA_EVENTO = new Date(2026, 11, 19, 21, 0, 0);

/* =======================================================
   2) ELEMENTOS DEL DOM
   ======================================================= */
const $ = (id) => document.getElementById(id);

const pantalla = $("bienvenida");
const invitacion = $("invitacion");
const btnAbrir = $("btn-abrir");
const btnConfirmar = $("btn-confirmar");
const cuenta = $("cuenta");
const cuentaFinal = $("cuenta-final");

const reducirMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* =======================================================
   3) FUNCIONES
   ======================================================= */

/** Vuelca los datos de CONFIG en la tarjeta */
function cargarDatos() {
  $("nombre").textContent = CONFIG.nombre;
  $("fecha").textContent = CONFIG.fecha.toUpperCase();
  $("hora").textContent = CONFIG.hora;
  $("lugar").textContent = CONFIG.lugar;
  $("direccion").textContent = CONFIG.direccion;
  $("valor").textContent = CONFIG.valor;
}

/** Transición de la pantalla de bienvenida a la invitación */
function abrirInvitacion() {
  pantalla.classList.add("saliendo");
  invitacion.classList.remove("oculto");
  invitacion.setAttribute("aria-hidden", "false");

  window.setTimeout(() => {
    pantalla.classList.add("oculto");
    invitacion.scrollIntoView({ behavior: reducirMovimiento ? "auto" : "smooth", block: "start" });
    lanzarConfeti(50);
  }, reducirMovimiento ? 0 : 700);
}

/** Confeti dorado hecho solo con JS + CSS */
function lanzarConfeti(cantidad) {
  if (reducirMovimiento) return;

  const colores = ["#8B0000", "#C99700", "#FFD966", "#FF6B6B"];

  for (let i = 0; i < cantidad; i++) {
    const p = document.createElement("i");
    p.className = "confeti";
    p.style.left = Math.random() * 100 + "vw";
    p.style.background = colores[Math.floor(Math.random() * colores.length)];
    p.style.animationDuration = 2.6 + Math.random() * 2.4 + "s";
    p.style.animationDelay = Math.random() * 0.8 + "s";
    p.style.opacity = String(0.6 + Math.random() * 0.4);
    document.body.appendChild(p);
    p.addEventListener("animationend", () => p.remove());
  }
}

/** Arma el link de WhatsApp y lo abre */
function confirmarAsistencia() {
  const mensaje =
    "Hola! 🎉 Confirmo mi asistencia al cumpleaños de los 80 de " +
    CONFIG.nombre +
    " el " + CONFIG.fecha + ". ¡Nos vemos! ❤️";

  const url = "https://wa.me/" + CONFIG.telefono + "?text=" + encodeURIComponent(mensaje);
  window.open(url, "_blank", "noopener");
}

/** Contador regresivo */
function actualizarContador() {
  const restante = FECHA_EVENTO.getTime() - Date.now();

  if (restante <= 0) {
    cuenta.classList.add("oculto");
    cuentaFinal.classList.remove("oculto");
    window.clearInterval(intervalo);
    return;
  }

  const seg = Math.floor(restante / 1000);
  $("c-dias").textContent = Math.floor(seg / 86400);
  $("c-horas").textContent = Math.floor((seg % 86400) / 3600);
  $("c-min").textContent = Math.floor((seg % 3600) / 60);
  $("c-seg").textContent = seg % 60;
}

/* =======================================================
   4) EVENTOS E INICIO
   ======================================================= */
btnAbrir.addEventListener("click", abrirInvitacion);
btnConfirmar.addEventListener("click", confirmarAsistencia);

cargarDatos();
actualizarContador();
const intervalo = window.setInterval(actualizarContador, 1000);
