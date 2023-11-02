import express, { response } from "express";
import axios from "axios";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";
import process from "process";
import { authenticate } from "@google-cloud/local-auth";
import { google } from "googleapis";
import { GoogleAuth } from "google-auth-library";

const app = express();
const port = 3000;
const gapiUrl = "https://sheets.googleapis.com/v4/spreadsheets/"
const spreadsheetId = "1e3KHzLfyG86_a7cJGKqDEooifwjQeXsH5WElaQgy3EE";
const range = "2023 Expenses!B975:G975";

const auth = new GoogleAuth({
    scopes: 'https://www.googleapis.com/auth/spreadsheets',
});

const service = google.sheets({ version: 'v4', auth });

const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');


const yourBearerToken = "ya29.a0AfB_byBboj03JZGgzYv5OnNZPg6rRk0pMx9_Tj_bZEYX2jd2Y8nEvWcG9yTjKfida9EeMjAL-zRgoANMKUW8X9Vj4AjssjT_TdWSc5ZgEQ9YGBP0ILi9zmQLU29ehCACcnFxQMsDuTeEVSfhhmicl914GVtr_T1dWuj1aCgYKAdMSARASFQGOcNnCTmo6hPsL9orMe2s4aQZ3Lg0171";
const getConfig = {
    headers: {
        Authorization: `Bearer ${yourBearerToken}`,
        Accept: "application / json"
    },
    params : {
        "ranges": "2023 Expenses"
    }
};
const postConfig = {
    params: {
        "includeValuesInResponse": true,
        "responseDateTimeRenderOption": "FORMATTED_STRING",
        "responseValueRenderOption": "FORMATTED_VALUE",
        "valueInputOption": "USER_ENTERED"
    },
    headers: {
        Authorization: `Bearer ${yourBearerToken}`,
        Accept: "application / json"
    },
};


app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
    try {
        const result = await axios.get(gapiUrl + spreadsheetId, getConfig);
        console.log(result.data.sheets);
        res.render("index.ejs");
    } catch (error) {
        console.log(error.response);
    }
});

app.post("/post-expense", async (req, res) => {
    let values = [
        [
            req.body.month, null, req.body.category, req.body.expense, null, req.body.notes
        ],
    ];
    const resource = {
        values,
    };
    try {
        const result = await axios.put(gapiUrl + spreadsheetId + "/values/" + range, resource, postConfig);
        res.redirect("/");
    } catch (error) {
        console.log(error.response.data);
    }
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});