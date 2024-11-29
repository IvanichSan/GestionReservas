const express = require("express");
const router = express.Router();


let salas = [];
let nextSalaId = 1; 


router.get("/", (req, res) => {
  res.json(salas);
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  const sala = salas.find((sala) => sala.id === parseInt(id));
  if (!sala) {
    return res.status(404).json({ error: "Sala no encontrada" });
  }
  res.json(sala);
});


router.post("/", (req, res) => {
  const { nombre, capacidad } = req.body;

  
  if (salas.find((sala) => sala.nombre === nombre)) {
    return res.status(400).json({ error: "El nombre de la sala ya existe" });
  }

  const id = nextSalaId++; 
  salas.push({ id, nombre, capacidad, estado: "Activa" });

  res.status(201).json({ message: "Sala creada", sala: { id, nombre, capacidad, estado: "Activa" } });
});


router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { nombre, capacidad, estado } = req.body;
  const sala = salas.find((sala) => sala.id === parseInt(id));
  if (!sala) return res.status(404).json({ error: "Sala no encontrada" });

  sala.nombre = nombre || sala.nombre;
  sala.capacidad = capacidad || sala.capacidad;
  sala.estado = estado || sala.estado;
  res.json({ message: "Sala actualizada", sala });
});


router.delete("/:id", (req, res) => {
  const { id } = req.params;
  salas = salas.filter((sala) => sala.id !== parseInt(id));
  res.json({ message: "Sala eliminada" });
});

module.exports = {router, salas} ;
