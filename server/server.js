// server.js
import express, { json } from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import multer from 'multer';
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { ChatOpenAI } from "@langchain/openai";
import { JsonOutputFunctionsParser } from "langchain/output_parsers";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { guard, promptTemplates } from "./utils/index.js";
import { candidateResumeSchema } from "./schemas/index.js";
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' });

app.post('/api/ai', async (req, res) => {
  if (!openai.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured",
      }
    });
    return;
  }

  let { system } = req.query;
  const { prompt } = req.body;

system = "You are an AI writing assistant that continues existing text based on context from prior text. " +
"Give more weight/priority to the later characters than the beginning ones. " +
"Limit your response to no more than 800 characters, but make sure to construct complete sentences. " +
"Use Markdown formatting when appropriate." + system;

  if (!prompt || prompt.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please provide a valid prompt",
      }
    });
    return;
  }

  try {
    const stream = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [{ role: 'system', content: system },
      { role: 'user', content: prompt }
      ],
      stream: true,
    });

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    });

    // res.write(`data: ${JSON.stringify({ type: 'start', text: 'Insert content' })}\n\n`);

    let fullText = '';

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        fullText += content;
        // res.write(`data: ${JSON.stringify({ type: 'content', text: content })}\n\n`);
        res.write(content);
      }
    }

    // res.write(`data: ${JSON.stringify({ type: 'end', text: fullText })}\n\n`);
    // res.write(fullText);
    // res.write('data: [DONE]\n\n');
    res.end();

  } catch(error) {
    console.error(`Error with OpenAI API request: ${error.message}`);
    res.status(500).json({
      error: {
        message: 'An error occurred during your request.',
      }
    });
  }
});

app.post('/api/resume-to-json', upload.single('pdf'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No PDF file uploaded' });
  }

  try {
    const loader = new PDFLoader(req.file.path);
    const docs = await loader.load();
    const fullText = docs.reduce((acc, doc) => acc + doc.pageContent + "\n", "");

    const schema = candidateResumeSchema;
    const defaultPayload = schema?.parameters?.default || {};
    if (Object.keys(defaultPayload).length) {
      delete schema.parameters.default;
    }

    const modelName = "gpt-3.5-turbo-0125";
    const model = new ChatOpenAI({ modelName, maxTokens: 4096, temperature: 0 });
    const parser = new JsonOutputFunctionsParser();
    const runnable = model
      .bind({
        functions: [schema],
        function_call: { name: schema.name },
      })
      .pipe((a) => {
        return a;
      })
      .pipe(parser);

    const result = await guard({
      runnable,
      systemPrompt: new SystemMessage(promptTemplates.resumeParserSystemPrompt()),
      userPrompt: new HumanMessage(fullText),
      fullText: fullText,
      defaultPayload,
      schema: schema.parameters,
      maxRetries: 3,
    });

    res.json(result);
  } catch (error) {
    console.error('Error processing resume:', error);
    res.status(500).json({ error: 'An error occurred while processing the resume' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});