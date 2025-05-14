const { default: mongoose } = require("mongoose");


const imageSchema = new mongoose.Schema({
    url  : {
        type: String,
        required: true
    } ,
   publicId :  {
        type : String,
        required: true
    },
    uploadedBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        require  : true
    },
        createdAt : {
            type : Date,
            default : Date.now
        }
    }, {timestamps : true}
)

const ImageUpload = mongoose.model("ImageUpload", imageSchema);
module.exports = ImageUpload;