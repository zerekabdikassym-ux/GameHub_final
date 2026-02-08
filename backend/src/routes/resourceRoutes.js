const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const {
  createResource,
  getAllResources,
  getResourceById,
  updateResource,
  deleteResource
} = require("../controllers/resourceController");

const { createResourceSchema, updateResourceSchema } = require("../validators/resourceValidators");

router.use(auth);

router.post("/", validate(createResourceSchema), createResource);
router.get("/", getAllResources);
router.get("/:id", getResourceById);
router.put("/:id", validate(updateResourceSchema), updateResource);
router.delete("/:id", deleteResource);

module.exports = router;
