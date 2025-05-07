# Agentic Academic Advisor AI System

This project implements an AI-powered academic advisor Agent that helps students understand their academic progress, generate graduation plans, and explore course prerequisites. The system uses advanced language models and graph-based course and courses analysis to provide personalized academic guidance.

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
## Techniques Used

### 1. LLM Nested RAG Pipleine
- I developed a new RAG Approach called a Nested RAG Pipleine for maximum output accuracy. It is hard for an LLM to retrieve all required information from all the provided datasources at once, so what I did is I created a RAG pipeline for each datasource individually, with it's own invoke.LLM and prompt that returns all the required information from that datasource based on the user question. At the end there is the main RAG pipeline called aggregate_and_generate_response(user_question), that uses all the already retrieved information plus some structured data from the PDFs, and uses the main prompt to give the user the most accurate structured response possible.
- The RAG code is in (/IAAS/LLMAcadamic-Advisor/LLM/main_copy.py)

### 2. Creating Graph datastructures through web-scraping
- I web-scraped the PSU Abington website for all the available courses and added them to a csv file (IAAS/LLMAcadamic-Advisor/LLM/processed_psu_courses.csv). Then used the scrapd data to create a Graph datastructure of all the courses for a faster and more accurate LLM retrieval.(IAAS/LLMAcadamic-Advisor/LLM/graphExperiment.py)
-  I web-scraped the PSU Abington website for all the available Majors and their requirements and added them to a csv file (IAAS/LLMAcadamic-Advisor/LLM/all_abington_majors_combined(5).csv). Then used the scrapd data to create a Graph datastructure of all the courses for a faster and more accurate LLM retrieval. (IAAS/LLMAcadamic-Advisor/LLM/majorsGraph.py)

  
## Features

### 1. Academic Progress Analysis
- Analyzes student transcripts and What-If reports (Academic Requirments Document)
- Identifies completed and in-progress courses
- Calculates remaining requirements
- Provides detailed academic progress summaries
- Provides Detailed Graduation Plan

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

### 5. Advisor Dashboard
- Analyzes specific major requirements
- Outputs a a Graph of all courses required for a major based on Options and minors

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
- Web scraped all courses Available at PSU Abington and added them to a CSV file (IAAS/LLMAcadamic-Advisor/LLM/processed_psu_courses.csv)
- Created a graph datastructure using that csv file (IAAS/LLMAcadamic-Advisor/LLM/graphExperiment.py)
- Represents courses and their prerequisites as a directed graph
- Enables efficient prerequisite chain analysis for the LLM
- Supports visualization of course relationships

### 5. Majors Graph Implementation
- Web scraped all the Majors Available at PSU Abington and added them to a CSV file (IAAS/LLMAcadamic-Advisor/LLM/all_abington_majors_combined(5).csv)
- Created a graph datastructure using that csv file (IAAS/LLMAcadamic-Advisor/LLM/majorsGraph.py)
- Represents Majors and their required courses, and additional courses as a directed graph
- Enables efficient courses requirments chain analysis for the LLM
- Supports visualization of Major to course relationships

### 6. User Log-in/Sign-ip Database
  - Created a MyPHP databse on XAMPP for user Log-in and Sign-up.
  - You need to create the databse, the following is the MYSQL code to create the tables and their attributes:

    
```
-- Create the database

CREATE DATABASE IF NOT EXISTS Advising;
USE Advising;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'faculty', 'admin') NOT NULL,
    sex ENUM('Male', 'Female', 'Other') NOT NULL,
    dateOfBirth DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Add index for better performance on email lookups
CREATE INDEX idx_users_email ON users(email);
```

### 7. REST API
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
   LANGCHAIN_PROJECT = "<Your Langchain API Project Name>"
   export OPENAI_API_KEY="your_openai_api_key"
   export LANGCHAIN_API_KEY="your_langchain_api_key"
   export LANGCHAIN_ENDPOINT="https://api.smith.langchain.com"
   ```

4. Start the API server:
   ```bash
   python IAAS/.vscode/launch.json
   ```

## Usage

1. Log-in:
   ```bash
   As student looking to create a graduation plan or ask the LLM a question:
   Email: jod@psu.edu
   password: 1234

   As an Academic Advisor looking to see a graph of major requirments:
   Email: jwd@psu.edu
   password: 1234

   ```
2. Upload student transcript:
   ```bash
   POST /llm/setup-environment
   Content-Type: multipart/form-data
   ```

3. Generate graduation plan:
   ```bash
   POST /llm/generate-response
   Content-Type: application/json
   {
     "user_question": "Generate my graduation plan"
   }
   ```

4. View course prerequisites, advisor dashboard:
   ```bash
   POST /llm/generate-major-graph
   Content-Type: application/json
   {
     "major_name": "Computer Science"
   }
   ```

## Security Features

- Student information redaction from transcripts, like Student Name and Student ID
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

   
## Contributers

1. Mostafa Amer - Backend, nested RAG Pipeline Agent, Webs scraped csv file, Graph datastructures, and Faculty dahsboard.
2. Hammad and Christian - Front-end
3. AVIK - Flask frontend and backend integration

## License

This project is licensed under the MIT License - see the LICENSE file for details. 

## Contact

For any queries or support, please open contact us at amermostafa.official477@gmail.com
