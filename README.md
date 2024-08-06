# TL;DR Bot UI
UI for demo LLM app

This app allows users to upload a PDF or Text file and ask an AI questions about the document's contents.


Things that can be improved:

1. The conversation history is reformated to account for the differences between OpenAI & Llama at each interaction. This should happen once each time the LLM provider is changed.
2. Add User login to allow for controlled access to documents. The contents of uploaded documents would only be available to specific Users or Departments.
3. PDFs and TXT files should be uploaded directly to cloudstorage, then be processed for vector db ingestion.
4. Add an Admin page for VectorDB file management; listing, deletion.

## Install dependecies
`cd tldr-bot-ui`

`npm install`


## Configure
In the project root folder, create a .env file with the following:

REACT_APP_BACKEND_HOST='http://127.0.0.1:8000'

## Run the ui
`npm start`

Navigate to http://localhost:3000
