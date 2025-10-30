const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs').promises;
const path = require('path');

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Analyze receipt using Gemini AI
async function analyzeReceipt(filePath, paymentCodeData) {
  try {
    // Read the image file
    const imageBuffer = await fs.readFile(filePath);
    const base64Image = imageBuffer.toString('base64');
    const ext = path.extname(filePath).toLowerCase();

    let mimeType = 'image/jpeg';
    if (ext === '.png') mimeType = 'image/png';
    else if (ext === '.jpg' || ext === '.jpeg') mimeType = 'image/jpeg';
    else if (ext === '.pdf') {
      // For PDFs, you would need additional processing
      // For now, we'll return a message
      return {
        success: false,
        error: 'PDF analysis requires additional processing. Please use image files.'
      };
    }

    // Prepare the prompt
    const prompt = `You are an AI assistant that analyzes payment receipts. Please extract the following information from this receipt:

1. Payment amount (numerical value only)
2. Payment date (in YYYY-MM-DD format)
3. Payment method (e.g., Cash, Bank Transfer, Card, etc.)
4. Transaction/Reference number (if visible)
5. Payee/Recipient name
6. Any relevant notes or observations

Expected payment details:
- Student: ${paymentCodeData.student_name}
- Expected Amount: ${paymentCodeData.expected_amount || 'Not specified'}
- Session: ${paymentCodeData.session}

Also, provide:
- A confidence score (0-100) indicating how clear and readable the receipt is
- Whether this receipt appears to match the expected payment (true/false)
- Any red flags or concerns (if any)

Return the response in the following JSON format (only JSON, no markdown):
{
  "amount": number,
  "date": "YYYY-MM-DD",
  "paymentMethod": "string",
  "transactionRef": "string",
  "payee": "string",
  "notes": "string",
  "confidenceScore": number,
  "matchesExpected": boolean,
  "concerns": ["array of concern strings"],
  "extractedText": "raw extracted text from receipt"
}`;

    // Get the generative model (using gemini-1.5-flash for vision)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Prepare the image part
    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: mimeType
      }
    };

    // Call Gemini API with vision
    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const content = response.text();

    // Try to extract JSON from the response
    let analysisData;
    try {
      // Remove markdown code blocks if present
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) ||
                       content.match(/```\n([\s\S]*?)\n```/) ||
                       content.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content;
      analysisData = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.log('Raw content:', content);

      // If parsing fails, create a structured response from the text
      analysisData = {
        amount: null,
        date: null,
        paymentMethod: 'Unknown',
        transactionRef: null,
        payee: null,
        notes: content,
        confidenceScore: 50,
        matchesExpected: false,
        concerns: ['Unable to parse receipt data automatically'],
        extractedText: content
      };
    }

    return {
      success: true,
      data: analysisData
    };

  } catch (error) {
    console.error('AI Analysis Error:', error);

    // Return a fallback response
    return {
      success: false,
      error: error.message,
      data: {
        amount: null,
        date: null,
        paymentMethod: 'Unknown',
        transactionRef: null,
        payee: null,
        notes: 'AI analysis failed. Manual review required.',
        confidenceScore: 0,
        matchesExpected: false,
        concerns: ['AI analysis unavailable - ' + error.message],
        extractedText: ''
      }
    };
  }
}

// Alternative: Simple OCR simulation (fallback if Gemini is not available)
async function simulateOCR(filePath) {
  return {
    success: true,
    data: {
      amount: null,
      date: null,
      paymentMethod: 'Manual Review Required',
      transactionRef: null,
      payee: null,
      notes: 'OCR processing simulated. Manual review required.',
      confidenceScore: 30,
      matchesExpected: false,
      concerns: ['OCR not configured'],
      extractedText: 'OCR text extraction would appear here'
    }
  };
}

module.exports = {
  analyzeReceipt,
  simulateOCR
};
