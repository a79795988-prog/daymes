# DAYMES MEDICARE

A modern, responsive healthcare and pharmacy web application.

## Tech Stack
* **Frontend**: HTML5, CSS3, JavaScript (Vanilla), Tailwind CSS
* **Backend**: Java 17, Spring Boot 3.2, Maven

## Project Structure
The project contains both the frontend files and a Spring Boot backend in the `backend` directory.
The frontend is designed to work completely offline (local-first) using `localStorage`, but smoothly integrates with the backend API if it's available.

## Prerequisites
* Java 17 or higher
* Node/Python (optional, for running a local frontend web server)

### Setting up on macOS:
1. Install Java 17: `brew install openjdk@17`
2. Maven is included via the Spring Boot wrapper (`mvnw`), so no separate install is needed.

## Running the Backend

```bash
cd backend
# Make the wrapper executable if it isn't already
chmod +x mvnw
./mvnw spring-boot:run
```
The API server will start on `http://localhost:8080`.

## Running the Frontend

**Option 1 (Quick & Easy):**
Open `index.html` directly in your browser. Note: Some browsers may enforce strict CORS policies for `file://` URLs.

**Option 2 (Recommended):**
Run a simple HTTP server from the project root directory.

Using Python:
```bash
python3 -m http.server 3000
```
Then visit [http://localhost:3000](http://localhost:3000) in your browser.

## Testing APIs (Examples)

Here are a few `curl` commands to test the backend API manually:

* **Register a new user**
  ```bash
  curl -X POST http://localhost:8080/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"fullName":"Test User","email":"test@example.com","mobile":"+1234567890","password":"test123"}'
  ```

* **Login**
  ```bash
  curl -X POST http://localhost:8080/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"test@example.com","password":"test123"}'
  ```

* **Get Medicines**
  ```bash
  curl http://localhost:8080/api/medicines
  ```

* **Search Medicines**
  ```bash
  curl 'http://localhost:8080/api/medicines?search=paracetamol'
  ```

* **Add to Cart (Requires Auth)**
  ```bash
  curl -X POST http://localhost:8080/api/cart \
  -H 'Authorization: Bearer <your-token-here>' \
  -H 'Content-Type: application/json' \
  -d '{"productId":"prod-1","qty":2}'
  ```

## VS Code Setup
For the best development experience, install the following extensions in VS Code:
* **Java Extension Pack**
* **Spring Boot Extension Pack**

## Note on Architecture
The frontend features a resilient design. If the backend is unreachable, the UI falls back to reading/writing data from `localStorage` using `js/data.js` and `js/auth.js`. This allows the UI to be showcased even without the backend server running.

## Future Improvements
* Add a real database (PostgreSQL/MySQL) instead of in-memory data
* Integrate Spring Security for robust JWT authentication
* Cloud deployment (AWS / GCP / Heroku)
