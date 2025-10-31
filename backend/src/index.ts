import express, { Request, Response } from "express";
import cors from "cors";
import OpenAI from "openai";
import "dotenv/config";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

const app = express();
const PORT = process.env.PORT || 5001;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(cors());
app.use(express.json());

app.post("/classify-transcript", async (req: Request, res: Response) => {
  const { transcript } = req.body;
  if (!transcript || typeof transcript !== "string") {
    return res.status(400).json({ error: "Field 'transcript' (string) is required." });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5", // or another available OpenAI model
      messages: [
        {
          role: "system",
          content: `You are a transcript classifier. Analyze the call transcript and classify it into one of these categories:
    - voice_interested: Lead is interested, will contact human rep
    - voice_not_interested: Lead is not interested
    - voice_immediate_hangup: Lead hung up without conclusion
    - voice_wrong_number: Wrong phone number
    - voice_no_action: No follow-up needed
    - voice_wants_call_back: Schedule another AI call
    - voice_wants_email_follow_up: Continue via email
    - voice_wants_whatsapp_sms_follow_up: Continue via SMS/WhatsApp
    - voice_voice_mail: Voice mailbox
    - voice_unknown: None of the above
    
    For each classification, provide reasoning with EXACT quotes from the transcript as citations.`,
        },
        {
          role: "user",
          content: `Classify this transcript and provide reasoning with exact citations:\n\n${transcript}`,
        },
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "classify_transcript",
            description: "Classify the transcript and provide reasoning with citations",
            parameters: {
              type: "object",
              properties: {
                classification: {
                  type: "string",
                  enum: [
                    "voice_interested",
                    "voice_not_interested",
                    "voice_immediate_hangup",
                    "voice_wrong_number",
                    "voice_no_action",
                    "voice_wants_call_back",
                    "voice_wants_email_follow_up",
                    "voice_wants_whatsapp_sms_follow_up",
                    "voice_voice_mail",
                    "voice_unknown",
                  ],
                },
                reasoning: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      reasoning_text: { type: "string" },
                      citations: {
                        type: "array",
                        items: { type: "string" },
                      },
                    },
                    required: ["reasoning_text", "citations"],
                  },
                },
              },
              required: ["classification", "reasoning"],
            },
          },
        },
      ],
      tool_choice: { type: "function", function: { name: "classify_transcript" } },
    });
    
    console.log(JSON.stringify(response.choices[0].message, null, 2));

    const choice = response.choices[0];
    const toolCall = choice.message.tool_calls?.[0];
    
    let classificationResult: Partial<ClassificationResult> = {};
    
    if (toolCall?.function?.arguments) {
      const args = JSON.parse(toolCall.function.arguments);
    
      classificationResult = {
        transcriptId: crypto.randomUUID(), // or pass one from req.body if you have it
        classification: args.classification,
        reasoning: args.reasoning.map((r: any) => `${r.reasoning_text} (cited: ${r.citations.join(", ")})`).join(" "),
      };
    } else {
      classificationResult = {
        transcriptId: crypto.randomUUID(),
        classification: "voice_unknown",
        reasoning: "No classification returned by model.",
      };
    }
    
    res.json(classificationResult);

  } catch (error: any) {
    console.error("OpenAI error:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});
   
app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});