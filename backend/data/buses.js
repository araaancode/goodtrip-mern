const { ObjectId } = require('mongodb');

const buses=[
    {
        "driver":new ObjectId("6838d3cb28bd4af58a30d0be"),
        "name":"bus 1",
        "description":"bus 1 description",
        "model":"bus 1 model",
        "price":35644,
        "capacity":10,
        "seats":2,
        "isActive":true,
        "isAvailable":true
    },

    {
        "driver":new ObjectId("6838d3cb28bd4af58a30d0bf"),
        "name":"bus 2",
        "description":"bus 2 description",
        "model":"bus 2 model",
        "price":24541,
        "capacity":10,
        "seats":2,
        "isActive":true,
        "isAvailable":true
    },

    {
        "driver":new ObjectId("6838d3cb28bd4af58a30d0c0"),
        "name":"bus 3",
        "description":"bus 3 description",
        "model":"bus 3 model",
        "price":9878546,
        "capacity":10,
        "seats":10,
        "isActive":true,
        "isAvailable":true
    },

    {
        "driver":new ObjectId("6838d3cb28bd4af58a30d0c1"),
        "name":"bus 4",
        "description":"bus 4 description",
        "model":"bus 4 model",
        "price":987561,
        "capacity":10,
        "seats":10,
        "isActive":true,
        "isAvailable":true
    },

    {
        "driver":new ObjectId("6838d3cb28bd4af58a30d0c2"),
        "name":"bus 5",
        "description":"bus 5 description",
        "model":"bus 5 model",
        "price":21564,
        "capacity":10,
        "seats":10,
        "isActive":true,
        "isAvailable":true
    }
]

module.exports = buses