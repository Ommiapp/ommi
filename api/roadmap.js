export default async function handler(req, res) {
  // This line pulls the key from the Environment Variables you set in Vercel
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: "API Key is missing!" });
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "Create a JSON roadmap for a Digital Creator with keys: 'careerGoal' and 'roadmap' containing weeks_1_2 through weeks_11_12." }] }]
      })
    });

    const aiResponse = await response.json();
    
    // Safety check: ensure Gemini actually returned data
    if (!aiResponse.candidates || !aiResponse.candidates[0].content.parts[0].text) {
       return res.status(500).json({ error: "Gemini did not return valid data" });
    }

    const aiText = aiResponse.candidates[0].content.parts[0].text;
    const cleanJson = JSON.parse(aiText.replace(/```json/g, '').replace(/```/g, ''));
    
    return res.status(200).json(cleanJson);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to generate roadmap' });
  }
}
