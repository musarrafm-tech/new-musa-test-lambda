const { handler } = require('./index');

// Test events for different endpoints
const testEvents = [
    {
        name: 'Home endpoint',
        event: {
            requestContext: { http: { path: '/', method: 'GET' } }
        }
    },
    {
        name: 'Health check',
        event: {
            requestContext: { http: { path: '/health', method: 'GET' } }
        }
    },
    {
        name: 'Get all users',
        event: {
            requestContext: { http: { path: '/api/users', method: 'GET' } },
            queryStringParameters: { limit: '2', offset: '0' }
        }
    },
    {
        name: 'Create user',
        event: {
            requestContext: { http: { path: '/api/users', method: 'POST' } },
            body: JSON.stringify({ name: 'Test User', email: 'test@example.com', role: 'admin' })
        }
    },
    {
        name: 'Get user by ID',
        event: {
            requestContext: { http: { path: '/api/users/1', method: 'GET' } }
        }
    },
    {
        name: '404 Not Found',
        event: {
            requestContext: { http: { path: '/api/unknown', method: 'GET' } }
        }
    }
];

async function runTests() {
    console.log('🧪 Running local Lambda tests...\n');
    
    for (const test of testEvents) {
        console.log(`\n📍 Testing: ${test.name}`);
        console.log('─'.repeat(50));
        
        try {
            const response = await handler(test.event);
            console.log(`Status: ${response.statusCode}`);
            console.log('Response:', JSON.parse(response.body));
        } catch (error) {
            console.error('Error:', error.message);
        }
    }
    
    console.log('\n✅ Tests completed!\n');
}

runTests();