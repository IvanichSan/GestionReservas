const express = require("express");
const router = express.Router();
const {salas} = require("./salas");

let reservas = [];

router.get("/", (req, res) => {
  res.json(reservas);
});

router.post("/", (req, res) => {
  const { id, salaId, nombre, fechaInicio, fechaFin } = req.body;

  const sala = salas.find((sala) => sala.id === salaId);
  if (!sala || sala.estado !== "Activa") {
    return res.status(400).json({ error: "Sala inactiva o no encontrada" });
  }

  const conflicto = reservas.some(
    (reserva) =>
      reserva.salaId === salaId &&
      ((fechaInicio >= reserva.fechaInicio && fechaInicio < reserva.fechaFin) ||
        (fechaFin > reserva.fechaInicio && fechaFin <= reserva.fechaFin))
  );
  if (conflicto) {
    return res.status(400).json({ error: "Conflicto de reserva" });
  }

  reservas.push({ id, salaId, nombre, fechaInicio, fechaFin });
  res.status(201).json({ message: "Reserva creada" });
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const reserva = reservas.find((reserva) => reserva.id === parseInt(id));
  if (!reserva) return res.status(404).json({ error: "Reserva no encontrada" });

  const { nombre, fechaInicio, fechaFin } = req.body;
  reserva.nombre = nombre || reserva.nombre;
  reserva.fechaInicio = fechaInicio || reserva.fechaInicio;
  reserva.fechaFin = fechaFin || reserva.fechaFin;
  res.json({ message: "Reserva actualizada" });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  reservas = reservas.filter((reserva) => reserva.id !== parseInt(id));
  res.json({ message: "Reserva eliminada" });
});

module.exports = router;
