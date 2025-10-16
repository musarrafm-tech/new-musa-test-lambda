exports.handler = async (event) => {
    console.log('Event:', JSON.stringify(event, null, 2));
    
    // Parse the request path and method
    const path = event.requestContext?.http?.path || event.rawPath || '/';
    const method = event.requestContext?.http?.method || event.requestMethod || 'GET';
    
    try {
        // Route handling
        if (path === '/' && method === 'GET') {
            return handleHome(event);
        } else if (path === '/health' && method === 'GET') {
            return handleHealth(event);
        } else if (path === '/api/users' && method === 'GET') {
            return handleGetUsers(event);
        } else if (path === '/api/users' && method === 'POST') {
            return handleCreateUser(event);
        } else if (path.match(/^\/api\/users\/\d+$/) && method === 'GET') {
            return handleGetUserById(event, path);
        } else {
            return createResponse(404, { error: 'Not Found', path, method });
        }
    } catch (error) {
        console.error('Error:', error);
        return createResponse(500, { error: 'Internal Server Error', message: error.message });
    }
};

// Helper function to create response
function createResponse(statusCode, body, headers = {}) {
    return {
        statusCode,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            ...headers
        },
        body: JSON.stringify(body)
    };
}

// Parse request body
function parseBody(event) {
    if (!event.body) return null;
    try {
        return typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    } catch (e) {
        return null;
    }
}

// Home endpoint
function handleHome(event) {
    return createResponse(200, {
        message: 'Welcome to the Lambda API',
        version: '1.0.0',
        endpoints: [
            { path: '/', method: 'GET', description: 'Home endpoint' },
            { path: '/health', method: 'GET', description: 'Health check' },
            { path: '/api/users', method: 'GET', description: 'Get all users' },
            { path: '/api/users', method: 'POST', description: 'Create a user' },
            { path: '/api/users/:id', method: 'GET', description: 'Get user by ID' }
        ]
    });
}

// Health check endpoint
function handleHealth(event) {
    return createResponse(200, {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'production'
    });
}

// Mock user data (in production, this would come from a database)
const mockUsers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'user' }
];

// Get all users
function handleGetUsers(event) {
    const queryParams = event.queryStringParameters || {};
    const limit = parseInt(queryParams.limit) || mockUsers.length;
    const offset = parseInt(queryParams.offset) || 0;
    
    const paginatedUsers = mockUsers.slice(offset, offset + limit);
    
    return createResponse(200, {
        users: paginatedUsers,
        total: mockUsers.length,
        limit,
        offset
    });
}

// Create a new user
function handleCreateUser(event) {
    const body = parseBody(event);
    
    if (!body || !body.name || !body.email) {
        return createResponse(400, {
            error: 'Bad Request',
            message: 'Name and email are required'
        });
    }
    
    const newUser = {
        id: mockUsers.length + 1,
        name: body.name,
        email: body.email,
        role: body.role || 'user',
        createdAt: new Date().toISOString()
    };
    
    // In production, save to database
    mockUsers.push(newUser);
    
    return createResponse(201, {
        message: 'User created successfully',
        user: newUser
    });
}

// Get user by ID
function handleGetUserById(event, path) {
    const userId = parseInt(path.split('/').pop());
    const user = mockUsers.find(u => u.id === userId);
    
    if (!user) {
        return createResponse(404, {
            error: 'Not Found',
            message: `User with ID ${userId} not found`
        });
    }
    
    return createResponse(200, { user });
}