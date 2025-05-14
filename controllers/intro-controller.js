
const introController = async (req,res) => {
   try {
    res.status(200).json({
        message : "wellcome to authentication & authrization section",
        data : {
            name : "Lazy"
        }
    })
   } catch (error) {
    res.status(500).json({
        message : "Internal server error",
        error : error.message
    })
   }
}


module.exports = introController;