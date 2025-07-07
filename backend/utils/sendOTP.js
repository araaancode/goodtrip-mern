var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Accept", "text/plain");
myHeaders.append("x-api-key", "N5eNg8fTJgsLXYn3P2HI5uCTd9hyxSjXPqwU5ECb0iWBbUTsLjHFtrLV9dn0aPU9");

const sendOTPUtil = async (otp,phone) => {
    var raw = JSON.stringify({
        "mobile": phone,
        "templateId": "169619",
        "parameters": [
            { name: 'code', value: JSON.stringify(otp) },
        ],
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    await fetch("https://api.sms.ir/v1/send/verify", requestOptions).then(() => {
        console.log("send otp");
    }).catch((err) => {
        console.log(err);
    })
}



module.exports = sendOTPUtil
