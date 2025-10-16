# Lambda API Function

A Node.js Lambda function with multiple REST API endpoints, designed to work with the SkyU CI/CD pipeline.

## 📋 Available Endpoints

### 1. Home - `GET /`
Returns API information and available endpoints.

**Response:**
```json
{
  "message": "Welcome to the Lambda API",
  "version": "1.0.0",
  "endpoints": [...]
}
```

### 2. Health Check - `GET /health`
Returns the health status of the Lambda function.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456,
  "environment": "production"
}
```

### 3. Get All Users - `GET /api/users`
Returns a list of users with optional pagination.

**Query Parameters:**
- `limit` (optional): Number of users to return
- `offset` (optional): Starting position

**Response:**
```json
{
  "users": [...],
  "total": 3,
  "limit": 10,
  "offset": 0
}
```

### 4. Create User - `POST /api/users`
Creates a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "user": {
    "id": 4,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 5. Get User by ID - `GET /api/users/:id`
Returns a specific user by their ID.

**Response:**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin"
  }
}
```

## 🚀 Local Development

### Prerequisites
- Node.js 20.x or higher
- npm

### Installation
```bash
npm install
```

### Testing Locally
```bash
npm run local
```

This will run all test scenarios and display the responses.

## 📦 Project Structure

```
.
├── index.js          # Main Lambda handler with all endpoints
├── package.json      # Node.js dependencies and scripts
├── local-test.js     # Local testing script
└── README.md         # This file
```

## 🔧 Pipeline Configuration

This Lambda function is configured to work with the SkyU GitHub Actions pipeline. The pipeline will:

1. **Code Scan**: Run Semgrep and Trivy security scans
2. **Test**: Execute tests (add your tests in a `test` directory)
3. **Build**: Install dependencies and build the application
4. **Deploy**: Package the Lambda function and deploy to AWS
5. **Configure**: Set up Lambda function URL and permissions

### Environment Variables Expected by Pipeline

The pipeline expects these environment variables (set in your SkyU platform):
- `BUILD_ENVIRONEMENT_VERSION`: Node.js version (e.g., "20.x")
- `APP_INSTALL_DEPS_COMMAND`: Command to install dependencies (e.g., "npm install")
- `APP_BUILD_COMMAND`: Command to build the app (e.g., "npm run build")
- `BUILD_LIBRARIES_FOLDER`: Folder containing dependencies (e.g., "node_modules")
- `APP_BUILD_FOLDER`: Output folder (e.g., ".")
- `LAMBDA_FUNCTION_NAME`: Your Lambda function name
- `LAMBDA_FUNCTION_HANDLER`: Handler path (e.g., "index.handler")
- `LAMBDA_FUNCTION_TIMEOUT`: Timeout in seconds
- `LAMBDA_FUNCTION_MEMORY_SIZE`: Memory in MB

## 🧪 Adding Tests

Create a `test` directory and add Jest tests:

```javascript
// test/handler.test.js
const { handler } = require('../index');

describe('Lambda Handler', () => {
  test('Home endpoint returns 200', async () => {
    const event = {
      requestContext: { http: { path: '/', method: 'GET' } }
    };
    const response = await handler(event);
    expect(response.statusCode).toBe(200);
  });
});
```

Run tests:
```bash
npm test
```

## 🔐 Security

- All endpoints have CORS enabled
- Input validation is performed on POST requests
- Error messages don't expose sensitive information

## 📝 Notes

- This is a basic implementation with in-memory data storage
- For production, integrate with a database (DynamoDB, RDS, etc.)
- Add authentication/authorization as needed
- Implement proper logging and monitoring

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test locally using `npm run local`
4. Commit and push to trigger the pipeline
5. The pipeline will automatically deploy to AWS

## 📄 License

MIT# new-musa-test-lambda
