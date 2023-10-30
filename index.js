const PDFExtract = require('pdf.js-extract').PDFExtract;
const pdfExtract = new PDFExtract();
const { Configuration, OpenAIApi } = require("openai");
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();
const directoryPath = 'related';

const configuration = new Configuration({
    apiKey: process.env.OPEN_AI_KEY,
  });

const openai = new OpenAIApi(configuration);

let readPage = (page) => {
    const lines = PDFExtract.utils.pageToLines(page, 2);
    const rows = PDFExtract.utils.extractTextRows(lines);
    let row = ""
    let text = rows.map((row) => row.join("")).join("\n");
    console.log("_____________________________________________________")
    console.log(text)
    console.log("_____________________________________________________")
    run(text)
    //srows.map(processRow);
}

let processRow = (row) => {
    console.log(row)
}

async function processFiles() {
    try {
        const files = await fs.promises.readdir(directoryPath);
        for (const file of files) {
            //console.log(file)
            const data = await pdfExtract.extract(`./${directoryPath}/${file}`, {});
            data.pages.forEach(page => readPage(page))
            //console.log(data);
        }
    } catch(err) {        
        console.log(err)
    }
}

let run = async (text) => {
    let prompt = `Summarize the text in triple quotes named 'Review Text': \
      
    Review text: '''${text}'''`

    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{role: "user", content: prompt}],
      });
      //console.log*"RUN ASYNC___"
      console.log(completion.data.choices[0].message);
}

processFiles()
