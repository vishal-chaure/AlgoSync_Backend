const Note = require('../models/Note');

// @desc    Get all notes for a user
// @route   GET /api/notes
// @access  Private
const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user._id })
      .sort({ isPinned: -1, updatedAt: -1 }); // Pinned notes first, then by updatedAt

    res.json(notes);
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single note
// @route   GET /api/notes/:id
// @access  Private
const getNote = async (req, res) => {
  try {
    const note = await Note.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json(note);
  } catch (error) {
    console.error('Get note error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create new note
// @route   POST /api/notes
// @access  Private
const createNote = async (req, res) => {
  try {
    const { title, content, tags, color } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const note = await Note.create({
      user: req.user._id,
      title,
      content: content || '',
      tags: tags || [],
      color: color || '#3B82F6'
    });

    res.status(201).json(note);
  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update note
// @route   PUT /api/notes/:id
// @access  Private
const updateNote = async (req, res) => {
  try {
    const { title, content, tags, color, isPinned } = req.body;

    const note = await Note.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    note.title = title || note.title;
    note.content = content !== undefined ? content : note.content;
    note.tags = tags || note.tags;
    note.color = color || note.color;
    note.isPinned = isPinned !== undefined ? isPinned : note.isPinned;

    const updatedNote = await note.save();
    res.json(updatedNote);
  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete note
// @route   DELETE /api/notes/:id
// @access  Private
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    await note.deleteOne();
    res.json({ message: 'Note removed' });
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Toggle pin status
// @route   PATCH /api/notes/:id/toggle-pin
// @access  Private
const togglePin = async (req, res) => {
  try {
    const note = await Note.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    note.isPinned = !note.isPinned;
    const updatedNote = await note.save();
    res.json(updatedNote);
  } catch (error) {
    console.error('Toggle pin error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Search notes
// @route   GET /api/notes/search?q=query
// @access  Private
const searchNotes = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const notes = await Note.find({
      user: req.user._id,
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { content: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ]
    }).sort({ updatedAt: -1 });

    res.json(notes);
  } catch (error) {
    console.error('Search notes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
  togglePin,
  searchNotes
}; 