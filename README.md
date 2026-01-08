# 🔍 Plagiarism Detection System By
## Algo Avengers Team

A professional code plagiarism detection system using AST analysis, CFG matching, and CodeBERT semantic embeddings.

---

## 📁 Project Structure

```
plagiarism-detector/
│
├── backend/
│   ├── app.py                 # Flask API server
│   ├── plagiarism_engine.py   # Core detection logic
│   └── requirements.txt       # Python dependencies
│
├── frontend/
│   ├── index.html            # Main UI
│   ├── styles.css            # Styling
│   └── script.js             # Frontend logic
│
└── README.md
```

---

## 🚀 Setup Instructions for Windows + VSCode

### Step 1: Create Project Structure

1. Open VSCode
2. Create a folder named `plagiarism-detector`
3. Open this folder in VSCode (File → Open Folder)
4. Create two folders inside: `backend` and `frontend`

### Step 2: Create Files

**Backend files** (in `backend/` folder):
- `app.py` - Copy from Flask Backend artifact
- `plagiarism_engine.py` - Copy from plagiarism_engine.py artifact
- `requirements.txt` - Copy from requirements.txt artifact

**Frontend files** (in `frontend/` folder):
- `index.html` - Copy from index.html artifact
- `styles.css` - Copy from styles.css artifact
- `script.js` - Copy from script.js artifact

### Step 3: Install Python Dependencies

1. Open VSCode Terminal (View → Terminal or Ctrl + `)
2. Navigate to backend folder:
   ```bash
   cd backend
   ```

3. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

4. Activate virtual environment:
   ```bash
   venv\Scripts\activate
   ```
   You should see `(venv)` in your terminal.

5. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
   ⚠️ **Note**: This will download ~2GB of models (PyTorch + CodeBERT). It may take 5-10 minutes.

### Step 4: Run the Backend Server

With the virtual environment activated:
```bash
python app.py
```

You should see:
```
============================================================
🚀 Plagiarism Detection API Starting...
============================================================
📍 Running on: http://localhost:5000
🔧 Made by RV and Algo Avengers Team
============================================================
```

**Keep this terminal running!**

### Step 5: Run the Frontend

1. Open a new terminal in VSCode (Terminal → New Terminal)
2. Navigate to frontend folder:
   ```bash
   cd frontend
   ```

3. Start a simple HTTP server:
   
   **Option A - Using Python:**
   ```bash
   python -m http.server 8000
   ```
   
   **Option B - Using Node.js (if installed):**
   ```bash
   npx http-server -p 8000
   ```
   
   **Option C - Using VSCode Live Server Extension:**
   - Install "Live Server" extension in VSCode
   - Right-click on `index.html` → "Open with Live Server"

4. Open your browser and go to:
   ```
   http://localhost:8000
   ```

---

## 🎯 How to Use

### Source Code Detection (Working)

1. Click on **"Source Code Detection"** tab (should be active by default)
2. Paste Python code in **Program 1** text box
3. Paste Python code in **Program 2** text box
4. Click **"Check Plagiarism"** button
5. Wait for analysis (usually 2-5 seconds)
6. View detailed results on the right panel

### Text Detection (Not Implemented Yet)

- This feature is planned for future implementation
- UI is ready but backend logic is pending

---

## 📊 What the System Analyzes

1. **AST (Abstract Syntax Tree)** - Code structure comparison
2. **CFG (Control Flow Graph)** - Execution flow analysis
3. **Call Graph** - Function call patterns
4. **Semantic Similarity** - CodeBERT embeddings
5. **Intent Matching** - Behavioral signature detection
6. **AI-Generated Probability** - Heuristic analysis

---

## 🔧 Troubleshooting

### Backend Issues

**Error: "ModuleNotFoundError"**
- Make sure virtual environment is activated: `venv\Scripts\activate`
- Reinstall dependencies: `pip install -r requirements.txt`

**Error: Port 5000 already in use**
- Change port in `app.py`: `app.run(debug=True, port=5001)`
- Update `API_BASE_URL` in `script.js` to match new port

**CodeBERT model download fails**
- Check internet connection
- Try downloading manually:
  ```python
  from transformers import RobertaTokenizer, RobertaModel
  RobertaTokenizer.from_pretrained("microsoft/codebert-base")
  RobertaModel.from_pretrained("microsoft/codebert-base")
  ```

### Frontend Issues

**Error: "Network error" when checking plagiarism**
- Ensure backend server is running on port 5000
- Check browser console (F12) for CORS errors
- Verify API_BASE_URL in `script.js` matches your backend

**UI not loading properly**
- Clear browser cache (Ctrl + Shift + Delete)
- Check browser console for JavaScript errors
- Ensure all three files (HTML, CSS, JS) are in the frontend folder

---

## 🎨 Features

✅ **Professional UI** - Clean, modern design inspired by popular plagiarism tools  
✅ **Real-time Analysis** - Fast detection with loading indicators  
✅ **Detailed Metrics** - Multiple similarity scores and explanations  
✅ **Code Validation** - Pre-checks for syntax errors  
✅ **Intent Verification** - Prevents false positives  
✅ **AI Detection** - Estimates probability of AI-generated code  

---

## 📝 Example Test Cases

### Test 1: Similar Code (Should detect plagiarism)

**Program 1:**
```python
def get_diff(x, y):
    diff = x + y
    return diff
```

**Program 2:**
```python
def perform_addition(x, y):
    total = x + y
    return total
```

### Test 2: Different Intent (Should be original)

**Program 1:**
```python
def multiply(a, b):
    result = a * b
    return result
```

**Program 2:**
```python
def add_numbers(x, y):
    sum_val = x + y
    return sum_val
```

---

## 👥 Team

**Algo Avengers**  
Made by RV and Algo Team © 2025-26

---

## 📞 Support

If you encounter issues:
1. Check this README thoroughly
2. Verify all setup steps were completed
3. Check terminal for error messages
4. Ensure Python 3.8+ is installed

---

## 🔮 Future Enhancements

- [ ] Text plagiarism detection
- [ ] Database integration for multi-file comparison
- [ ] Support for more programming languages
- [ ] Export reports as PDF
- [ ] User authentication and history
- [ ] Batch processing capabilities# minor update
