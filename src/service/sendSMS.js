const config = require('../../config.app')

module.exports= async(phone,code)=>{
    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Api-Key", config.sms.apiKey);
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "code": config.sms.patternCode,
        "attributes": {
            "code": code
        },
        "recipient": phone,
        "line_number": "50002178584000",
        "number_format": "english"
    });
    console.log(raw);
    

    const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
    };

    fetch("https://api.iranpayamak.com/ws/v1/sms/pattern", requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log(error));
    
    
}