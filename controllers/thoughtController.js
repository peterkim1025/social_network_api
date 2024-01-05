const { Thought, User } = require('../models');

const thoughtController = {
  getAllThoughts: async (req, res) => {
    try {
      const thoughts = await Thought.find();
      console.log(thoughts);
      res.json(thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  getThoughtById: async (req, res) => {
    const { thoughtId } = req.params;
    try {
      const thought = await Thought.findById(thoughtId);
      if (!thought) {
        return res.status(404).json({ message: 'Thought not found' });
      }
      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  createThought: async (req, res) => {
    const { thoughtText, username, userId } = req.body;
    try {
      const newThought = await Thought.create({ thoughtText, username });
      // Update user's thoughts array
      await User.findByIdAndUpdate(userId, { $push: { thoughts: newThought._id } });
      res.json(newThought);
    } catch (err) {
      res.status(400).json(err);
    }
  },

  updateThought: async (req, res) => {
    const { thoughtId } = req.params;
    const { thoughtText } = req.body;
    try {
      const updatedThought = await Thought.findByIdAndUpdate(
        thoughtId,
        { thoughtText },
        { new: true }
      );
      if (!updatedThought) {
        return res.status(404).json({ message: 'Thought not found' });
      }
      res.json(updatedThought);
    } catch (err) {
      res.status(400).json(err);
    }
  },

  deleteThought: async (req, res) => {
    const { thoughtId } = req.params;
    try {
      const deletedThought = await Thought.findByIdAndDelete(thoughtId);
      if (!deletedThought) {
        return res.status(404).json({ message: 'Thought not found' });
      }
      // Remove thought from associated user's thoughts array
      await User.updateMany({}, { $pull: { thoughts: thoughtId } });
      res.json(deletedThought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};

module.exports = thoughtController;
