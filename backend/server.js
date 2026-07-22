const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());


// اتصال به OpenRouter
const client = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1"
});


// تست فعال بودن سرور
app.get("/", (req, res) => {
    res.json({
        status: "online",
        message: "Memora AI Server is running"
    });
});


// مسیر چت هوش مصنوعی
app.post("/chat", async (req, res) => {

    try {

        const question = req.body.message;


        if (!question) {
            return res.status(400).json({
                error: "پیام خالی است"
            });
        }


        const response = await client.chat.completions.create({

            // مدل OpenRouter
            model: "meta-llama/llama-3.1-8b-instruct",

            messages: [

                {
                    role: "system",
                    content: `
تو یک دستیار سلامت برای مراقبین بیماران مبتلا به آلزایمر هستی.

قوانین:
- پاسخ‌ها باید ساده، دوستانه و قابل فهم باشند.
- تشخیص پزشکی انجام نده.
- دارو یا تغییر دوز دارو پیشنهاد نکن.
- اگر موضوع تخصصی پزشکی، تشخیص یا درمان بود، کاربر را به پزشک یا متخصص ارجاع بده.
- درباره مراقبت از بیمار آلزایمر، حمایت روانی، سبک زندگی و آموزش اطلاعات عمومی ارائه کن.
- اگر سوال خارج از حوزه سلامت بود، کوتاه و دوستانه پاسخ بده.
`
                },

                {
                    role: "user",
                    content: question
                }

            ],

            temperature: 0.7

        });


        const answer = response.choices[0].message.content;


        res.json({
            answer: answer
        });


    } catch (error) {

        console.error("OpenRouter Error:", error);


        res.status(500).json({

            answer:
            "متأسفانه در حال حاضر امکان دریافت پاسخ هوشمند وجود ندارد. لطفاً دوباره تلاش کنید."

        });

    }

});


// اجرای سرور
const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {

    console.log(
        `AI Server running on port ${PORT}`
    );

});
