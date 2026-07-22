const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");


const app = express();

app.use(cors());
app.use(express.json());


// کلید API اینجا قرار می‌گیرد
require("dotenv").config();

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});



app.post("/chat", async (req, res) => {

    try {

        const question = req.body.message;


        const response = await client.chat.completions.create({

            model: "gpt-4.1-mini",

            messages: [

                {
                    role: "system",
                    content:
                    `
                    تو یک دستیار سلامت برای مراقبین بیماران آلزایمر هستی.
                    پاسخ‌های عمومی و دوستانه بده.
                    تشخیص پزشکی انجام نده.
                    دارو تجویز نکن.
                    اگر سوال تخصصی پزشکی بود کاربر را به پزشک ارجاع بده.
                    `
                },

                {
                    role: "user",
                    content: question
                }

            ]

        });


        res.json({

            answer:
            response.choices[0].message.content

        });


    } catch(error) {

        console.log(error);

        res.status(500).json({

            error:"خطا در ارتباط با هوش مصنوعی"

        });

    }

});



app.listen(3000, () => {

    console.log("AI Server running on port 3000");

});
