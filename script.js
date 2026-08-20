/* ============================================================
   JUANICO · 80 AÑOS — SCRIPT
   ============================================================ */

/* ----------------------------------------------------------
   CONFIG
   Editá únicamente estos valores. Todo el sitio los usa
   desde acá — no hace falta tocar el HTML ni el CSS.
---------------------------------------------------------- */
const CONFIG = {
  nombre: "Juanico",
  // Fecha del evento en formato ISO (usada por el contador)
  fechaEventoISO: "2026-12-19T00:00:00",
  fechaEventoTexto: "19 de diciembre de 2026",
  hora: "21:30",
  lugar: "Salón La Familia",
  direccion: "Feliciano 443",
  telefono: "5493435451818", // formato internacional sin '+' ni espacios
  alias: "los80dejuanico",
  fechaLimiteConfirmacion: "1 de diciembre de 2026",
  mensajeWhatsapp: "Hola! 🎉 Quiero confirmar mi presencia en los 80 años de Juanico, el 19 de diciembre. ¡Nos vemos! ❤️"
};

/* ----------------------------------------------------------
   DOM
---------------------------------------------------------- */
const dom = {
  pantalla1: document.getElementById("pantalla-1"),
  pantalla2: document.getElementById("pantalla-2"),
  btnAbrir: document.getElementById("btnAbrir"),

  fechaEvento: document.getElementById("fechaEvento"),
  valorHora: document.getElementById("valorHora"),
  valorLugar: document.getElementById("valorLugar"),
  valorDireccion: document.getElementById("valorDireccion"),
  fechaLimite: document.getElementById("fechaLimite"),
  valorAlias: document.getElementById("valorAlias"),

  contador: document.getElementById("contador"),
  numDias: document.getElementById("numDias"),
  numHoras: document.getElementById("numHoras"),
  numMinutos: document.getElementById("numMinutos"),
  numSegundos: document.getElementById("numSegundos"),
  mensajeHoy: document.getElementById("mensajeHoy"),

  btnWhatsapp: document.getElementById("btnWhatsapp"),
  btnCopiar: document.getElementById("btnCopiar"),
  confirmacionCopia: document.getElementById("confirmacionCopia"),

  fadeUps: document.querySelectorAll(".fade-up")
};

const prefiereMenosMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ----------------------------------------------------------
   INICIALIZACIÓN DE DATOS (desde CONFIG hacia el DOM)
---------------------------------------------------------- */
function pintarConfiguracion() {
  dom.fechaEvento.textContent = CONFIG.fechaEventoTexto;
  dom.valorHora.textContent = CONFIG.hora;
  dom.valorLugar.textContent = CONFIG.lugar;
  dom.valorDireccion.textContent = CONFIG.direccion;
  dom.fechaLimite.textContent = CONFIG.fechaLimiteConfirmacion;
  dom.valorAlias.textContent = CONFIG.alias;
}

/* ----------------------------------------------------------
   ALTURA REAL DEL VIEWPORT (evita saltos por la barra de
   direcciones en navegadores móviles)
---------------------------------------------------------- */
function fijarAlturaViewport() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
}

/* ----------------------------------------------------------
   NAVEGACIÓN · transición entre pantallas
---------------------------------------------------------- */
function abrirInvitacion() {
  dom.btnAbrir.disabled = true;
  dom.btnAbrir.classList.add("sello--activado");

  const duracionSello = prefiereMenosMovimiento ? 0 : 620;

  window.setTimeout(() => {
    dom.pantalla1.classList.add("portada--oculta");
    dom.pantalla1.setAttribute("aria-hidden", "true");

    dom.pantalla2.setAttribute("aria-hidden", "false");
    dom.pantalla2.classList.add("invitacion--visible");

    // Foco accesible: mover el foco al contenido nuevo
    dom.pantalla2.setAttribute("tabindex", "-1");
    dom.pantalla2.focus({ preventScroll: true });

    window.scrollTo({ top: 0, behavior: prefiereMenosMovimiento ? "auto" : "smooth" });

    activarScrollReveal();
  }, duracionSello);
}

