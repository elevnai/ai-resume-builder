// DOM Elements
const resumeFile = document.getElementById('resumeFile');
const fileLabel = document.querySelector('.file-upload-label');
const fileName = document.getElementById('fileName');
const jobDescription = document.getElementById('jobDescription');
const tailorBtn = document.getElementById('tailorBtn');
const btnText = document.getElementById('btnText');
const btnLoader = document.getElementById('btnLoader');
const resultSection = document.getElementById('resultSection');
const tailoredResume = document.getElementById('tailoredResume');
const errorSection = document.getElementById('errorSection');
const errorMessage = document.getElementById('errorMessage');
const copyBtn = document.getElementById('copyBtn');
const downloadBtn = document.getElementById('downloadBtn');
const downloadDocxBtn = document.getElementById('downloadDocxBtn');

let selectedFile = null;
let currentResumeText = '';

// File upload handling
resumeFile.addEventListener('change', (e) => {
    handleFileSelect(e.target.files[0]);
});

// Drag and drop
fileLabel.addEventListener('dragover', (e) => {
    e.preventDefault();
    fileLabel.classList.add('drag-over');
});

fileLabel.addEventListener('dragleave', () => {
    fileLabel.classList.remove('drag-over');
});

fileLabel.addEventListener('drop', (e) => {
    e.preventDefault();
    fileLabel.classList.remove('drag-over');
    handleFileSelect(e.dataTransfer.files[0]);
});

function handleFileSelect(file) {
    if (file) {
        const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
        if (validTypes.includes(file.type)) {
            selectedFile = file;
            fileName.textContent = file.name;
            fileName.style.color = '#10b981';
            checkFormValidity();
        } else {
            showError('Please upload a PDF, DOCX, or TXT file');
            selectedFile = null;
        }
    }
}

// Check if form is valid
function checkFormValidity() {
    const isValid = selectedFile && jobDescription.value.trim().length > 0;
    tailorBtn.disabled = !isValid;
}

jobDescription.addEventListener('input', checkFormValidity);

// Tailor resume
tailorBtn.addEventListener('click', async () => {
    if (!selectedFile || !jobDescription.value.trim()) return;

    // Hide previous results/errors
    resultSection.classList.add('hidden');
    errorSection.classList.add('hidden');

    // Show loading state
    btnText.classList.add('hidden');
    btnLoader.classList.remove('hidden');
    tailorBtn.disabled = true;

    try {
        const formData = new FormData();
        formData.append('resume', selectedFile);
        formData.append('job_description', jobDescription.value.trim());

        const response = await fetch('/api/tailor-resume', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (response.ok && data.success) {
            // Show result
            currentResumeText = data.tailored_resume;

            // Format the resume with HTML for better display
            const formattedHtml = formatResumeHTML(currentResumeText);
            tailoredResume.innerHTML = formattedHtml;

            resultSection.classList.remove('hidden');

            // Scroll to result
            resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
            showError(data.error || 'An error occurred while tailoring your resume');
        }
    } catch (error) {
        showError('Network error: ' + error.message);
    } finally {
        // Reset button state
        btnText.classList.remove('hidden');
        btnLoader.classList.add('hidden');
        tailorBtn.disabled = false;
    }
});

// Format resume text as HTML for better display
function formatResumeHTML(text) {
    let html = '';
    const lines = text.split('\n');

    for (let line of lines) {
        line = line.trim();
        if (!line) continue;

        // Section headers (ALL CAPS)
        if (line === line.toUpperCase() && line.length > 3 && !line.startsWith('•')) {
            html += `<h3 class="section-header">${line}</h3>`;
        }
        // Bold text (markdown style)
        else if (line.includes('**')) {
            const formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            html += `<p class="job-title">${formatted}</p>`;
        }
        // Bullet points
        else if (line.startsWith('•')) {
            html += `<p class="bullet-point">${line}</p>`;
        }
        // Regular text
        else {
            html += `<p>${line}</p>`;
        }
    }

    return html;
}

// Copy to clipboard
copyBtn.addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText(currentResumeText);
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✅ Copied!';
        setTimeout(() => {
            copyBtn.textContent = originalText;
        }, 2000);
    } catch (error) {
        showError('Failed to copy to clipboard');
    }
});

// Download as TXT
downloadBtn.addEventListener('click', () => {
    const blob = new Blob([currentResumeText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tailored_resume.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

// Download as formatted DOCX
downloadDocxBtn.addEventListener('click', async () => {
    try {
        const response = await fetch('/api/download-docx', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                resume_text: currentResumeText
            })
        });

        if (response.ok) {
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'tailored_resume.docx';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } else {
            showError('Failed to generate DOCX file');
        }
    } catch (error) {
        showError('Error downloading DOCX: ' + error.message);
    }
});

// Show error
function showError(message) {
    errorMessage.textContent = message;
    errorSection.classList.remove('hidden');
    errorSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Check API health on load
async function checkHealth() {
    try {
        const response = await fetch('/api/health');
        const data = await response.json();
        console.log('API Health:', data);
    } catch (error) {
        console.error('API health check failed:', error);
    }
}

checkHealth();
