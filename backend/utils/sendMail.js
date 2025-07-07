const nodeMailer = require('nodemailer')

function sendEmail(data, link) {
    let transporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            // should be replaced with real sender's account
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        },
    })
    let mailOptions = {
        // should be replaced with real recipient's account
        to: data.email,
        subject: 'بازنشانی گذرواژه',
        text: `سلام ${data.name} برای بازنشانی گذرواژه روی لینک زیر کلیک کنید`,
        html: '<h1>برای تغییر گذرواژه روی لینک زیر کلیک کنید</h1> <br>' + link,
    }
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error)
        }
        console.log('Message %s sent: %s', info.messageId, info.response)
    })
}

const sendSuccessEmail = (data, link) => {
    // console.log(data);

    // let transporter = nodeMailer.createTransport({
    //     host: 'smtp.gmail.com',
    //     port: 465,
    //     secure: true,
    //     auth: {
    //         // should be replaced with real sender's account
    //         user: process.env.EMAIL,
    //         pass: process.env.EMAIL_PASSWORD,
    //     },
    // })
    // let mailOptions = {
    //     // should be replaced with real recipient's account
    //     to: data.email,
    //     subject: ' گذرواژه با موفقیت تغییر یافت',
        // text: `سلام ${data.name}  گذرواژه با موفقیت تغییر یافت. روی لینک زیر کلیک کنید تا وارد سایت شوید`,
        // html: link,
    // }
    // transporter.sendMail(mailOptions, (error, info) => {
    //     if (error) {
    //         return console.log(error)
    //     }
    //     console.log('Message %s sent: %s', info.messageId, info.response)
    // })

    console.log(data);
    console.log(link);
    

    let transporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            // should be replaced with real sender's account
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        },
    })
    let mailOptions = {
        // should be replaced with real recipient's account
        to: data.email,
        subject: 'تغییر گذرواژه',
        html: `سلام ${data.name}  گذرواژه با موفقیت تغییر یافت. روی لینک زیر کلیک کنید تا وارد سایت شوید` + '<br >' + link,
    }
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error)
        }
        console.log('Message %s sent: %s', info.messageId, info.response)
    })
}

module.exports = {
    sendEmail,
    sendSuccessEmail,
}