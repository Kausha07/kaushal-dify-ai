const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// In-memory prompt template store with versioning
const promptStore = [
  {
    id: "prompt_001",
    name: "E-Commerce Product Description Generator",
    template: "Generate a compelling {{tone}} product description for {{product_name}} with key features: {{features}}.",
    version: 3,
    created_at: new Date().toISOString()
  }
];

// List Prompt Templates
app.get('/api/v1/prompts', (req, res) => {
  res.json({ prompts: promptStore });
});

// Real-time Tokens Streaming Endpoint (Server-Sent Events)
app.post('/api/v1/prompts/stream', (req, res) => {
  const { template, variables = {} } = req.body;

  // Substitute variables in template
  let interpolatedPrompt = template || promptStore[0].template;
  Object.keys(variables).forEach(key => {
    interpolatedPrompt = interpolatedPrompt.replace(new RegExp(`{{${key}}}`, 'g'), variables[key]);
  });

  // Set headers for Server-Sent Events (SSE)
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  console.log(`[AI-PromptCraft] Streaming SSE tokens for prompt: "${interpolatedPrompt.substring(0, 40)}..."`);

  const sampleTokens = [
    "Introducing ", "the ", "all-new ", "next-generation ", "product ",
    "crafted ", "for ", "peak ", "performance ", "and ", "modern ", "design."
  ];

  let index = 0;
  const interval = setInterval(() => {
    if (index < sampleTokens.length) {
      res.write(`data: ${JSON.stringify({ token: sampleTokens[index], index })}\n\n`);
      index++;
    } else {
      res.write(`data: [DONE]\n\n`);
      clearInterval(interval);
      res.end();
    }
  }, 100); // Send token every 100ms
});

app.listen(PORT, () => {
  console.log(`🚀 [AI-PromptCraft] Prompt Management Server running on http://localhost:${PORT}`);
});
