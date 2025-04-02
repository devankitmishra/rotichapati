import express from "express"
import { addFood, listFood, removeFood, searchFood, updateFood } from "../controllers/foodController.js"
import multer from "multer"

const foodRouter = express.Router();


const storage = multer.diskStorage({
    destination: "uploads",
    filename:(req,file,cb)=>{
        return cb(null,`${Date.now()}${file.originalname}`)
    }
})

const upload = multer({storage:storage})

foodRouter.post("/add",upload.single("image"),addFood)

foodRouter.get("/list",listFood)

foodRouter.post("/remove",removeFood)

foodRouter.get("/search", searchFood);

foodRouter.post("/update", upload.single("image"), updateFood);




export default foodRouter;
