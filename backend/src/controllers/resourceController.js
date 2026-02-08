const Resource = require("../models/Resource");

async function createResource(req, res, next) {
  try {
    const doc = await Resource.create({ ...req.body, user: req.user.id });
    res.status(201).json(doc);
  } catch (err) {
    next(err);
  }
}

async function getAllResources(req, res, next) {
  try {
    const list = await Resource.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    next(err);
  }
}

async function getResourceById(req, res, next) {
  try {
    const doc = await Resource.findOne({ _id: req.params.id, user: req.user.id });
    if (!doc) return res.status(404).json({ message: "Resource not found" });
    res.json(doc);
  } catch (err) {
    next(err);
  }
}

async function updateResource(req, res, next) {
  try {
    const doc = await Resource.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!doc) return res.status(404).json({ message: "Resource not found" });
    res.json(doc);
  } catch (err) {
    next(err);
  }
}

async function deleteResource(req, res, next) {
  try {
    const doc = await Resource.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!doc) return res.status(404).json({ message: "Resource not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createResource,
  getAllResources,
  getResourceById,
  updateResource,
  deleteResource
};
