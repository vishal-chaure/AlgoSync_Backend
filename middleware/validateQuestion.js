const validateQuestion = (req, res, next) => {
  const { title, description, platformTag, platformLink, topic } = req.body;

  // Check required fields
  if (!title || !description || !platformTag || !platformLink || !topic) {
    return res.status(400).json({
      message: 'Missing required fields: title, description, platformTag, platformLink, topic'
    });
  }

  // Validate platform tag
  const validPlatforms = ['LeetCode', 'GFG', 'Codeforces', 'Other'];
  if (!validPlatforms.includes(platformTag)) {
    return res.status(400).json({
      message: 'Invalid platform tag. Must be one of: LeetCode, GFG, Codeforces, Other'
    });
  }

  // Validate difficulty if provided
  if (req.body.difficulty) {
    const validDifficulties = ['Easy', 'Medium', 'Hard'];
    if (!validDifficulties.includes(req.body.difficulty)) {
      return res.status(400).json({
        message: 'Invalid difficulty. Must be one of: Easy, Medium, Hard'
      });
    }
  }

  // Validate topic tags if provided
  if (req.body.topicTags && !Array.isArray(req.body.topicTags)) {
    return res.status(400).json({
      message: 'topicTags must be an array'
    });
  }

  // Validate examples if provided
  if (req.body.examples && !Array.isArray(req.body.examples)) {
    return res.status(400).json({
      message: 'examples must be an array'
    });
  }

  // Validate constraints if provided
  if (req.body.constraints && !Array.isArray(req.body.constraints)) {
    return res.status(400).json({
      message: 'constraints must be an array'
    });
  }

  next();
};

module.exports = { validateQuestion }; 