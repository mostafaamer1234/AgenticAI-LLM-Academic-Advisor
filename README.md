# Academic Advisor AI System

This project implements an AI-powered academic advisor system that helps students understand their academic progress, generate graduation plans, and explore course prerequisites. The system uses advanced language models and graph-based course analysis to provide personalized academic guidance.

## Project Structure

```
IAAS/
├── LLMAcadamic-Advisor/
│   ├── LLM/                    # Core LLM implementation
│   │   ├── main_copy.py        # Main LLM processing logic
│   │   ├── majorsGraph.py      # Course graph implementation
│   │   └── all_abington_majors_combined(5).csv  # Course data
│   └── api/
│       └── api.py              # REST API implementation
└── chroma_courses/             # Vector store for course embeddings
```

## Features

### 1. Academic Progress Analysis
- Analyzes student transcripts and What-If reports
- Identifies completed and in-progress courses
- Calculates remaining requirements
- Provides detailed academic progress summaries

### 2. Graduation Planning
- Generates personalized semester-by-semester graduation plans
- Considers course prerequisites and availability
- Ensures balanced course loads (max 15 credits per semester)
- Accounts for completed and in-progress courses

### 3. Course Prerequisites Analysis
- Visualizes course prerequisite relationships
- Provides detailed prerequisite information for any course
- Helps students plan their course sequence effectively

### 4. Major Requirements Analysis
- Analyzes specific major requirements
- Tracks progress towards degree completion
- Identifies missing requirements and courses

## Backend Architecture

### 1. Language Model Integration
- Uses OpenAI's GPT-4 model for natural language processing
- Implements LangChain for document processing and retrieval
- Employs vector embeddings for semantic search

### 2. Document Processing
- PDF processing for student transcripts
- Text extraction and analysis
- Information redaction for privacy

### 3. Vector Store
- Uses ChromaDB for efficient document storage and retrieval
- Implements semantic search for course matching
- Maintains course metadata and descriptions

### 4. Course Graph Implementation
- Represents courses and their prerequisites as a directed graph
- Enables efficient prerequisite chain analysis
- Supports visualization of course relationships

### 5. REST API
- Flask-based RESTful API implementation
- CORS-enabled for cross-origin requests
- Key endpoints:
  - `/llm/generate-response`: Generates graduation plans and answers academic questions
  - `/llm/setup-environment`: Processes student transcripts
  - `/llm/generate-major-graph`: Creates visual course prerequisite graphs

## Setup and Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up environment variables:
   ```bash
   export OPENAI_API_KEY="your_openai_api_key"
   export LANGCHAIN_API_KEY="your_langchain_api_key"
   export LANGCHAIN_ENDPOINT="https://api.smith.langchain.com"
   ```

4. Start the API server:
   ```bash
   python IAAS/LLMAcadamic-Advisor/api/api.py
   ```

## Usage

1. Upload student transcript:
   ```bash
   POST /llm/setup-environment
   Content-Type: multipart/form-data
   ```

2. Generate graduation plan:
   ```bash
   POST /llm/generate-response
   Content-Type: application/json
   {
     "user_question": "Generate my graduation plan"
   }
   ```

3. View course prerequisites:
   ```bash
   POST /llm/generate-major-graph
   Content-Type: application/json
   {
     "major_name": "Computer Science"
   }
   ```

## Security Features

- Student information redaction from transcripts
- Secure API key management
- Input validation and error handling
- CORS protection

## Dependencies

- Flask
- LangChain
- OpenAI
- ChromaDB
- Pandas
- NetworkX (for graph visualization)
- PyPDF2 (for PDF processing)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 