/* ----------------------------------------------------------
   ANIMACIONES · aparición progresiva al hacer scroll
---------------------------------------------------------- */
function activarScrollReveal() {
  if (!("IntersectionObserver" in window) || prefiereMenosMovimiento) {
    dom.fadeUps.forEach((el) => el.classList.add("en-vista"));
    return;
  }

  const observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add("en-vista");
          observador.unobserve(entrada.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  dom.fadeUps.forEach((el) => observador.observe(el));
}

/* ----------------------------------------------------------
   CONTADOR REGRESIVO
---------------------------------------------------------- */
let idIntervaloContador = null;

function actualizarContador() {
  const ahora = new Date().getTime();
  const objetivo = new Date(CONFIG.fechaEventoISO).getTime();
  const diferencia = objetivo - ahora;

  if (diferencia <= 0) {
    if (idIntervaloContador) window.clearInterval(idIntervaloContador);
    dom.contador.hidden = true;
    dom.mensajeHoy.hidden = false;
    return;
  }

  const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
  const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
  const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);

  dom.numDias.textContent = String(dias).padStart(2, "0");
  dom.numHoras.textContent = String(horas).padStart(2, "0");
  dom.numMinutos.textContent = String(minutos).padStart(2, "0");
  dom.numSegundos.textContent = String(segundos).padStart(2, "0");
}

function iniciarContador() {
  actualizarContador();
  idIntervaloContador = window.setInterval(actualizarContador, 1000);
}

/* ----------------------------------------------------------
   WHATSAPP
---------------------------------------------------------- */
function abrirWhatsapp() {
  const mensaje = encodeURIComponent(CONFIG.mensajeWhatsapp);
  const url = `https://wa.me/${CONFIG.telefono}?text=${mensaje}`;
  window.open(url, "_blank", "noopener");
}

/* ----------------------------------------------------------
   COPIAR ALIAS
---------------------------------------------------------- */
let idTimeoutCopia = null;

async function copiarAlias() {
  try {
    await navigator.clipboard.writeText(CONFIG.alias);
    mostrarConfirmacionCopia();
  } catch (error) {
    // Alternativa para navegadores sin soporte de clipboard API
    copiarAliasAlternativo();
  }
}

function copiarAliasAlternativo() {
  const areaTemporal = document.createElement("textarea");
  areaTemporal.value = CONFIG.alias;
  areaTemporal.setAttribute("readonly", "");
  areaTemporal.style.position = "absolute";
  areaTemporal.style.left = "-9999px";
  document.body.appendChild(areaTemporal);
  areaTemporal.select();
  try {
    document.execCommand("copy");
    mostrarConfirmacionCopia();
  } catch (error) {
    console.error("No se pudo copiar el alias:", error);
  }
  document.body.removeChild(areaTemporal);
}

function mostrarConfirmacionCopia() {
  dom.confirmacionCopia.classList.add("visible");
  if (idTimeoutCopia) window.clearTimeout(idTimeoutCopia);
  idTimeoutCopia = window.setTimeout(() => {
    dom.confirmacionCopia.classList.remove("visible");
  }, 2600);
}

/* ----------------------------------------------------------
   EVENTOS
---------------------------------------------------------- */
function registrarEventos() {
  dom.btnAbrir.addEventListener("click", abrirInvitacion);
  dom.btnWhatsapp.addEventListener("click", abrirWhatsapp);
  dom.btnCopiar.addEventListener("click", copiarAlias);

  window.addEventListener("resize", fijarAlturaViewport);
  window.addEventListener("orientationchange", fijarAlturaViewport);
}

/* ----------------------------------------------------------
   INICIO
---------------------------------------------------------- */
function iniciar() {
  fijarAlturaViewport();
  pintarConfiguracion();
  iniciarContador();
  registrarEventos();
}

document.addEventListener("DOMContentLoaded", iniciar);
