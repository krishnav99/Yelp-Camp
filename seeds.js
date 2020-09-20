var mongoose=require("mongoose");
var Campground=require("./models/campground");
var Comment=require("./models/comment");

var data=[ 
	{
		name:"Sahale Glacier Camp",
		image:"https://i.insider.com/5b56542a51dfbe25008b462f?width=700&format=jpeg&auto=webp",
		description:"According to Time For A Hike, Sahale Glacier Camp is one of the best campsites in the US National Park System.Individual campsites are nestled among rock walls you can reach by hiking through North Cascades National Park. There, you'll camp next to the Sahale Glacier, among the mountains of the North Cascades. A backcountry permit is required to camp there, so it isn't for beginners, but experienced campers and hikers will see some of the most beautiful views in the US."
	},
	{
		name:"EcoCamp Patagonia",
		image:"https://i.insider.com/5ed0246f3f73702eba36be36?width=700&format=jpeg&auto=webp",
		description:"If sleeping in a tent on the floor isn't your thing but you still feel intrigued by camping, you should try glamping. One of the best places to do that is EcoCamp Patagonia in Chile. EcoCamp uses geodesic domes that are comfortable, but still give you the feel of being outdoors. The sites are located at the foot of the Torres del Paine National Park, which will give you an incredible view of the mountain peaks."		
	},
	{
		name:" Waldseilgarten Höllschlucht",
		image:"https://i.insider.com/5ed13edd988ee326725f1526?width=700&format=jpeg&auto=webp",
		description:"If you're looking for a truly unique experience, head to Germany. Located in the German Alps, Waldseilgarten Höllschlucht allows you to try out tree camping, which means campers stay in tents that are hung from tree branches high up in the forest canopy. If you manage to get up there (by rope), you'll get incredible views of the Pfronten mountains by the Austrian border."
	},
]

/////////////////////////////////////////////////////////////////
function seedDB(){
	// remove data from campground
	Campground.deleteMany({},function(err){
		if(err){
			console.log(err);
		}
		console.log("removed");
		// add a few camprounds
		data.forEach(function(seed){
			Campground.create(seed,function(err,campground){
				if(err){
					console.log(err);
				}
				else{
					// create comment
					Comment.create(
						{
							text:"This place is great but i wish there was Internet",
							author:"Horibola"
						},function(err,comment){
							if(err){
								console.log(err);
							}
							else{
								campground.comments.push(comment);
								campground.save();
							}
					});
				}
			});
		});	
	})
}

module.exports=seedDB;