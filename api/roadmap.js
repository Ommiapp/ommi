export default async function handler(req, res) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "Create a JSON roadmap for a Digital Creator with these keys: 'careerGoal' and 'roadmap' containing 'weeks_1_2', 'weeks_3_4', 'weeks_5_6', 'weeks_7_8', 'weeks_9_10', 'weeks_11_12'. Each week array should contain objects with 'id', 'title', and 'link'." }] }]
      })
    });

    const rawData = await response.json();
    // This extracts the text from Gemini and turns it into a real JSON object
    const aiText = rawData.candidates[0].content.parts[0].text;
    const cleanJson = JSON.parse(aiText.replace(/```json/g, '').replace(/```/g, ''));
    
    return res.status(200).json(cleanJson);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to generate roadmap' });
  }
}
