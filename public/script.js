const API_URL = "http://localhost:3000";

const tableSalas = document.getElementById("table-salas");
const tableReservas = document.getElementById("table-reservas");
const formSalas = document.getElementById("salas-form");
const formReservas = document.getElementById("reservas-form");
const reservaSalaId = document.getElementById("reserva-salaId");
const reservaSalaNombre = document.getElementById("reserva-salaNombre");

async function mostrarSalas() {
  const response = await fetch(`${API_URL}/salas`);
  const salas = await response.json();

  tableSalas.innerHTML = `
    <tr>
      <th>ID</th>
      <th>Nombre</th>
      <th>Capacidad</th>
      <th>Estado</th>
      <th>Acciones</th>
    </tr>
  `;

  salas.forEach((sala) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${sala.id}</td>
      <td>${sala.nombre}</td>
      <td>${sala.capacidad}</td>
      <td>${sala.estado}</td>
      <td>
        <button onclick="habilitarReserva(${sala.id}, '${sala.nombre}')">Reservar</button>
        <button onclick="editarSala(${sala.id})">Editar</button>
        <button onclick="eliminarSala(${sala.id})">Eliminar</button>
      </td>
    `;
    tableSalas.appendChild(row);
  });
}

function habilitarReserva(salaId, salaNombre) {
  reservaSalaId.value = salaId;
  reservaSalaNombre.value = salaNombre;
  document.getElementById("form-reserva").style.display = "block";
}

formSalas.addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.getElementById("sala-id").value;
  const nombre = document.getElementById("sala-nombre").value;
  const capacidad = document.getElementById("sala-capacidad").value;

  const sala = { nombre, capacidad: parseInt(capacidad), estado: "Activa" };

  try {
    if (id) {
      await fetch(`${API_URL}/salas/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sala),
      });
    } else {
      await fetch(`${API_URL}/salas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sala),
      });
    }

    mostrarSalas();
    formSalas.reset();
  } catch (error) {
    console.error("Error al guardar la sala:", error);
  }
});

formReservas.addEventListener("submit", async (e) => {
  e.preventDefault();

  const salaId = parseInt(reservaSalaId.value);
  const nombre = document.getElementById("reserva-nombre").value;
  const fechaInicio = document.getElementById("reserva-fechaInicio").value;
  const fechaFin = document.getElementById("reserva-fechaFin").value;

  if (new Date(fechaInicio) >= new Date(fechaFin)) {
    alert("La fecha de inicio debe ser anterior a la fecha de fin.");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/reservas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ salaId, nombre, fechaInicio, fechaFin }),
    });

    if (!response.ok) {
      const error = await response.json();
      alert(error.error);
    } else {
      mostrarReservas();
      formReservas.reset();
      document.getElementById("form-reserva").style.display = "none";
    }
  } catch (error) {
    console.error("Error al crear la reserva:", error);
  }
});

async function mostrarReservas() {
  const response = await fetch(`${API_URL}/reservas`);
  const reservas = await response.json();

  tableReservas.innerHTML = `
    <tr>
      <th>Sala</th>
      <th>Reservante</th>
      <th>Inicio</th>
      <th>Fin</th>
      <th>Acciones</th>
    </tr>
  `;

  reservas.forEach((reserva) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${reserva.salaId}</td>
      <td>${reserva.nombre}</td>
      <td>${reserva.fechaInicio}</td>
      <td>${reserva.fechaFin}</td>
      <td>
        <button onclick="eliminarReserva(${reserva.salaId})">Eliminar</button>
      </td>
    `;
    tableReservas.appendChild(row);
  });
}



async function eliminarReserva(id) {
  if (!confirm("¿Estás seguro de cancelar esta reserva?")) return;

  try {
    await fetch(`${API_URL}/reservas/${id}`, { method: "DELETE" });
    mostrarReservas();
  } catch (error) {
    console.error("Error al cancelar la reserva:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  mostrarSalas();
  mostrarReservas();
});
