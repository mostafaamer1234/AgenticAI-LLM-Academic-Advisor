import os
import json
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain.schema import SystemMessage, HumanMessage
import pandas as pd
from werkzeug.utils import secure_filename  # Import for handling file names


def setup_environment(whatIfUpload):
    global pdf_retriever, courses_retriever, llm1, llm2

    #  Environment Variables
    LANGCHAIN_PROJECT = "<You Langchain API Project Name>"
    os.environ['LANGCHAIN_TRACING_V2'] = 'true'
    os.environ['LANGCHAIN_ENDPOINT'] = 'https://api.smith.langchain.com'

    # HAVE TO MODIFY THESE 2
    os.environ['LANGCHAIN_API_KEY'] = "<You Langchain API Key>"
    os.environ['OPENAI_API_KEY'] = "<You OpenAI API Key>"

    #  Handle Uploaded Transcript
    transcript_file = whatIfUpload.files['transcript']
    filename = secure_filename(transcript_file.filename)
    temp_pdf_path = f"/tmp/{filename}"  # Save to a temporary directory
    transcript_file.save(temp_pdf_path)

    #  LLM Instances
    llm1 = ChatOpenAI(model_name="gpt-4o", temperature=0)
    llm2 = ChatOpenAI(model_name="gpt-4o", temperature=0)

    #  PDF (WhatIfReport) Processing
    loader = PyPDFLoader(temp_pdf_path)
    pdf_docs = loader.load()
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=500, chunk_overlap=100)
    pdf_splits = text_splitter.split_documents(pdf_docs)
    vectorstore_pdf = Chroma.from_documents(
        pdf_splits, embedding=OpenAIEmbeddings())
    pdf_retriever = vectorstore_pdf.as_retriever(search_kwargs={"k": 3})

    #  Process CSV & Save to Vectorstore
    courses_csv_path = "/Users/mostafa/newFianlLLMRepo/IAAS/LLMAcadamic-Advisor/LLM/processed_psu_courses.csv"
    df = pd.read_csv(courses_csv_path)
    courses_texts = []
    courses_metadata = []

    for _, row in df.iterrows():
        text_data = f"Major: {row['major_title']}, Code: {row['major_code']}. "
        text_data += f"Prescribed Courses: {json.dumps(row['prescribed_courses'])}. "
        text_data += f"Additional Courses: {json.dumps(row['additional_courses'])}. "
        text_data += f"Selectable Courses: {json.dumps(row['selectable_courses'])}. "

        courses_texts.append(text_data)
        courses_metadata.append(
            {"major_code": row['major_code'], "major_title": row['major_title']})

    vectorstore_courses = Chroma.from_texts(
        courses_texts, embedding=OpenAIEmbeddings(), metadatas=courses_metadata)
    courses_retriever = vectorstore_courses.as_retriever(
        search_kwargs={"k": 3})

#  Processing Functions


def process_whatif_report(user_question):
    relevant_docs = pdf_retriever.invoke(user_question)
    if not relevant_docs:
        return "No relevant academic records found."
    context_summary = "\n\n".join(
        [doc.page_content[:500] for doc in relevant_docs])[:500]
    pdf_prompt = [
        SystemMessage(
            content="Give a detailed summary of all the information from the student's academic record, including all units/courses taken and satisfied, and all units/courses still needed and what type of units they are based on what classes can satisfy them, all unit requirments, how many semsters they have left, what the student's major/minor is, and everything else."),
        HumanMessage(
            content=f"Question: {user_question}\nContext:\n{context_summary}")
    ]
    summary = llm2.invoke(pdf_prompt)
    return summary.content.strip()


def process_psu_courses(user_question):
    relevant_courses = courses_retriever.invoke(user_question)
    if not relevant_courses:
        return "No relevant courses found."
    context_summary = "\n".join([doc.page_content[:500]
                                for doc in relevant_courses])[:500]
    return context_summary


def aggregate_and_generate_response(user_question):
    print("\n🔹 Retrieving Student Record...")
    student_record = process_whatif_report(user_question)
    print("\n🔹 Retrieving Major Requirements...")
    major_requirement = process_psu_courses(user_question)

    instruction_prompt = SystemMessage(
        content=f" if a user/student asks about a specifc general academic requirements or unit credit or includes academic category codes like: GH, CMPAB_BS, GS, etc, answe the question from {student_record}"
                f"If the user/student asks about a graduation plan or classes/courses they need to graduate or a semster plan: You are an academic advisor generating a detailed semester-wise graduation plan based on the student's history record and recommended available courses with their (course name in number) from the bulletin. get the user's specific major requirments from {major_requirement}, then create a list of all the classes' numbers/names the student needs and subtract the classes they already took (retrieve from {student_record}). Then output a comprehensive plan of specific classes (with the class number) they need to graduate based on what they still need, and based on the amount of semesters they have left, total of 8 semesters"
    )
    final_prompt = [
        instruction_prompt,
        HumanMessage(
            content=f"User Question: {user_question}\nStudent Record: {student_record}\nMajor Requirements (bulletin): {major_requirement}\nAnswer the question or Generate a graduation plan.")
    ]
    graduation_plan = llm1.invoke(final_prompt).content.strip()
    return f"**Graduation Plan:**\n{graduation_plan}"


# ####  MAIN PROGRAM ####
# if __name__ == "__main__":
#     setup_environment()
#     print("\n🔹 Starting Optimized Nested RAG Pipeline...")
#     user_question = input("Ask your question: ")
#     print("\nProcessing your query...\n")
#     try:
#         result = aggregate_and_generate_response(user_question)
#         print("\n🔹 Final Result:")
#         print(result)
#     except Exception as e:
#         print(f"\n❌ Error encountered: {e}")
