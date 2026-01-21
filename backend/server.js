const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from public folder
app.use(express.static(path.join(__dirname, 'public')));

// ========== API ENDPOINTS ==========

// 1. Root API endpoint (for testing)
app.get('/api', (req, res) => {
  res.json({
    message: 'SproDeal API is running',
    status: 'success',
    version: '1.0.0',
    endpoints: [
      '/api/test',
      '/api/health',
      '/api/login',
      '/api/submit-complaint'
    ]
  });
});

// 2. Test endpoint (what your HTML is checking for)
app.get('/api/test', (req, res) => {
  res.json({
    message: 'Backend is working!',
    status: 'success',
    timestamp: new Date().toISOString()
  });
});

// 3. Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// 4. Login endpoint (POST)
app.post('/api/login', (req, res) => {
  const { mobile, password } = req.body;
  
  console.log('📱 Login attempt:', { mobile });
  
  // Simple validation
  if (!mobile || !password) {
    return res.status(400).json({
      success: false,
      message: 'Mobile and password are required'
    });
  }
  
  // Validate Indian mobile number format
  const mobileRegex = /^\+91\s?\d{5}\s?\d{5}$/;
  if (!mobileRegex.test(mobile)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid mobile number format. Use: +91 XXXXX XXXXX'
    });
  }
  
  // Mock authentication - ALWAYS SUCCESSFUL for now
  res.json({
    success: true,
    userId: 'USER-' + Date.now(),
    message: 'Login successful',
    mobile: mobile,
    timestamp: new Date().toISOString()
  });
});

// 5. Submit complaint endpoint (POST)
app.post('/api/submit-complaint', (req, res) => {
  const { 
    userId, 
    fullName, 
    problemType, 
    securityPin, 
    investmentExperience 
  } = req.body;
  
  console.log('📝 Complaint submission:', { 
    userId, 
    fullName, 
    problemType,
    investmentExperience 
  });
  
  // Validation
  if (!fullName || !problemType || !securityPin || !investmentExperience) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required'
    });
  }
  
  if (securityPin.length !== 6) {
    return res.status(400).json({
      success: false,
      message: 'Security PIN must be 6 digits'
    });
  }
  
  // Generate unique complaint ID
  const complaintId = 'CMP-' + Math.floor(100000 + Math.random() * 900000);
  
  // Log the complaint (in production, save to database)
  const complaint = {
    complaintId,
    userId,
    fullName,
    problemType,
    investmentExperience,
    securityPin: '******', // Don't log actual PIN
    timestamp: new Date().toISOString(),
    status: 'pending'
  };
  
  console.log('✅ Complaint registered:', complaint);
  
  // Return success response
  res.json({
    success: true,
    complaintId: complaintId,
    message: 'Complaint submitted successfully',
    timestamp: complaint.timestamp,
    details: {
      name: fullName,
      problem: problemType,
      experience: investmentExperience
    }
  });
});

// 6. Get all complaints (for testing/admin)
app.get('/api/complaints', (req, res) => {
  res.json({
    success: true,
    message: 'This would return all complaints from database',
    complaints: [] // Empty array for now
  });
});

// 7. Serve HTML for all other routes (Single Page App support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ========== START SERVER ==========

// Get port from environment variable (Render provides this)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
  console.log(`🌐 Website: http://localhost:${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}/api`);
  console.log(`🔧 Endpoints available:`);
  console.log(`   - GET  /api          - API info`);
  console.log(`   - GET  /api/test     - Test backend`);
  console.log(`   - GET  /api/health   - Health check`);
  console.log(`   - POST /api/login    - Login endpoint`);
  console.log(`   - POST /api/submit-complaint - Submit complaint`);
});