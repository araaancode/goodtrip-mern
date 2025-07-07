const { ObjectId } = require('mongodb');

const drivers=[
    {
        "_id":new ObjectId("6838d3cb28bd4af58a30d0be"),
        "name":"driver 1",
        "username":"driver1",
        "phone":"09383901140",
        "email":"driver1@gmail.com",
        "password":"12345678",
        "firstCity":"اصفهان",
        "lastCity":"تهران",
        "movingDate":"1404/03/14",
        "returningDate":"1404/03/16"
    },

    {   
        "_id":new ObjectId("6838d3cb28bd4af58a30d0bf"),
        "name":"driver 2",
        "username":"driver2",
        "phone":"09383901141",
        "email":"driver2@gmail.com",
        "password":"12345678",
        "firstCity":"اصفهان",
        "lastCity":"تهران",
        "movingDate":"1404/03/14",
        "returningDate":"1404/03/16"
    },

    {   
        "_id":new ObjectId("6838d3cb28bd4af58a30d0c0"),
        "name":"driver 3",
        "username":"driver3",
        "phone":"09383901142",
        "email":"driver3@gmail.com",
        "password":"12345678",
        "firstCity":"یزد",
        "lastCity":"اهواز",
        "movingDate":"1404/03/10",
        "returningDate":"1404/03/11"
    },

    {   
        "_id":new ObjectId("6838d3cb28bd4af58a30d0c1"),
        "name":"driver 4",
        "username":"driver4",
        "phone":"09383901143",
        "email":"driver1@gmail.com",
        "password":"12345678",
        "firstCity":"اهواز",
        "lastCity":"تهران",
        "movingDate":"1404/03/11",
        "returningDate":"1404/03/12"
    },
    
    {   
        "_id":new ObjectId("6838d3cb28bd4af58a30d0c2"),
        "name":"driver 5",
        "username":"driver5",
        "phone":"09383901144",
        "email":"driver4@gmail.com",
        "password":"12345678",
        "firstCity":"تهران",
        "lastCity":"آبادان",
        "movingDate":"1404/03/10",
        "returningDate":"1404/03/11"
    }
]

module.exports = drivers