const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { Configuration, OpenAIApi } = require('openai');
const { YoutubeTranscript } = require('youtube-transcript');
const { execSync } = require('child_process');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: 'uploads/' });
const openai = new OpenAIApi(new Configuration({ apiKey: process.env.OPENAI_API_KEY }));

// Helper: Get transcript from YouTube
async function getYouTubeTranscript(url) {
  const videoId = url.split('v=')[1]?.split('&')[0];
  if (!videoId) throw new Error('Invalid YouTube URL');
  const transcriptArr = await YoutubeTranscript.fetchTranscript(videoId);
  return transcriptArr.map(t => t.text).join(' ');
}

// Helper: Get transcript from local video using Whisper (Python)
async function getLocalTranscript(filePath) {
  try {
    const scriptPath = path.join(__dirname, 'whisper_transcribe.py');
    const transcript = execSync(`python "${scriptPath}" "${filePath}"`, { encoding: 'utf-8' });
    return transcript;
  } catch (e) {
    throw new Error('Failed to transcribe local video');
  }
}

// Summarize with OpenAI
async function summarizeTranscript(transcript) {
  const completion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'user', content: `Summarize this transcript in three levels: short, medium, and research. Respond as JSON with keys: short, medium, research.\n\nTranscript:\n${transcript}` }
    ],
    temperature: 0.5,
  });
  // Try to parse JSON from the response
  try {
    return JSON.parse(completion.data.choices[0].message.content);
  } catch {
    // fallback: return the whole text as 'short'
    return { short: completion.data.choices[0].message.content, medium: '', research: '' };
  }
}

// API: Summarize YouTube video
app.post('/api/summarize/youtube', async (req, res) => {
  try {
    const { videoUrl } = req.body;
    const transcript = await getYouTubeTranscript(videoUrl);
    const summaries = await summarizeTranscript(transcript);
    res.json({ title: 'YouTube Video', transcript, summaries });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// API: Summarize local video
app.post('/api/summarize/local', upload.single('video'), async (req, res) => {
  try {
    const transcript = await getLocalTranscript(req.file.path);
    const summaries = await summarizeTranscript(transcript);
    console.log('Summary:', summaries);
    res.json({ summaries, transcript });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(5000, () => console.log('Server running on port 5000'));