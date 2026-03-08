const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const Groq = require('groq-sdk');

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Health Check
app.get('/api/health', (req, res) => res.json({ status: 'ok', env: process.env.NODE_ENV }));

// Specific Groq Chat Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a professional Hospital AI Assistant. Provide basic health guidance and help with hospital-related questions. For serious symptoms, always recommend consulting a doctor.' },
        { role: 'user', content: message }
      ],
      model: 'llama3-8b-8192',
    });

    res.json({ reply: chatCompletion.choices[0]?.message?.content || "No response." });
  } catch (error) {
    console.error('Chat Error:', error);
    res.status(500).json({ error: 'AI Error', details: error.message });
  }
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/patients', require('./routes/patientRoutes'));
app.use('/api/inventory', require('./routes/inventoryRoutes'));
app.use('/api/staff', require('./routes/staffRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));

// Integrated Database Viewer
app.get('/admin/db', async (req, res) => {
  try {
    const mongoose = require('mongoose');
    if (!mongoose.connection.db) {
      return res.status(500).send("Database not connected yet.");
    }
    const collections = await mongoose.connection.db.listCollections().toArray();
    const result = {};
    for (const col of collections) {
      result[col.name] = await mongoose.connection.db.collection(col.name).find().toArray();
    }

    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>DB Viewer | Hospital Automate</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #0f172a; color: #f8fafc; margin: 0; padding: 40px; }
          .container { max-width: 1200px; margin: 0 auto; }
          h1 { color: #38bdf8; border-bottom: 2px solid #1e293b; padding-bottom: 20px; }
          .card { background: #1e293b; border-radius: 12px; margin-bottom: 30px; border: 1px solid #334155; overflow: hidden; }
          .card-header { background: #334155; padding: 12px 20px; font-weight: bold; color: #f1f5f9; display: flex; justify-content: space-between; align-items: center; }
          .card-body { padding: 0; }
          pre { margin: 0; background: #000; color: #10b981; padding: 20px; overflow-x: auto; font-size: 14px; line-height: 1.5; }
          .badge { background: #38bdf8; color: #001e3c; padding: 2px 8px; border-radius: 999px; font-size: 12px; }
          .footer { margin-top: 40px; text-align: center; color: #64748b; font-size: 0.9rem; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🏥 Hospital Automate - Database Browser</h1>
          ${collections.map(col => `
            <div class="card">
              <div class="card-header">
                <span>📁 Collection: ${col.name}</span>
                <span class="badge">${result[col.name].length} Records</span>
              </div>
              <div class="card-body">
                <pre>${JSON.stringify(result[col.name], null, 2)}</pre>
              </div>
            </div>
          `).join('')}
          <div class="footer">
            Generated at ${new Date().toLocaleString()} | In-Memory Database Instance
          </div>
        </div>
      </body>
      </html>
    `);
  } catch (err) {
    res.status(500).send("Viewer Error: " + err.message);
  }
});

module.exports = app;
