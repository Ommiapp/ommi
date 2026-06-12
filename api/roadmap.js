export default async function handler(req, res) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: "Missing API Key" });
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "Create a JSON roadmap for a Digital Creator with keys: 'careerGoal' and 'roadmap' containing weeks_1_2 through weeks_11_12. Each week should have an array of objects with 'id', 'title', and 'link'." }] }]
      })
    });

    const aiData = await response.json();
    
    // Extracting text safely
    const aiText = aiData.candidates[0].content.parts[0].text;
    const cleanJson = JSON.parse(aiText.replace(/```json/g, '').replace(/```/g, ''));
    
    return res.status(200).json(cleanJson);
  } catch (error) {
    console.error("Backend Error:", error);
    return res.status(500).json({ error: 'Failed to generate roadmap' });
  }
}
