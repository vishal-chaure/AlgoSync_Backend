const axios = require('axios');

exports.chatWithGemini = async (req, res) => {
  const { messages, question, language } = req.body;
  try {
    let prompt = `You are an expert coding assistant. The user is asking about the following question:\nTitle: ${question.title}\nDescription: ${question.description}\n`;
    if (language) prompt += `Please answer/generate code in ${language}.\n`;
    prompt += messages.map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n');
    const geminiRes = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }]
      }
    );
    const aiReply = geminiRes.data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response.';
    res.json({ reply: aiReply });
  } catch (err) {
    res.status(500).json({ error: 'AI error', details: err.message });
  }
};

exports.parseQuestionContent = async (req, res) => {
  const { content } = req.body;
  try {
    const prompt = `You are a coding question parser. Extract information from this question content and return ONLY a valid JSON object with no additional text, markdown, or formatting.

Return this exact JSON structure:
{
  "title": "Question title",
  "description": "Question description", 
  "difficulty": "Easy/Medium/Hard",
  "examples": ["example1", "example2"],
  "constraints": ["constraint1", "constraint2"],
  "suggestedTags": ["tag1", "tag2"],
  "questionNumber": "number if found",
  "youtubeLink": "YouTube link if found in content"
}

Rules:
- Extract only the actual question content, ignore UI elements, metadata, or platform-specific text
- For difficulty, look for words like "Easy", "Medium", "Hard" in the content
- For examples, extract actual input/output examples
- For constraints, extract actual problem constraints  
- For tags, suggest relevant algorithm/data structure tags
- For question number, extract if present in format like "1.", "Problem 1:", etc.
- For YouTube links: Only include if found in the original content

Content to parse:
${content}`;

    const geminiRes = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }]
      }
    );

    const aiReply = geminiRes.data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Try to parse the JSON response
    try {
      // Clean the response - remove any markdown formatting
      let cleanResponse = aiReply.trim();
      if (cleanResponse.startsWith('```json')) {
        cleanResponse = cleanResponse.replace(/```json\n?/, '').replace(/```\n?/, '');
      } else if (cleanResponse.startsWith('```')) {
        cleanResponse = cleanResponse.replace(/```\n?/, '').replace(/```\n?/, '');
      }

      const parsedData = JSON.parse(cleanResponse);
      res.json(parsedData);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Cleaned response:', cleanResponse);
      // If JSON parsing fails, return a structured error
      res.status(400).json({
        error: 'Failed to parse AI response',
        rawResponse: aiReply,
        parseError: parseError.message
      });
    }
  } catch (err) {
    console.error('Question parsing error:', err.response?.data || err.message);
    res.status(500).json({ error: 'AI parsing error', details: err.message });
  }
}; 