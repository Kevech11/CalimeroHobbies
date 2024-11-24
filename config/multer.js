import multer from "multer"
import path from "path"

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(import.meta.dirname, "../Public/Pages/Productos/img"))
  },
  filename: function (req, file, cb) {
    const uniqueSuffix =
      Date.now() + "-" + file.originalname.split(" ").join("_")
    cb(null, uniqueSuffix)
  },
})

const upload = multer({ storage: storage })
export { upload }
