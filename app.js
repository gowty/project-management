var express               = require("express"),
    mongoose              = require("mongoose"),
    passport              = require("passport"),
    bodyParser            = require("body-parser"),
    flash                 = require("connect-flash"),
    methodOverride        = require("method-override"),
    User                  = require("./models/user"),
    Develop               = require("./models/user"),
    LocalStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose")

var app = express();
mongoose.connect("mongodb://localhost/working");
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));

//USE PACKAGES
app.use(require("express-session")({
  secret:"dashboard",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


var appSchema = new mongoose.Schema({
    id           : String,
    projectname  : String,
    status       : String,
    assignedto   : String,
    date         : String,
    duedate      : String,
    description  : String,
    totalpayment : String,
    advance      : String,
    balance      : String,
    report       : String,
    customername : String,
    contactnumber: String,
    address      : String,
    sellingprice : String,
    advancee      : String,
    balancee      : String
});

var App = mongoose.model("App",appSchema);  





var searchSchema = new mongoose.Schema({
   info   : String
});

var Search = mongoose.model("Search",searchSchema);


app.get("/",function(req,res){
    res.render("index");
});
//
//app.get("/dashboard",isLoggedIn, function(req,res){
//    res.render("home");
//});

//admin

app.get("/register",function(req,res){
    res.render("register");
});

app.get("/login",function(req,res){
    res.render('login', { user: req.user, message: req.flash('error') });
});
//end

//develop

app.get("/register2",function(req,res){
    res.render("register2");
});

app.get("/login2",function(req,res){
    res.render('login2', { user: req.user, message: req.flash('error') });
});

//end

app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/login")
});


app.get("/logout2",function(req,res){
    req.logout();
    res.redirect("/login2")
});


app.get("/add",function(req,res){
    res.render("addproject");
});

app.get("/addcustomer",function(req,res){
    res.render("addcustomer");
});

app.get("/adminreport",function(req,res){ 
    res.render("adminreport");
});

//app.get("/dashboard2",function(req,res){ 
//    res.render("dashboard2");
//});



app.get("/payments",function(req,res){
     App.find({},function(err,any){
        if(err){
            console.log(err);
            
        }else {
           
                res.render("payments",{any:any});
            }
        }); 
});

//   start of customer

app.get("/customer",function(req,res){
      App.find({},function(err,all){
        if(err){
            console.log(err);
            
        }else {
           
                res.render("customer",{all:all});
            }
        });
}); 

app.get("/addcustomer",function(req,res){
    
    res.render("addcustomer");
});


//add customer

app.get("/customer/:id",function(req,res){
     
    App.findById(req.params.id,function(err,click){
        if(err){
            console.log(err);
        } else {
    res.render("addcustomer",{passing:click});        
        }
   });
});

app.put("/a/:id",function(req,res){
    App.findByIdAndUpdate(req.params.id,req.body.custo,function(err,updated){
        if(err){
            res.redirect("/customer");
        }  else {
            res.redirect("/customer");    
        }
    });
    
});


//edit customer

app.get("/edit/:id",function(req,res){
     
    App.findById(req.params.id,function(err,click){
        if(err){
            console.log(err);
        } else {
    res.render("editcustomer",{passing:click});        
        }
   });
});

app.put("/b/:id",function(req,res){
    App.findByIdAndUpdate(req.params.id,req.body.edit,function(err,updated){
        if(err){
            res.redirect("/customer");
        }  else {
            res.redirect("/customer");    
        }
    });
    
});


/*
app.post("/addingcustomer",function(req,res){
    var   customername =   req.body.customername,
    contactnumber=   req.body.contactnumber,
    address      =   req.body.address,
    sellingprice =   req.body.sellingprice,
    advancee     =   req.body.advancee,
    balancee     =   req.body.balancee; 
    
    var details = {customername:customername,contactnumber:contactnumber,address:address,sellingprice:sellingprice,advacee:advancee,balancee:balancee}
    
      App.create(details,function(err,details){
        if(err){
            console.log(err);
        } else{
        console.log(details)
        }
    }); 
    res.redirect("/customer");
})


*/



//end of customer


/*
app.get("/dashboard",function(req,res){
    App.find({},function(err,all){
        if(err){
            console.log(err);
            
        }else {
            console.log(all.length );
            for(var i=0; i<all.length ;i++) {
                console.log(all[i])
                var s = all[i];
                res.render("home",{s:s});
            }
        }
        
    });
    
});  */
  

//add projects

//ADMIN REGISTER

app.post("/register",function(req,res){
    req.body.position
    req.body.firstname
    req.body.lastname
    req.body.email
    req.body.phonenumber
    req.body.username
    req.body.password
    User.register(new User({position: req.body.position,firstname: req.body.firstname,lastname: req.body.lastname,email: req.body.email,phonenumber: req.body.phonenumber,username: req.body.username}),req.body.password,function(err,user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/login");
        });
    }); 
});
//===================================


//LOGIN 

