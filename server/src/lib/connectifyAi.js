import { GoogleGenerativeAI } from "@google/generative-ai";

export const connectifyAi = async (req, res) => {
  try {
    const { prompt } = req.body;
    console.log("Prompt:", prompt);
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);
    console.log(result.response.text());
    res.status(200).json({
      message: "Response sent successfully.",
      response: result.response.text(),
    });
  } catch (error) {
    res.status(500).json({ message: "Quota Exhausted" });
    console.error(error.message);
  }
};
