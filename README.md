# AI Resume Builder 🚀

An intelligent resume builder that uses OpenAI's ChatGPT to custom-tailor your resume based on job descriptions.

## Features ✨

- 📄 Upload your original resume (PDF, DOCX, or TXT)
- 🎯 Paste job descriptions to tailor your resume
- 🤖 AI-powered resume customization using ChatGPT
- 📱 Modern, responsive web interface
- 💾 Download tailored resumes instantly
- 🔒 Secure and private - no data stored

## Quick Start 🏃‍♂️

### Prerequisites
- Python 3.8+
- OpenAI API Key ([Get one here](https://platform.openai.com/api-keys))

### Installation

1. Clone the repository:
```bash
git clone https://github.com/elevnai/ai-resume-builder.git
cd ai-resume-builder
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up your OpenAI API key:
```bash
# Create a .env file
echo "OPENAI_API_KEY=your_api_key_here" > .env
```

4. Run the application:
```bash
python app.py
```

5. Open your browser and go to: `http://localhost:5000`

## How It Works 🔄

1. **Upload Resume**: Upload your original resume in PDF, DOCX, or TXT format
2. **Add Job Description**: Paste the job description you're targeting
3. **AI Magic**: ChatGPT analyzes both and tailors your resume to match
4. **Download**: Get your customized resume instantly

## Project Structure 📁

```
ai-resume-builder/
├── app.py                 # Flask backend server
├── requirements.txt       # Python dependencies
├── .env.example          # Environment variables template
├── .gitignore           # Git ignore rules
├── static/
│   ├── css/
│   │   └── style.css    # Application styles
│   └── js/
│       └── app.js       # Frontend JavaScript
└── templates/
    └── index.html       # Main web interface
```

## Configuration ⚙️

### Environment Variables
- `OPENAI_API_KEY`: Your OpenAI API key (required)
- `OPENAI_MODEL`: Model to use (default: gpt-4o-mini)
- `PORT`: Server port (default: 5000)

### Customize AI Behavior
Edit the system prompt in `app.py` to change how resumes are tailored.

## Deployment 🌐

### Deploy to Heroku
```bash
heroku create your-app-name
heroku config:set OPENAI_API_KEY=your_key_here
git push heroku main
```

### Deploy to Railway
1. Connect your GitHub repo to Railway
2. Add `OPENAI_API_KEY` environment variable
3. Deploy automatically

## Security 🔐

- API keys stored in environment variables
- No resume data is stored on the server
- Files are processed in memory only
- CORS configured for security

## Technologies Used 💻

- **Backend**: Python, Flask
- **AI**: OpenAI GPT-4o-mini
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **File Processing**: PyPDF2, python-docx

## Contributing 🤝

Contributions are welcome! Please feel free to submit a Pull Request.

## License 📝

MIT License - feel free to use this project for personal or commercial purposes.

## Support 💬

If you encounter any issues or have questions, please open an issue on GitHub.

## Roadmap 🗺️

- [ ] Support for multiple resume versions
- [ ] Cover letter generation
- [ ] LinkedIn profile optimization
- [ ] Resume templates
- [ ] Batch processing
- [ ] Analytics dashboard

---

Made with ❤️ using AI
