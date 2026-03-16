const express = require("express")
const cors = require("cors")
const multer = require("multer")
const fs = require("fs")

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static("."))

// storage
const storage = multer.diskStorage({
destination:(req,file,cb)=>{
cb(null,"images")
},
filename:(req,file,cb)=>{
cb(null,Date.now()+"-"+file.originalname)
}
})

const upload = multer({storage})

// load foods
let foods = []

if(fs.existsSync("foods.json")){
foods = JSON.parse(fs.readFileSync("foods.json"))
}

// save foods
function saveFoods(){
fs.writeFileSync("foods.json",JSON.stringify(foods))
}

// get foods
app.get("/foods",(req,res)=>{
res.json(foods)
})

// add food
app.post("/add-food",upload.single("image"),(req,res)=>{

let food={
id:Date.now(),
name:req.body.name,
price:req.body.price,
category:req.body.category,
rating:req.body.rating,
image:"images/"+req.file.filename
}

foods.push(food)

saveFoods()

res.json({message:"food added"})

})

app.post("/rate/:id",(req,res)=>{

let food=foods.find(f=>f.id==req.params.id)

if(food){

food.rating=(Number(food.rating)+Number(req.body.rating))/2

saveFoods()

}

res.json({message:"rated"})

})

// delete
app.delete("/delete-food/:id",(req,res)=>{

foods = foods.filter(f=>f.id != req.params.id)

saveFoods()

res.json({message:"deleted"})

})

app.listen(3000,()=>{
console.log("Server running on port 3000")
})
