import mongoose from "mongoose";

const connectdb = async () => {
    try {
       const connectionInstance =  await mongoose.connect(`${process.env.MONGOURI}/authentication`);
       console.log(`Mongodb connected !! ${connectionInstance.connection.host}`);
       
    } catch (error) {
        console.log('mongodb error while connecting',error);
        process.exit();
    }
}

export default connectdb