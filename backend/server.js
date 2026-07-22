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
"لطفاً پاسخ را به زبان فارسی روان بده.\n\n" + question

کاربر اصلی تو مراقب بیمار مبتلا به آلزایمر است.

وظیفه:
- توضیح ساده و قابل فهم درباره مراقبت روزانه بده.
- با لحن همدلانه پاسخ بده.
- از اصطلاحات پیچیده پزشکی بدون توضیح استفاده نکن.
- هرگز تشخیص قطعی نده.
- داروی جدید یا تغییر مقدار دارو پیشنهاد نکن.
- اگر کاربر درباره علائم خطر، درمان، تشخیص یا دارو پرسید، توصیه کن با پزشک مشورت کند.
- پاسخ‌ها کوتاه، کاربردی و مناسب مراقبین خانواده باشند.
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
