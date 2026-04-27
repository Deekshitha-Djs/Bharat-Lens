const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { GoogleGenerativeAI } = require("@google/generative-ai");

admin.initializeApp();

// Initialize Gemini API
// IMPORTANT: Add YOUR_GEMINI_API_KEY to Firebase environment variables:
// firebase functions:config:set gemini.key="YOUR_API_KEY_HERE"
const genAI = new GoogleGenerativeAI(functions.config().gemini?.key || "YOUR_GEMINI_API_KEY");

exports.analyzeLegalQuery = functions.https.onCall(async (data, context) => {
  try {
    const query = data.query;
    const language = data.language || "English";

    if (!query) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "The function must be called with a valid 'query'."
      );
    }

    const systemInstruction = `You are BharatLens, an AI assistant that explains Indian laws in very simple language.
When a user describes a situation:
1. Identify the relevant Indian law
2. Explain it simply
3. Tell the user their rights
4. Provide 3 practical steps they can take
5. Avoid complex legal jargon

Please reply in the following language: ${language}.

Format the response EXACTLY like this:

Relevant Law
(simple explanation)

Your Rights
• point 1
• point 2

What You Can Do
1. step 1
2. step 2
3. step 3`;

    // Choose the model that's appropriate for general text tasks
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `${systemInstruction}\n\nUser Situation:\n${query}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Optionally store the query and response in Firestore for analytics/history
    try {
      await admin.firestore().collection('queries').add({
        query: query,
        language: language,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        // Note: In production, consider not logging full response to save space or for privacy
      });
    } catch (dbError) {
      console.error("Firestore logging failed:", dbError);
    }

    return { text: responseText };

  } catch (error) {
    console.error("Error generating content:", error);
    throw new functions.https.HttpsError(
      "internal",
      "An error occurred while generating legal guidance. Please try again."
    );
  }
});
