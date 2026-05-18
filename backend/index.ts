import express from "express";

const app = express();

app.use(express.json());

app.post('/conversation', (req, res) => {
    //STEP-1 get the query from the frontend

    //STEP-2 check the user has access/conversation

    //STEP-3 check the similar query in the vector db

    //STEP-4 web search the query to gather resources

    //STEP-5 do some context engineering of the responses

    //STEP-6 Hit the LLM and stream back the response

    //STEP-7 stream back the resources and follow up questions from another parallel LLM call

    //STEP-8 close the stream
})
app.listen(3000);
