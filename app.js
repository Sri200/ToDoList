const express=require("express");
const bodyparse=require("body-parser");
const mongoose=require('mongoose');
const app=express();
app.set("view engine","ejs");
app.use(bodyparse.urlencoded({extended:true}));
app.use(express.static("public"));
MONGO_URL="mongodb+srv://parasaramsriharsha:%23Gamerstag2002@cluster0.rlz3icj.mongodb.net/toDoListDB";
ORIGIN="http://localhost:3000"
mongoose.connect(MONGO_URL,{useNewUrlParser:true}).then(()=>{
    console.log("Connected to the Database. Yayzow!");
})
.catch(err => {
    console.log(err);
});
const itemsSchema={
    name:String
};
const Item=mongoose.model("item",itemsSchema);
const item1=new Item({
    name:"Eat"
});
const item2=new Item({
    name:"Drink"
});
const item3=new Item({
    name:"Sleep"
});
const allit=[item1,item2,item3];
/*Item.insertMany(allit).then(function () {
    console.log("Successfully saved defult items to DB");
  })
  .catch(function (err) {
    console.log(err);
  });*/
app.get("/",function(req,res){
    var today=new Date();
    var options={
        weekday:"long",
        day:"numeric",
        month:"long"
    };
    var day=today.toLocaleDateString("en-US",options);
    Item.find({}).then(function(foundItems){
        if(foundItems.length==0)
        {
            Item.insertMany(allit).then(function () {
                console.log("Successfully saved defult items to DB");
              })
              .catch(function (err) {
                console.log(err);
              });
              res.redirect("/");
        }
        else{
        res.render("list",{wday:day,newListItem:foundItems});}
    }).catch(function(err){
        console.log(err);
    })
});
app.post("/",function(req,res){
    var itemname=req.body.newItem;
    const item=new Item({
        name:itemname
    });
    item.save();
    res.redirect("/");
});
app.post("/delete",function(req,res){
    const checked=req.body.checkbox;
    Item.findByIdAndRemove(checked).then(function(){
            console.log('Successfully deleted');
    }).catch(function(err){
        console.log(err);
    });
    res.redirect("/");
});
app.listen(process.env.ORIGIN || 3000,function(){
    console.log("Started listening");
});