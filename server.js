const express = require("express")
const api = express()
const mongoose = require("mongoose")

const flatSchema = new mongoose.Schema({
    address_full: {
        type: String,
        required: true
    },
    district: String,
    area_sqm: Number,
    rooms: {
        type: Number,
        default: 1
    },
    rent: Number,
    landlord: String
}, {versionKey: false})

const Flat = mongoose.model("flat", flatSchema)

// CONNECT TO MONGODB
const connOptions = {
    useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false
}
const dbName = "flats"
mongoose.connect(`mongodb://localhost/${dbName}`, connOptions)

// USE JSON MIDDLEWARE, SO WE CAN CALL OUR API WITH FETCH & JSON DATA FROM THE BROWSER
api.use(express.json())

// CORS
api.use((req, res, next) => {
    res.set("ACCESS-CONTROL-ALLOW-ORIGIN", "*")
    res.set("ACCESS-CONTROL-ALLOW-HEADERS", "*")
    res.set("ACCESS-CONTROL-ALLOW-METHODS", "*")
    next()
})

// OPEN THE PORT
api.listen(3000, () => console.log("Listening on port 3000"))

// GET ALL FLATS
api.get("/flat", (req, res, next) => {
    Flat.find()
    .then(flats => {
        res.send(flats)
    })
})

// GET ONE FLAT
api.get("/flat/:id", (req, res, next) => {
    let id = req.params.id
    console.log("Param: ",  id)

    Flat.findById(id)
    .then(flat => {
        res.send(flat)        
    })
    .catch(err => next(err))
})

// CREATE FLAT
api.post("/flat", (req, res, next) => {
    let flatPosted = req.body
    console.log("Flat posted:", flatPosted)

    Flat.create(flatPosted)
    .then(flatCreated => {
        res.send(flatCreated)
    })
    .catch(err => next(err))
})

// UPDATE FLAT
api.patch("/flat/:id", (req, res, next) => {
    let id = req.params.id
    let flatUpdate = req.body
    console.log("Param: ", id)
    console.log("Flat patch sent:", flatUpdate)

    // the option {new: true} causes that we get 
    // the UPDATED document back after update operation.
    // The default behaviour is to get back the old document
    // (=> document how it was BEFORE the update)
    Flat.findByIdAndUpdate(id, flatUpdate, {new: true})
    .then(flatUpdated => res.send(flatUpdated))
    .catch(err => next(err))
})

api.delete("/flat/:id", (req, res, next) => {
    let id = req.params.id
    console.log("Param:", id)
    
    Flat.findByIdAndDelete(id)
    .then(flatDeleted => res.send(flatDeleted))
    .catch(err => next(err))
})

/**
 * FETCH statements:
 * 
 * GET: fetch('http://localhost:3000/flat')
 * GET: fetch('http://localhost:3000/flat/15')
 * POST: fetch('http://localhost:3000/flat', 
{method: "POST", 
headers: {"Content-Type": "application/json" },
body: JSON.stringify({    
    address_full: "Turmstraße 33, 10551 Berlin",
    district: "Tiergarten",
    area_sqm: 65,
    rent: 645,
    landlord: "Flatify GmbH"
})}
)
.then(res => res.json())
.then(data => console.log(data))

   PATCH: fetch('http://localhost:3000/flat/15', {
             method: "PATCH", headers: {"Content-Type": "application/json"},
             body: JSON.stringify({firstname: "FirstnameNew", lastname: "LastnameNew"})
         })
   DELETE: fetch('http://localhost:3000/flat/7', { method: "DELETE" })
         })
*/
