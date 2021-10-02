const { Router } = require("express");
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');const { Router } = require("express");
const verifyToken = require("../utils/middlewares/validateToken");
const isAdmin = require("../utils/middlewares/isAdmin");
const productControllers = require("../controllers/product");
const router = Router();
router.get("/", productControllers.getAll);
router.get("/search/:id", productControllers.getByID);
router.get("/orderByPrice/:price", productControllers.orderByPrice);
router.get("/orderByName/:name", productControllers.orderByName);
router.get("/orderByRating/:rating", productControllers.orderByRating);
router.post("/create", isAdmin, productControllers.create);
router.post("/", productControllers.create);
router.post("/add/carrito", productControllers.addProduct);
router.put("/:id", isAdmin, productControllers.update);
router.delete("/:id", isAdmin, productControllers.delete);

module.exports = router;
