const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3000;


app.use(cors());
app.use(bodyParser.json());

const salasRoutes = require("./routes/salas").router;
const reservasRoutes = require("./routes/reservas");

app.use("/salas", salasRoutes);
app.use("/reservas", reservasRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
