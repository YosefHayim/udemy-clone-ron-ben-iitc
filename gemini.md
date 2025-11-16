# Using Google Gemini AI with Udemy Clone Project

This guide provides information on how to leverage Google Gemini AI for development, debugging, and enhancement of the Udemy Clone project.

## Table of Contents

1. [Introduction](#introduction)
2. [Setting Up Gemini AI](#setting-up-gemini-ai)
3. [Use Cases](#use-cases)
4. [Code Assistance with Gemini](#code-assistance-with-gemini)
5. [Integration Examples](#integration-examples)
6. [Feature Development](#feature-development)
7. [Best Practices](#best-practices)

## Introduction

Google Gemini is a multimodal AI model developed by Google that can assist with code generation, debugging, content creation, and various development tasks. This document outlines how to effectively use Gemini for the Udemy Clone project.

## Setting Up Gemini AI

### Option 1: Google AI Studio (Web Interface)
1. Visit [aistudio.google.com](https://aistudio.google.com)
2. Sign in with your Google account
3. Get your API key from the API keys section
4. Start creating prompts or using the chat interface

### Option 2: Gemini API Integration

#### Installation
```bash
npm install @google/generative-ai
```

#### Basic Setup
```javascript
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the API with your key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Get the model
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

// Generate content
const result = await model.generateContent('Explain this code...');
console.log(result.response.text());
```

### Option 3: Google Cloud Vertex AI
```bash
# Install Google Cloud SDK
npm install @google-cloud/aiplatform

# Use with Vertex AI
import { PredictionServiceClient } from '@google-cloud/aiplatform';
```

### Environment Variables

Add to your `.env` files:

**Frontend (.env):**
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

**Backend (.env):**
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

## Use Cases

### 1. Code Generation and Completion

```javascript
// Example: Generate a new component
const prompt = `
Create a React TypeScript component for displaying course reviews.
It should:
- Accept an array of reviews as props
- Display reviewer name, rating (1-5 stars), and comment
- Handle empty states
- Be responsive with Tailwind CSS
- Include proper TypeScript types
`;

const result = await model.generateContent(prompt);
```

### 2. Code Review and Refactoring

```javascript
const codeReview = `
Review this Express middleware for security and best practices:
${middlewareCode}

Focus on:
- Input validation
- Error handling
- Security vulnerabilities
- Performance optimization
`;
```

### 3. Documentation Generation

```javascript
const docPrompt = `
Generate comprehensive JSDoc comments for this function:
${functionCode}

Include parameter descriptions, return types, and usage examples.
`;
```

### 4. Test Generation

```javascript
const testPrompt = `
Generate Jest unit tests for this React component:
${componentCode}

Include:
- Rendering tests
- User interaction tests
- Edge case tests
- Accessibility tests
`;
```

## Code Assistance with Gemini

### Debugging Help

**Example Debugging Prompt:**
```javascript
const debugPrompt = `
I'm getting this error in my React application:

Error: ${errorMessage}
Stack trace: ${stackTrace}

Component code:
${componentCode}

What's causing this error and how can I fix it?
`;

const result = await model.generateContent(debugPrompt);
console.log(result.response.text());
```

### Performance Optimization

```javascript
const optimizationPrompt = `
Analyze this MongoDB query for performance issues:
${queryCode}

Database schema:
${schemaCode}

Suggest optimizations including:
- Index recommendations
- Query restructuring
- Caching strategies
`;
```

### TypeScript Type Generation

```javascript
const typePrompt = `
Generate TypeScript interfaces for this API response:
${apiResponse}

Include:
- Proper type definitions
- Optional fields
- Union types where appropriate
- JSDoc comments
`;
```

## Integration Examples

### Example 1: AI-Powered Course Description Generator

```typescript
// server/services/gemini.service.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export class GeminiService {
  private model;

  constructor() {
    this.model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
  }

  async generateCourseDescription(
    title: string,
    topics: string[]
  ): Promise<string> {
    const prompt = `
      Create an engaging course description for an online course titled "${title}".
      The course covers these topics: ${topics.join(', ')}.

      The description should:
      - Be 150-200 words
      - Highlight key learning outcomes
      - Be professional yet engaging
      - Include benefits for learners
    `;

    const result = await this.model.generateContent(prompt);
    return result.response.text();
  }

  async generateQuizQuestions(
    topic: string,
    difficulty: string,
    count: number
  ) {
    const prompt = `
      Generate ${count} multiple-choice quiz questions about ${topic}.
      Difficulty level: ${difficulty}

      Format each question as JSON with:
      - question: string
      - options: string[] (4 options)
      - correctAnswer: number (index of correct option)
      - explanation: string
    `;

    const result = await this.model.generateContent(prompt);
    return JSON.parse(result.response.text());
  }
}
```

### Example 2: Smart Search with Gemini

```typescript
// server/controllers/search.controller.ts
import { GeminiService } from '../services/gemini.service';

export class SearchController {
  private geminiService = new GeminiService();

  async enhancedSearch(req: Request, res: Response) {
    const { query } = req.query;

    // Get semantic understanding of the search query
    const enhancedQuery = await this.geminiService.enhanceSearchQuery(
      query as string
    );

    // Perform search with enhanced query
    const courses = await Course.find({
      $or: [
        { title: { $regex: enhancedQuery, $options: 'i' } },
        { description: { $regex: enhancedQuery, $options: 'i' } },
        { tags: { $in: enhancedQuery.split(' ') } },
      ],
    });

    res.json(courses);
  }
}
```

### Example 3: Content Moderation

```typescript
// server/middleware/contentModeration.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function moderateContent(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { content } = req.body;

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

  const prompt = `
    Analyze this user-generated content for:
    - Inappropriate language
    - Spam
    - Harassment
    - Personal information

    Content: "${content}"

    Respond with JSON: { "safe": boolean, "issues": string[] }
  `;

  const result = await model.generateContent(prompt);
  const analysis = JSON.parse(result.response.text());

  if (!analysis.safe) {
    return res.status(400).json({
      error: 'Content moderation failed',
      issues: analysis.issues,
    });
  }

  next();
}
```

### Example 4: AI-Powered Chatbot for Student Support

```typescript
// client/src/services/chatbot.service.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

export class ChatbotService {
  private model;
  private conversationHistory: Array<{ role: string; parts: string }> = [];

  constructor() {
    const genAI = new GoogleGenerativeAI(
      import.meta.env.VITE_GEMINI_API_KEY
    );
    this.model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
  }

  async sendMessage(userMessage: string, courseContext?: any) {
    const contextPrompt = courseContext
      ? `\nCourse context: ${JSON.stringify(courseContext)}`
      : '';

    const systemPrompt = `
      You are a helpful assistant for an online learning platform.
      Help students with:
      - Course navigation
      - Technical issues
      - Learning tips
      - Platform features
      ${contextPrompt}

      Be concise, friendly, and helpful.
    `;

    this.conversationHistory.push({
      role: 'user',
      parts: userMessage,
    });

    const chat = this.model.startChat({
      history: this.conversationHistory,
      generationConfig: {
        maxOutputTokens: 500,
      },
    });

    const result = await chat.sendMessage(systemPrompt + '\n' + userMessage);
    const response = result.response.text();

    this.conversationHistory.push({
      role: 'model',
      parts: response,
    });

    return response;
  }
}
```

## Feature Development

### AI-Enhanced Features You Can Build

1. **Automatic Course Summaries**
   - Generate concise summaries from video transcripts
   - Create chapter overviews
   - Extract key points

2. **Smart Recommendations**
   - Analyze user learning patterns
   - Suggest relevant courses
   - Personalize learning paths

3. **Content Generation**
   - Generate quiz questions
   - Create practice exercises
   - Draft course outlines

4. **Translation Services**
   - Translate course content
   - Localize UI elements
   - Support multiple languages

5. **Accessibility Features**
   - Generate alt text for images
   - Create video transcripts
   - Simplify complex explanations

### Implementation Example: Course Summary Generator

```typescript
// server/routes/ai.routes.ts
import express from 'express';
import { GeminiService } from '../services/gemini.service';

const router = express.Router();
const geminiService = new GeminiService();

router.post('/generate-summary', async (req, res) => {
  try {
    const { courseId, videoTranscript } = req.body;

    const summary = await geminiService.generateSummary(videoTranscript);

    // Save summary to database
    await Course.findByIdAndUpdate(courseId, {
      $push: { summaries: summary },
    });

    res.json({ summary });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate summary' });
  }
});

export default router;
```

## Best Practices

### 1. API Key Security

```typescript
// NEVER expose API keys in frontend code
// ❌ Bad
const apiKey = 'AIzaSy...'; // Don't hardcode

// ✅ Good - Use environment variables
const apiKey = process.env.GEMINI_API_KEY;

// ✅ Better - Proxy through backend
// Frontend calls your backend API
// Backend makes Gemini API calls
```

### 2. Rate Limiting

```typescript
// Implement rate limiting for API calls
import rateLimit from 'express-rate-limit';

const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: 'Too many AI requests, please try again later',
});

app.use('/api/ai', aiLimiter);
```

### 3. Error Handling

```typescript
async function safeGeminiCall(prompt: string) {
  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    if (error.message.includes('quota')) {
      throw new Error('API quota exceeded');
    } else if (error.message.includes('safety')) {
      throw new Error('Content filtered by safety settings');
    } else {
      throw new Error('AI service temporarily unavailable');
    }
  }
}
```

### 4. Caching Responses

```typescript
// Cache common AI responses
import NodeCache from 'node-cache';

const aiCache = new NodeCache({ stdTTL: 3600 }); // 1 hour TTL

async function getCachedResponse(prompt: string) {
  const cached = aiCache.get(prompt);
  if (cached) return cached;

  const response = await model.generateContent(prompt);
  const text = response.response.text();

  aiCache.set(prompt, text);
  return text;
}
```

### 5. Prompt Engineering

```typescript
// Structure prompts for better results
const goodPrompt = `
Context: You are helping with an online learning platform.

Task: Generate a course description

Requirements:
- Length: 150-200 words
- Tone: Professional but engaging
- Include: Learning outcomes, target audience, prerequisites

Input:
Title: ${courseTitle}
Topics: ${topics.join(', ')}

Output format: Plain text paragraph
`;
```

## Monitoring and Analytics

### Track AI Usage

```typescript
// server/middleware/aiMetrics.ts
export async function trackAIUsage(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const startTime = Date.now();

  res.on('finish', async () => {
    const duration = Date.now() - startTime;

    await AIMetrics.create({
      endpoint: req.path,
      duration,
      userId: req.user?.id,
      tokens: res.locals.tokensUsed,
      timestamp: new Date(),
    });
  });

  next();
}
```

## Cost Optimization

### 1. Use Appropriate Models

```typescript
// Use lighter models for simple tasks
const lightModel = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash', // Faster and cheaper
});

// Use powerful models for complex tasks
const proModel = genAI.getGenerativeModel({
  model: 'gemini-1.5-pro', // More capable
});
```

### 2. Optimize Token Usage

```typescript
// Be concise in prompts
const efficientPrompt = `Summarize in 50 words: ${longText}`;

// Set max output tokens
const result = await model.generateContent(efficientPrompt, {
  generationConfig: {
    maxOutputTokens: 100,
  },
});
```

## Resources

- [Google AI Studio](https://aistudio.google.com)
- [Gemini API Documentation](https://ai.google.dev/docs)
- [Gemini API Pricing](https://ai.google.dev/pricing)
- [Vertex AI Documentation](https://cloud.google.com/vertex-ai/docs)
- [Node.js SDK Reference](https://github.com/google/generative-ai-js)

## Example Use Cases in Udemy Clone

### 1. Smart Course Search
```typescript
// Enhance search with semantic understanding
const searchResults = await enhancedSearch(userQuery);
```

### 2. Automated Quiz Generation
```typescript
// Generate quizzes from course content
const quiz = await generateQuiz(courseContent, difficulty);
```

### 3. Personalized Learning Paths
```typescript
// Recommend next courses based on progress
const recommendations = await getPersonalizedPath(userId);
```

### 4. Content Moderation
```typescript
// Moderate user reviews and comments
const isSafe = await moderateContent(userComment);
```

### 5. Multilingual Support
```typescript
// Translate course content
const translated = await translateCourse(courseId, targetLang);
```

## Troubleshooting

### Common Issues

1. **API Key Not Working**
   - Verify key in Google AI Studio
   - Check environment variable is loaded
   - Ensure API is enabled in Google Cloud Console

2. **Rate Limiting**
   - Implement request throttling
   - Use caching
   - Consider upgrading quota

3. **Safety Filters**
   - Review content guidelines
   - Adjust safety settings if appropriate
   - Implement pre-filtering

## Support

For questions about Gemini integration:
- Review [Google AI documentation](https://ai.google.dev/docs)
- Check the project's GitHub issues
- Contact the development team

---

**Note**: Always handle AI-generated content responsibly and validate outputs before displaying to users.
