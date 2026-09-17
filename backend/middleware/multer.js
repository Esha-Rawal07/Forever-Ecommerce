import multer from "multer";
import fs from "fs";
import path from "path";

const storage = multer.diskStorage({
    destination:function(req,file,callback){
        const uploadDirectory = path.join(process.cwd(), 'uploads');
        fs.mkdirSync(uploadDirectory, { recursive: true });
        callback(null, uploadDirectory);
    },
    filename:function(req,file,callback){
        callback(null, `${Date.now()}-${file.originalname}`)
    }
})

const upload = multer({storage})

export default upload