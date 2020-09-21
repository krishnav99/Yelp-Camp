var mongoose=require("mongoose");

// schema for campgrounds

var campgroundSchema= new mongoose.Schema({
	name: String,
	image: String,
	price: String,
	description: String,
	comments:[
		{
			type:mongoose.Schema.Types.ObjectId,
			ref:"Comment"
		}
	],
	author:{
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String,
	}
});

// make this into a model

module.exports=mongoose.model("Campground",campgroundSchema);
