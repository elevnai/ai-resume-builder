from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import os
from openai import OpenAI
import PyPDF2
import docx
from io import BytesIO
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
MODEL = os.getenv('OPENAI_MODEL', 'gpt-4o-mini')

def extract_text_from_pdf(file_content):
    """Extract text from PDF file"""
    try:
        pdf_reader = PyPDF2.PdfReader(BytesIO(file_content))
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text()
        return text
    except Exception as e:
        return f"Error reading PDF: {str(e)}"

def extract_text_from_docx(file_content):
    """Extract text from DOCX file"""
    try:
        doc = docx.Document(BytesIO(file_content))
        text = "\n".join([paragraph.text for paragraph in doc.paragraphs])
        return text
    except Exception as e:
        return f"Error reading DOCX: {str(e)}"

def extract_text_from_file(file):
    """Extract text from uploaded file based on file type"""
    file_content = file.read()
    filename = file.filename.lower()

    if filename.endswith('.pdf'):
        return extract_text_from_pdf(file_content)
    elif filename.endswith('.docx'):
        return extract_text_from_docx(file_content)
    elif filename.endswith('.txt'):
        return file_content.decode('utf-8')
    else:
        return "Unsupported file format"

def tailor_resume(original_resume, job_description):
    """Use ChatGPT to tailor resume based on job description"""
    try:
        system_prompt = """You are an expert resume writer and career coach. Your task is to tailor a resume to match a specific job description while maintaining truthfulness and the candidate's actual experience.

Guidelines:
1. Analyze the job description to identify key skills, requirements, and keywords
2. Reorganize and rephrase the resume to highlight relevant experience
3. Use terminology and keywords from the job description
4. Keep all information truthful - only emphasize and reframe, never fabricate
5. Maintain professional formatting and structure
6. Optimize for ATS (Applicant Tracking Systems)
7. Keep the resume concise and impactful

Return ONLY the tailored resume text, ready to be copied or downloaded."""

        user_prompt = f"""Original Resume:
{original_resume}

Job Description:
{job_description}

Please tailor this resume to match the job description."""

        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.7,
            max_tokens=2000
        )

        tailored_resume = response.choices[0].message.content
        return tailored_resume

    except Exception as e:
        raise Exception(f"Error tailoring resume: {str(e)}")

@app.route('/')
def index():
    """Serve the main page"""
    return render_template('index.html')

@app.route('/api/tailor-resume', methods=['POST'])
def tailor_resume_endpoint():
    """API endpoint to tailor resume"""
    try:
        # Check if file was uploaded
        if 'resume' not in request.files:
            return jsonify({'error': 'No resume file uploaded'}), 400

        resume_file = request.files['resume']
        job_description = request.form.get('job_description', '')

        if not job_description:
            return jsonify({'error': 'Job description is required'}), 400

        # Extract text from resume
        resume_text = extract_text_from_file(resume_file)

        if resume_text.startswith('Error'):
            return jsonify({'error': resume_text}), 400

        # Tailor the resume
        tailored_resume = tailor_resume(resume_text, job_description)

        return jsonify({
            'success': True,
            'tailored_resume': tailored_resume
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'model': MODEL})

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
