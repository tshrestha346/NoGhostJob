const express = require("express");
const router = express.Router();

const {
  getAllMembers,
  createMember,
  updateMember,
  deleteMember,
} = require("../Controller/memberController");

router.get("/", getAllMembers);
router.post("/", createMember);
router.put("/:id", updateMember);
router.delete("/:id", deleteMember);

module.exports = router;