const express = require("express");
const router = express.Router();
const compilerController = require("../controllers/compilerController");

// API endpoints
router.post("/run-java", compilerController.runJava);
router.post("/run-cpp", compilerController.runCpp);
router.post("/run-js", compilerController.runJs);
router.post("/run-python", compilerController.runPython);

module.exports = router;