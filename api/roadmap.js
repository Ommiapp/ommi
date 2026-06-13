export default async function handler(req, res) {
  console.log("API: Roadmap function started");
  
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    console.error("API Error: GEMINI_API_KEY is missing");
    return res.status(500).json({ error: "Missing API Key" });
  }

  try {
    console.log("API: Connecting to Gemini...");
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "Create a JSON roadmap for a Digital Creator with keys: 'careerGoal' and 'roadmap' containing weeks_1_2 through weeks_11_12." }] }]
      })
    });

    const aiData = await response.json();
    console.log("API: Gemini responded");

    if (!aiData.candidates) {
       console.error("API Error: Gemini response invalid", aiData);
       throw new Error("Invalid response from Gemini");
    }

    const aiText = aiData.candidates[0].content.parts[0].text;
    const cleanJson = JSON.parse(aiText.replace(/```json/g, '').replace(/```/g, ''));
    
    console.log("API: Success!");
    return res.status(200).json(cleanJson);
  } catch (error) {
    console.error("API Fatal Error:", error);
    return res.status(500).json({ error: error.message });
  }
}
