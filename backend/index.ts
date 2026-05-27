import express from "express";
import cors from "cors";
import { tavily } from '@tavily/core'
import { streamText } from 'ai'
import { GoogleGenAI } from "@google/genai";
import { PROMPT_TEMPLATE, SYSTEM_PROMPT } from "./prompt";
import middleware from "./middleware";
import { prisma } from "./db";
import { createConversation } from "./helpers";

const client = tavily({ apiKey: process.env.TAVILY_API_KEY });

const app = express();

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));
app.use(express.json());

app.post('/purplexity_ask', middleware, async (req, res) => {
    //STEP-1 get the query from the frontend

    const { conversationId, query } = req.body;


    const conversation = conversationId
        ? await prisma.conversation.findUnique({ where: { id: conversationId }})
        : await createConversation(query, req.userId);

    if (!conversation) {
        res.status(404).json({ error: "Conversation not found" });
        return;
    }

    await prisma.message.create({
        data: {
            role: "user",
            content: query,
            conversationId: conversation.id,
        },
    });

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


app.get('/conversations', middleware, async (req, res) => {
    try {
        const conversations = await prisma.conversation.findMany({ where: { userId: req.userId }, select: { title: true, slug: true } });
        res.status(200).json(conversations);
    } catch (error) {
        res.status(403).json({ error });
    }
})

app.get('/conversations/:conversationId', middleware, async (req, res) => {
    try {
        const conversationId = JSON.stringify(req.params.conversationId);

        const conversations = await prisma.conversation.findUnique({ where: { id: conversationId, userId: req.userId }, include: { messages: true } })

        res.status(200).json(conversations);
    } catch (error) {
        res.status(403).json({ error: error });
    }

})

app.listen(3001);
