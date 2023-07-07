const router = require("express").Router();

const { addToken, getTokens } = require("../controller/tokenController");

router.get("/getTokens", getTokens);
router.post("/addToken", addToken);

module.exports = router;
