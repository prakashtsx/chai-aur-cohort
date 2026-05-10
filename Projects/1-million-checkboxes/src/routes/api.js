const express = require("express");
const config = require("../config");

function createApiRouter({ checkboxStore }) {
  const router = express.Router();

  router.get("/api/checkboxes", async (req, res, next) => {
    try {
      const start = Number(req.query.start || 0);
      const count = Number(req.query.count || config.visibleWindowSize);
      res.json(await checkboxStore.range(start, count));
    } catch (error) {
      next(error);
    }
  });

  router.get("/api/stats", async (req, res) => {
    res.json({
      total: config.totalCheckboxes,
      visibleWindowSize: config.visibleWindowSize
    });
  });

  return router;
}

module.exports = { createApiRouter };
