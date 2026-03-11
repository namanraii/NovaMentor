import PyPDF2
import io

def extract_text(pdf_bytes: bytes) -> str:
    reader = PyPDF2.PdfReader(io.BytesIO(pdf_bytes))
    text = ''
    for page in reader.pages:
        text += page.extract_text() + '\n'
    return text.strip()
