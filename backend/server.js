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


// تست سرور
app.get("/", (req, res) => {

    res.json({
        status: "online",
        message: "Memora AI Server is running"
    });

});


// مسیر چت
app.post("/chat", async (req, res) => {

    try {

        const question = req.body.message;


        if (!question) {

            return res.status(400).json({
                error: "پیام خالی است"
            });

        }



        const response = await client.chat.completions.create({

            // مدل بهتر برای فارسی
            model: "meta-llama/llama-3.2-3b-instruct:free"


            messages: [

                {
                    role: "system",

                    content: `
تو دستیار هوشمند سلامت اپلیکیشن «همیار» هستی.

مخاطب تو مراقبین و خانواده بیماران مبتلا به آلزایمر هستند.

وظایف:
- به زبان فارسی روان، طبیعی و قابل فهم پاسخ بده.
- لحن تو مهربان، آرام و حمایت‌کننده باشد.
- پاسخ‌ها را کوتاه و کاربردی بنویس.
- از جملات رباتی و ترجمه ماشینی استفاده نکن.
- اگر اصطلاح پزشکی استفاده کردی، آن را ساده توضیح بده.

محدودیت‌ها:
- تشخیص پزشکی قطعی انجام نده.
- داروی جدید پیشنهاد نکن.
- مقدار یا دوز دارو را تغییر نده.
- در مسائل مربوط به درمان، تشخیص یا شرایط خطرناک، کاربر را به پزشک ارجاع بده.

موضوعات اصلی:
- مراقبت روزانه بیمار آلزایمر
- مدیریت رفتارهای دشوار
- حمایت روانی مراقب
- تغذیه، خواب، فعالیت و ایمنی بیمار

اگر سوال خارج از حوزه سلامت بود، کوتاه و دوستانه پاسخ بده.
`
                },


                {
                    role: "user",

                    content: `
لطفاً پاسخ را به فارسی روان ارائه کن.

سوال کاربر:
${question}
`
                }

            ],


            temperature: 0.4,


            max_tokens: 500

        });



        const answer =
            response.choices[0].message.content;



        res.json({

            answer: answer

        });



    } catch (error) {


        console.error(
            "OpenRouter Error:",
            error
        );


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
