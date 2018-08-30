var bodyParser   =require("body-parser"),
methodOverride   =require("method-override"),
expressSanitizer =require("express-sanitizer"),
mongoose         =require("mongoose"),
express          =require("express"),
app              =express();

//App Config
mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));


//Mongoose Model Config
var blogSchema = new mongoose.Schema({
	title:String,
	image:String,
	body:String,
	created:{type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);



//Restful Routes

app.get("/",function(req,res){
	res.redirect("/blogs");
});



app.get("/blogs",function(req,res){
	Blog.find({},function(err,blogs){
		if(err)
		{
			console.log("ERROR!");
		}
		else
		{
			res.render("index",{blogs:blogs});
		}
	});
});



app.post("/blogs",function(req,res){

	req.body.blog.body=req.sanitize(req.body.blog.body);
	Blog.create(req.body.blog,function(err,newBlog){
		if(err)
		{
			res.render("new");

		}
		else
		{
			res.redirect("/blogs");
		}
	});

});





app.get("/blogs/new",function(req,res){
	res.render("new")
})


app.get("/blogs/:id",function(req,res){
	Blog.findById(req.params.id,function(err,foundBlog){
		if(err)
		{
			res.redirect("/blogs");
		}
		else
		{
			res.render("show",{blog:foundBlog});
		}
	});
});


app.get("/blogs/:id/edit",function(req,res){
	Blog.findById(req.params.id,function(err,foundBlog){
		if(err)
		{
			res.redirect("/blogs");
		}
		else
		{
			res.render("edit",{blog:foundBlog});
		}

	});
});

app.put("/blogs/:id",function(req,res){
	req.body.blog.body=req.sanitize(req.body.blog.body);
	
	//Blog.findByIdAndUpdate(Id to be updated,New Values from Form,Call Back)
	Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
		if(err)
		{
			res.redirect("/blogs");
		}
		else
		{
			res.redirect("/blogs/" + req.params.id);
		}
	});
});


app.delete("/blogs/:id",function(req,res){
	Blog.findByIdAndRemove(req.params.id,function(err){
		if(err)
		{
			console.log(err);
		}
		else
		{
			res.redirect("/blogs");
		}
	});
});


 



app.listen(9000, function () {
    console.log("Server Has Started!")
});




// Blog.create({
// 	title:"Test Blog",
//     image:"https://images.pexels.com/photos/355988/pexels-photo-355988.jpeg?w=940&h=650&auto=compress&cs=tinysrgb",
//     body: "Hello This is Blog Post"
// });