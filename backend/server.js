const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());


// اتصال به OpenAI
const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
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

            model: "gpt-4.1-mini",

            messages: [

                {
                    role: "system",
                    content: `
تو یک دستیار سلامت برای مراقبین بیماران مبتلا به آلزایمر هستی.

قوانین:
- پاسخ‌ها باید ساده، دوستانه و قابل فهم باشند.
- تشخیص پزشکی انجام نده.
- دارو یا تغییر دوز دارو پیشنهاد نکن.
- در موارد تخصصی پزشکی، کاربر را به پزشک یا متخصص ارجاع بده.
- اطلاعات عمومی درباره مراقبت، حمایت روانی، سبک زندگی و آموزش ارائه کن.
- اگر سوال خارج از حوزه سلامت بود، پاسخ کوتاه و دوستانه بده.
                    `
                },

                {
                    role: "user",
                    content: question
                }

            ],

            temperature: 0.7

        });


        const answer =
            response.choices[0].message.content;


        res.json({
            answer: answer
        });


    } catch (error) {

        console.error("OpenAI Error:", error);


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
