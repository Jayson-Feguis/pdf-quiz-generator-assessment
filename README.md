# PDF Quiz Generator

A web application that allows users to upload a PDF file and generate a multiple-choice quiz from its content using the power of AI.

---

## Features

- **AI-Generated Quizzes**
  - Extracts content from PDF using `pdf-parse-new`, then generates smart quiz questions via the OpenAI API.
- **Chunk-Based PDF Support**
  - Handles large PDF files by processing them in chunks to ensure smooth performance.
- **Quiz History**
  - Saves quiz attempts in `localStorage` using Zustand.
  - Users can view past quizzes, **retake**, or **delete** them.
- **Interactive Quiz Flow**
  - Users choose answers for each question.
  - Upon completion, results are displayed with correct vs incorrect answers and a final score.
- **Scalable Architecture**
- Follows **feature-based folder structure** for better maintainability and scalability.

---

## Tech Stack

- [Next.js](https://nextjs.org/) – App framework for server-side rendering and routing
- [Tailwind CSS](https://tailwindcss.com/) – Utility-first CSS framework
- [Shadcn/UI](https://ui.shadcn.com/) – Accessible and beautiful UI components
- [Zustand](https://github.com/pmndrs/zustand) – Lightweight global state management
- [PDF Parse New](https://www.npmjs.com/package/pdf-parse-new) – For extracting text from PDF files
- [OpenAI API](https://platform.openai.com/docs) – For generating quiz questions using AI
- [Sonner](https://sonner.emilkowal.ski/) – Toast notification system

---

## Installation

```bash
git  clone  https://github.com/your-username/pdf-quiz-generator.git

cd  pdf-quiz-generator

npm  install
```

➤ Set up environment variables

Create a .env.local file and add:

.env

```bash
OPENAI_API_KEY=your-open-api-key

OPENAI_MODEL=your-openai-model

MAX_QUIZ_HISTORY_COUNT=your-max-quiz-history-count

QUESTIONS_COUNT=your-questions-count

MAX_FILE_SIZE=your-max-file-size

MAX_API_CALL_TIMEOUT=your-max-api-call-timeout
```

- Important: Make sure not to commit this file.

---

## Running the App

```bash
npm  run  dev
```

Then open your browser at http://localhost:3000.

## Folder Structure (Feature-Based)

```bash
src/
├──  app/
├──  components/
├──  features/
│  ├──  upload-pdf/
│  ├──  quiz/
│  ├──  quiz-history/
├──  hooks/
├──  lib/
│  ├──  schema/
│  ├──  utils/
│  ├──  zustand/
│  ├──  constants/
└──  types/
```

## Additional Libraries or Tools

- pdf-parse-new – Text extraction from PDF files
- openai – For generating quiz questions
- zustand – For state management
- sonner – For toast notifications
- shadcn/ui – UI component library
- tailwindcss – Styling framework

---

## Brief Explanation of Approach and Design Decisions

- Used a feature-based folder structure to keep logic modular and scalable
- State is kept minimal and persisted in localStorage via Zustand
- Large PDFs are processed in chunks to avoid performance issues and API limits
- Quiz generation is asynchronous and error-resilient
- All components use functional React and modern hooks

---

## Known Limitations or Areas for Improvement

- No user authentication or cloud-based history storage
- Minimal error handling for scanned/invalid PDFs
- No handling for OpenAI rate limits or token overflow
- No quiz export or print feature
