import mongoose from "mongoose"

const clientSchema = new mongoose.Schema


const Client = mongoose.model("Client", clientSchema)

export default Client