# Mówka

## Setup & Running

### Frontend setup
To start the frontend `cd frontend/` run: `python -m http.server 8080`

### Backend setup

1.  **Create Virtual Environment**:
    ```bash
    python3 -m venv venv
    source venv/bin/activate
    ```

2.  **Install Dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

3.  **Run Server**:
    ```bash
    uvicorn main:app --reload
    ```
    The API will be available at `http://localhost:8000`. Documentation is at `/docs`.

4.  **Run Tests**:
    ```bash
    PYTHONPATH=. pytest
    ```