app.post("/login",passport.authenticate("local",{
    successRedirect: "/dashboard",
    failureRedirect: "/login",
    failureFlash: true
}),function(req,res){
    res.render('/');
});

//===================================


//IS LOGDEDIN FUNCTION
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
       return next();
       }
    res.redirect("/login");
}

//================================

//develop login

app.post("/register2",function(req,res){
    req.body.position
    req.body.firstname
    req.body.lastname
    req.body.email
    req.body.phonenumber
    req.body.username
    req.body.password
    
    Develop.register(new Develop({position: req.body.position,firstname: req.body.firstname,lastname: req.body.lastname,email: req.body.email,phonenumber: req.body.phonenumber,username: req.body.username}),req.body.password,function(err,user){
        if(err){
            console.log(err);
            return res.render("register2");
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/login2");
        });
    }); 
});
//===================================


//LOGIN 

app.post("/login2",passport.authenticate("local",{
    successRedirect: "/dashboard2",
    failureRedirect: "/login2",
    failureFlash: true
}),function(req,res){
    res.render('/');
});

//===================================


//IS LOGDEDIN FUNCTION


//================================



app.get("/dashboard",isLoggedIn,function(req,res){
    App.find({},function(err,all){
        if(err){
            console.log(err);
            
        }else {
                res.render("home",{all:all});
            }
        });
        
    });
    

app.post("/form",function(req,res){
    
var id           =   req.body.id,
    projectname  =   req.body.projectname,
    status       =   req.body.status,
    assignedto   =   req.body.assignedto,
    date         =   req.body.date,
    duedate      =   req.body.duedate,
    description  =   req.body.description,
    totalpayment =   req.body.totalpayment,
    advance      =   req.body.advance,
    balance      =   req.body.balance,
    customername =   req.body.customername,
    contactnumber=   req.body.contactnumber,
    address      =   req.body.address,
    sellingprice =   req.body.sellingprice,
    advancee     =   req.body.advancee,
    balancee     =   req.body.balancee; 
    
var form         =   {id:id,projectname:projectname,status:status,assignedto:assignedto,date:date,duedate:duedate,description:description,totalpayment:totalpayment,advance:advance,balance:balance,customername:customername,contactnumber:contactnumber,address:address,sellingprice:sellingprice,advacee:advancee,balancee:balancee};
    
    App.create(form,function(err,form){
        if(err){
            console.log(err);
        } else{
        console.log(form)
        }
    }); 
    res.redirect("/dashboard");
});


//end of add projects



//searching

app.post("/getting",function(req,res){
    if(req.body.info){
       var day = req.body.info;
        App.find({id:day},function(err,all){
            if(err){
                console.log(err);
                  } else {
                        res.render("home",{all:all});
                               }
                 });
    }
     else 
         {
                res.redirect("/dashboard");   
         }   
    
});




//end of searching






//   edit projects 

app.get("/dashboard/:id",function(req,res){
     
    App.findById(req.params.id,function(err,click){
        if(err){
            console.log(err);
        } else {
    res.render("edit",{passing:click});        
        }
   });
});

app.put("/:id",function(req,res){
    App.findByIdAndUpdate(req.params.id,req.body.edit,function(err,updated){
        if(err){
            res.redirect("/dashboard");
        }  else {
            res.redirect("/dashboard");    
        }
    });
    
});


//end of edit projects



//deleting projects
app.delete("/dashboard/:id",function(req,res){
    App.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/dashboard");
        } else {
            res.redirect("/dashboard");
        }
    }); 
});

//end of deleting projects






//   updating payment 

app.get("/payments/:id",function(req,res){
     
    App.findById(req.params.id,function(err,sending){
        if(err){
            console.log(err);
        } else {
    res.render("editpayment",{sending:sending});        
        }
   });
});

app.put("/editpayment/:id",function(req,res){
    App.findByIdAndUpdate(req.params.id,req.body.edit,function(err,updated){
        if(err){
            res.redirect("/payments");
        }  else {
            res.redirect("/payments");    
        }
    });
    
});


//end of updating payment


//start of admin reports

app.get("/adminreport",function(req,res){
    
    res.render("adminreport");
}); 


//end of admin reports







//developer page

       
app.get("/dashboard2",function(req,res){
    App.find({},function(err,all){
        if(err){
            console.log(err);
            
        }else {
           
                res.render("developer",{all:all});
            }
        });
        
    });


//start of developer report

app.get("/developerreport",function(req,res){
    
    res.render("developerreport");
}); 

//end of developer report

  

//searching

app.post("/gettingg",function(req,res){
    if(req.body.info){
       var day = req.body.info;
        App.find({id:day},function(err,all){
            if(err){
                console.log(err);
                  } else {
                        res.render("developer",{all:all});
                               }
                 });
    }
     else 
         {
                res.redirect("/dashboard2");   
         }   
    
});


//end of searching




//end of developer page




app.listen(3003,function(req,res){
    
    console.log("server started");
});