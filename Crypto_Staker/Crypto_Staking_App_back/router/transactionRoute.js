const router = require("express").Router();

const {
  stake,
  unstake,
  getUserBalance,
  getUserRewards,
} = require("../controller/transactionController");

router.post("/stake", stake);

router.post("/unstake", unstake);

router.get("/getUserBalance", getUserBalance);

router.get("/getUserRewards", getUserRewards);

module.exports = router;
