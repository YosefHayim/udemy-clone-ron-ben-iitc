# Using Claude AI with Udemy Clone Project

This guide provides information on how to leverage Claude AI (Anthropic) for development, debugging, and enhancement of the Udemy Clone project.

## Table of Contents

1. [Introduction](#introduction)
2. [Setting Up Claude AI](#setting-up-claude-ai)
3. [Use Cases](#use-cases)
4. [Code Review with Claude](#code-review-with-claude)
5. [Debugging Assistance](#debugging-assistance)
6. [Feature Development](#feature-development)
7. [Documentation Generation](#documentation-generation)
8. [Best Practices](#best-practices)

## Introduction

Claude AI is an advanced language model developed by Anthropic that can assist with various aspects of software development. This document outlines how to effectively use Claude for the Udemy Clone project.

## Setting Up Claude AI

### Option 1: Claude Web Interface
1. Visit [claude.ai](https://claude.ai)
2. Create an account or sign in
3. Start a new conversation
4. Upload relevant code files or paste code snippets

### Option 2: Claude API Integration
```javascript
// Example: Installing the Anthropic SDK
npm install @anthropic-ai/sdk

// Basic usage
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.VITE_AI_TOKEN, // Your API key from .env
});

const message = await anthropic.messages.create({
  model: "claude-3-5-sonnet-20241022",
  max_tokens: 1024,
  messages: [
    { role: "user", content: "Explain this code..." }
  ],
});
```

### Option 3: Claude Code (CLI)
```bash
# Install Claude Code CLI
npm install -g @anthropic-ai/claude-code

# Initialize in your project
claude-code init

# Start Claude Code session
claude-code
```

## Use Cases

### 1. Code Review and Refactoring

Ask Claude to review your components:

```
"Review this React component for best practices, performance issues, and potential bugs:
[paste component code]"
```

### 2. TypeScript Type Safety

Get help with TypeScript types:

```
"Create TypeScript interfaces for the following API response structure:
[paste API response]"
```

### 3. Redux State Management

Optimize your Redux implementation:

```
"Review this Redux slice and suggest improvements for better state management:
[paste Redux slice code]"
```

### 4. API Endpoint Development

Design robust API endpoints:

```
"Help me create a secure Express endpoint for user authentication that:
- Validates input
- Handles errors properly
- Returns appropriate status codes
- Follows REST best practices"
```

### 5. Database Query Optimization

Improve MongoDB queries:

```
"Optimize this Mongoose query for better performance:
[paste query code]"
```

## Code Review with Claude

### What to Ask Claude to Review

1. **Security Vulnerabilities**
   - Input validation
   - Authentication/authorization
   - SQL injection prevention
   - XSS protection
   - CSRF protection

2. **Performance Issues**
   - Unnecessary re-renders in React
   - Inefficient database queries
   - Memory leaks
   - Bundle size optimization

3. **Code Quality**
   - Code duplication
   - Complex functions that need refactoring
   - Naming conventions
   - File organization

### Example Review Request

```
I'd like you to review this authentication middleware. Please check for:
1. Security vulnerabilities
2. Error handling completeness
3. Code clarity and maintainability
4. TypeScript type safety
5. Best practices adherence

[paste middleware code]
```

## Debugging Assistance

### Error Resolution

When encountering errors, provide Claude with:
- The error message
- Stack trace
- Relevant code context
- What you've already tried

**Example:**
```
I'm getting this error when trying to upload course images:
[error message and stack trace]

Here's my multer configuration:
[paste config]

Here's the upload endpoint:
[paste endpoint]

What could be causing this and how can I fix it?
```

### Performance Issues

```
My course listing page is loading slowly. Here's the component:
[paste component]

Here's the API endpoint:
[paste endpoint]

How can I improve the performance?
```

## Feature Development

### Planning New Features

```
I want to add a feature that allows instructors to schedule course releases.
Can you help me:
1. Design the database schema
2. Plan the API endpoints
3. Outline the frontend components
4. Identify potential challenges
```

### Implementation Guidance

```
I'm implementing the course scheduling feature. Can you help me:
1. Write the Mongoose schema for scheduled courses
2. Create the API controller logic
3. Build the React component for the scheduler UI
4. Handle timezone conversions properly
```

## Documentation Generation

### API Documentation

```
Generate API documentation for these endpoints:
[paste endpoint definitions]

Include:
- Endpoint URL and method
- Request parameters
- Request body schema
- Response format
- Error codes
- Example requests/responses
```

### Component Documentation

```
Generate JSDoc comments for this React component:
[paste component]

Include prop types, usage examples, and any important notes.
```

### README Updates

```
Create a comprehensive README section for the course management feature,
including setup instructions, usage examples, and troubleshooting tips.
```

## Best Practices

### 1. Provide Context

Always give Claude context about:
- The technology stack (React, Express, MongoDB, etc.)
- The specific part of the application
- What you're trying to achieve
- Any constraints or requirements

### 2. Be Specific

Instead of:
```
"Fix my code"
```

Try:
```
"This React component is causing unnecessary re-renders. Can you identify why
and suggest optimizations? Here's the component code: [code]"
```

### 3. Iterative Refinement

Start with a general question and refine based on Claude's responses:
1. Ask for high-level approach
2. Request specific implementation details
3. Ask for edge case handling
4. Request tests or validation

### 4. Verify Suggestions

Always:
- Test Claude's suggestions in your development environment
- Review security implications
- Ensure compatibility with your existing codebase
- Validate against your project's coding standards

### 5. Code Quality Prompts

Use structured prompts for consistency:

```
Please review this code for:
✓ Security vulnerabilities
✓ Performance optimization opportunities
✓ TypeScript type safety
✓ Error handling
✓ Code clarity and maintainability
✓ Adherence to React/Express best practices

[paste code]
```

## Project-Specific Prompts

### Frontend Development

```
"I'm working on the course player component in the Udemy Clone project.
It uses Video.js for video playback and needs to track progress.
Can you help me implement resume functionality that saves the user's
progress to the backend every 5 seconds?"
```

### Backend Development

```
"I need to implement rate limiting for the course search endpoint in our
Express backend. The endpoint should allow 100 requests per 15 minutes
per IP address. Can you show me how to implement this with
express-rate-limit?"
```

### Full-Stack Features

```
"I want to add a course review and rating system. Can you help me plan:
1. MongoDB schema for reviews
2. Express API endpoints
3. React components for displaying and submitting reviews
4. Redux state management for reviews
5. Validation and security considerations"
```

## Integration with Development Workflow

### Pre-Commit Review

Before committing code:
```
"Review these changes I'm about to commit:
[git diff output or changed files]

Check for potential issues or improvements."
```

### PR Description Generation

```
"Generate a pull request description for these changes:
[summary of changes]

Include:
- What changed
- Why it changed
- Testing performed
- Any breaking changes"
```

## Limitations and Considerations

1. **Not a Replacement for Testing**: Always test Claude's suggestions
2. **Security**: Don't share sensitive data (API keys, passwords, etc.)
3. **Verification**: Claude can make mistakes - review all code
4. **Context Limits**: Break large codebases into smaller, focused queries
5. **Version Awareness**: Specify package versions when relevant

## Resources

- [Claude Documentation](https://docs.anthropic.com)
- [Claude API Reference](https://docs.anthropic.com/api-reference)
- [Anthropic Console](https://console.anthropic.com)
- [Claude Code Documentation](https://docs.claude.com/en/docs/claude-code)

## Support

For project-specific questions about using Claude:
- Open an issue in the GitHub repository
- Contact the development team
- Refer to the main README.md for project documentation

---

**Note**: This guide assumes familiarity with the Udemy Clone project architecture.
Refer to README.md and RELEASES.md for project-specific information.

## Task Master AI Instructions
**Import Task Master's development workflow commands and guidelines, treat as if import is in the main CLAUDE.md file.**
@./.taskmaster/CLAUDE.md
