# MindMetric -- Student Mental Health Prediction System

A web-based student mental health score prediction interface built with
**HTML, CSS, JavaScript, FastAPI, and a trained machine learning
model**.

The application collects information about a student's demographics,
social media habits, study routine, physical activity, sleep, and
perceived stress. It sends the data to a FastAPI backend and displays
the predicted mental health score returned by the model.

### Project Preview

![MindMetric application screenshot](https://github.com/user-attachments/assets/deeadd32-194b-4b9e-a880-c47d69c56bde)

## Features

-   Responsive desktop and mobile interface
-   Student information form with input validation
-   Social media usage and daily routine inputs
-   FastAPI integration through the `/predict` endpoint
-   Loading state while the prediction request is processed
-   Displays the predicted score returned by the model
-   API error handling and feedback
-   Reset option to clear the assessment form

## Technology Stack

**Frontend** - HTML5 - CSS3 - Vanilla JavaScript

**Backend and Machine Learning** - Python - FastAPI - Pydantic -
Pandas - Joblib - Trained machine learning model
(`MentalHealth_Model.pkl`)



## Getting Started

### 1. Clone the repository

``` bash
git clone <your-repository-url>
cd "Mental Health Prediction"
```

### 2. Create and activate a virtual environment

Windows PowerShell:

``` powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

### 3. Install backend dependencies

``` powershell
pip install fastapi uvicorn pandas joblib scikit-learn
```

Install any additional packages required by your model's preprocessing
pipeline.

### 4. Start the FastAPI server

Run this from the directory containing `main.py` and
`MentalHealth_Model.pkl`:

``` powershell
python -m uvicorn main:app --reload
```

API base URL: `http://127.0.0.1:8000`

Interactive API documentation: `http://127.0.0.1:8000/docs`

### 5. Run the frontend

Open `index.html` in a browser, or use the **Live Server** extension in
Visual Studio Code.

By default, `script.js` sends requests to:

``` javascript
const API_URL = "http://127.0.0.1:8000/predict";
```

Update `API_URL` if your backend uses a different host or port.

## API Endpoint

**Method:** `POST`\
**Endpoint:** `/predict`

The frontend sends these fields:

-   `age`
-   `gender`
-   `country`
-   `academic_level`
-   `most_used_platform`
-   `purpose_of_use`
-   `avg_daily_usage_hours`
-   `daily_unlocks`
-   `study_hours`
-   `physical_activity_hours`
-   `sleep_hours_per_night`
-   `stress_level`

Example response:

``` json
{
  "predicted_mental_health_score": 5.36
}
```

This is an example response; actual predictions depend on the submitted
data and trained model.


## Model Output Disclaimer

The score should be interpreted only according to the target variable
definition, scale, and evaluation used during model development. It is
not a clinical diagnosis and should not replace assessment or advice
from a qualified mental health professional.

## Future Improvements

-   Add score interpretation based on the verified target scale
-   Improve accessibility and form guidance
-   Add automated frontend and API tests
-   Deploy the frontend and backend
-   Add privacy and data-retention controls before collecting real user
    data

