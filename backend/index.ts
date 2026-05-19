import express from "express";
import { tavily } from '@tavily/core'
import { streamText } from 'ai'
import { GoogleGenAI } from "@google/genai";
import { PROMPT_TEMPLATE, SYSTEM_PROMPT } from "./prompt";

const client = tavily({ apiKey: process.env.TAVILY_API_KEY });

const app = express();

app.use(express.json());

app.post('/purplexity_ask', async (req, res) => {
    //STEP-1 get the query from the frontend

    const query = req.body.query;

    //STEP-2 check the user has access/conversation

    //STEP-3 check the similar query in the vector db

    //STEP-4 web search the query to gather resources
    const webSearchResponse = await client.search(query, {
        searchDepth: "advanced"
    })

    const webSearchResults = webSearchResponse.results;

    //STEP-5 do some context engineering of the responses

    //STEP-6 Hit the LLM and stream back the response

    const prompt = PROMPT_TEMPLATE
        .replace("{{WEB_SEARCH_RESULTS}}", JSON.stringify(webSearchResults))
        .replace("{{USER_QUERY}}", query)

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // const result = streamText({
    //     model: 'openai/gpt-4.1-mini',
    //     prompt: prompt,
    //     system: SYSTEM_PROMPT,
    // });

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const responseStream = await ai.models.generateContentStream({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            systemInstruction: SYSTEM_PROMPT,
        }
    });

    // res.header('Cache-Control', 'no-cache');
    // res.header('Content-Type', 'text/event-stream');

    // for await (const textPart of result.textStream) {
    //     res.write(textPart);
    // }

    for await (const chunk of responseStream) {
        if (chunk.text) {
            res.write(chunk.text);
        }
    }

    res.write("\n<SOURCES>\n")
    //STEP-7 stream back the resources and follow up questions from another parallel LLM call

    res.write(JSON.stringify(webSearchResults.map(res => ({ url: res.url }))));

    res.write("\n</SOURCES>\n")

    //STEP-8 close the stream
    res.end();
})
app.listen(3000);
