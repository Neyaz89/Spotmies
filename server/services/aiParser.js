const Groq = require('groq-sdk');

let groqClient = null;

function getGroqClient() {
  if (!groqClient && process.env.GROQ_API_KEY) {
    groqClient = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });
  }
  return groqClient;
}

async function parseAvailabilityText(text, userTimezone = 'UTC', referenceDate = new Date()) {
  const client = getGroqClient();
  
  if (!client) {
    throw new Error('AI parsing is not configured. Please set GROQ_API_KEY in environment variables.');
  }

  const prompt = `Parse the following availability text and extract time slots. 
The user's timezone is ${userTimezone}. Today's date is ${referenceDate.toISOString().split('T')[0]}.

Input text: "${text}"

Return a JSON array of time slots with ISO 8601 datetime strings. Each slot should have:
- start: ISO datetime string
- end: ISO datetime string

Rules:
1. If no specific date is mentioned, assume the upcoming occurrence of that day
2. If duration isn't specified, assume 1 hour slots
3. Convert all times to UTC
4. Handle ranges like "9am-5pm" as a single slot
5. Handle multiple days and times

Example output format:
[
  {"start": "2024-01-15T14:00:00.000Z", "end": "2024-01-15T15:00:00.000Z"},
  {"start": "2024-01-16T09:00:00.000Z", "end": "2024-01-16T17:00:00.000Z"}
]

Return ONLY the JSON array, no other text.`;

  try {
    const response = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are a precise datetime parser. Return only valid JSON arrays of time slots. No explanations, just the JSON array.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.1,
      max_tokens: 1000
    });

    const content = response.choices[0].message.content.trim();
    
    // Extract JSON from response (handle markdown code blocks)
    let jsonStr = content;
    if (content.includes('```')) {
      const match = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (match) jsonStr = match[1].trim();
    }

    const slots = JSON.parse(jsonStr);
    
    // Validate and normalize slots
    return slots.map(slot => ({
      start: new Date(slot.start),
      end: new Date(slot.end)
    })).filter(slot => 
      slot.start instanceof Date && !isNaN(slot.start) &&
      slot.end instanceof Date && !isNaN(slot.end) &&
      slot.end > slot.start
    );
  } catch (error) {
    console.error('AI parsing error:', error);
    throw new Error('Failed to parse availability text. Please use the calendar picker instead.');
  }
}

module.exports = { parseAvailabilityText };
