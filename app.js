//jshint esversion:6
const nodemon = require("nodemon");
const bodyParser = require('body-parser');
const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash')
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const res = require("express/lib/response");
const { restart } = require("nodemon");
const app = express();



/////////////////// Middleware  /////////////////////
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@todo-list.ehgen.mongodb.net/TodoDB?retryWrites=true&w=majority`, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
});

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);


const ListItemSchema = new mongoose.Schema({
    content: String,
    status: String
});

const ListItem = new mongoose.model('ListItem', ListItemSchema);

const themeSchema = new mongoose.Schema({
    isDark: Boolean
});

const Theme = new mongoose.model('Theme', themeSchema);

Theme.find({}, function(err, docs){
  if(err) console.log(err)
  else {
    if(docs.length < 1 ) {
      Theme.create({isDark: true})
    }
  }
})




app.get("/", function(req, res, next){

  ListItem.find({}, function(err, foundItems){
    if(err) console.log(err);
    else {
      Theme.findOne(function(err, doc){
        if(err) console.log(err);
        else {
          if(doc.isDark) res.render("index-dark", {items: foundItems});
          else res.render("index-light", {items: foundItems})
        }
      })
    };
  });
})

app.post("/create-new-item", function(req, res, next){ 
  const newItem = {content: req.body.newItem, status: "active"};
  ListItem.create(newItem);
  console.log("new item created")
  res.redirect("/")
});

app.post("/delete-item", function(req, res, next){
  ListItem.findOneAndDelete({_id: req.body.itemId}, function(err, item){
    if(err) console.log(err);
  });
  res.redirect("/");
});

app.post("/dark-theme", function(req, res, next){
  Theme.findByIdAndUpdate("6254e3856e305b51107ce365", {isDark: true}, function(err, doc){
    if(err) console.log(err);
    else console.log("updated to dark theme")
  })
  res.redirect("/")
});



app.post("/light-theme", function(req, res, next){
  Theme.findByIdAndUpdate("6254e3856e305b51107ce365", {isDark: false}, function(err, doc){
    if(err) console.log(err);
    else console.log("updated to light theme")
  })
  res.redirect("/")
});

app.post("/clear-completed", function(req, res){
  ListItem.deleteMany({status: "completed"}, function(err){
    if(err) console.log(err)
  });
  res.redirect("/");
});

app.post("/check-item", function(req, res){
  const itemId = req.body.itemId;

  ListItem.findById(itemId, function(err, doc){
    console.log(doc.status)
    if(err) console.log(err);
    else {
      if(doc.status === "active"){
        ListItem.updateOne({_id: doc.id}, {status: "completed"}, function(err, doc){
          if(err) console.log(err)
          else console.log("item status updated to completed")
        })
      } else if(doc.status === "completed") {
        ListItem.updateOne({_id: doc.id}, {status: "active"}, function(err, doc){
          if(err) console.log(err);
          else console.log("item status updated to active")
        })
      }
    }
    res.redirect("/")
  });
});

























// app.use(session({
//     secret: 'Long secret string.',
//     store: MongoStore.create({ mongoUrl: 'mongodb+srv://Admin-Pablo:Marpace6215@cluster0.mvb3f.mongodb.net/listprojectDB' }),
//     resave: false,
//     saveUninitialized: false
// }));


// app.use(passport.initialize());
// app.use(passport.session());

// app.use(flash());

// function ensureAuthenticated(req, res, next) {
//     if (req.isAuthenticated()) {
//       return next()
//     }
//     res.redirect('/') // if not auth
// };

// function forwardAuthenticated (req, res, next) {
//     if (!req.isAuthenticated()) {
//       return next()
//     }
//     res.redirect('/lists');  // if auth    
// }




// mongoose.set('useFindAndModify', false);
// mongoose.set('useCreateIndex', true);



// const listSchema = new mongoose.Schema({
//     title: String,
//     dateCreated: String,
//     timeCreated: String,
//     userId: String,
//     items: [itemSchema]
// });

// const List = new mongoose.model('List', listSchema);

// const userSchema = new mongoose.Schema({
//     username: String,
//     password: String,
// });



// userSchema.plugin(passportLocalMongoose);

// const User = new mongoose.model('User', userSchema)



// passport.use(User.createStrategy());

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());



////////////////// GET ROUTES  //////////////////////////

// app.get('/', forwardAuthenticated, function(req, res){
//     res.render('home', {title: 'Home'})
// });

// app.get('/register', forwardAuthenticated, function(req, res){
//     res.render('register', {title: 'Register', message: req.flash('message')})
// })

// app.get('/login', forwardAuthenticated, function(req, res){
//     res.render('login', {title: 'Login', message: req.flash('error'), resetPasswordMsg: req.flash('resetPasswordMsg')})
// });

// app.get('/forgotPassword', function(req, res){
//     res.render('forgotPassword', {title: 'Forgot-Password'})
// });

// app.get('/logout', function(req, res){
//     req.logout();
//     res.redirect('/');
// });

// app.get('/lists', ensureAuthenticated, function(req, res){
//         res.render('lists', {title: "Lists", username: req.user.username})
// });

// app.get('/submitList', ensureAuthenticated, function(req, res){
//     List.findOne({title: req.flash('listTitle'), userId: req.user.id}, function(err, foundList){
//         if(err){
//             console.log(err)
//         } else {
//             const listItems = foundList.items;
//             res.render('submitList', {
//                 title: "Submit", 
//                 message: req.flash('message'),
//                 list: foundList
//             });
//         }
//     }); 
// });


// app.get('/viewLists', ensureAuthenticated, function(req, res){
//         List.find({userId: req.user.id}, function(err, foundLists){
//             if(err){
//                 console.log(err)
//             } else {
//                 res.render('viewLists', {title: 'View', lists: foundLists});
//             }
//         });
// });

/////////////////  POST ROUTES //////////////////////////

// app.post('/register', function(req, res){
//     User.register({username: req.body.username}, req.body.password, function(err, user){
//         if(err){
//             req.flash('message', err.message);
//             console.log(err);
//             res.redirect('/register');
//         } else {  
//             passport.authenticate('local')(req, res, function(){
//                 user.save()
//                 res.redirect('/lists');
//             })
//             console.log('User created successfully')
//         }
//     });   
// });

// app.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true}),  function(req, res) {
// 	res.redirect('/lists');
// });

// app.post('/resetPassword', function(req,res){
//     User.findByUsername(req.body.username, function(err, foundUser){
//         if(err){
//             console.log(err);
//         } else {
//             if(!foundUser){
//                 console.log('Username does not exist.')
//             } else {
//                 foundUser.setPassword(req.body.newPassword, function(err){
//                     if(err) {
//                         console.log(err)
//                     } else {
//                         foundUser.save();
//                         req.flash('resetPasswordMsg', 'Password has been reset.')
//                         res.redirect('/login');
//                     }
//                 });
//             }
//         }
//     });
// });


// app.post('/lists', function(req, res){

//     const date = req.body.date
//     const time = req.body.time
//     const listTitle = req.body.listTitle;

//     const newList = new List({
//         title: listTitle,
//         dateCreated: date,
//         timeCreated: time,
//         userId: req.user.id,
//         items: []
//     });

//     newList.save();
     
//     req.flash('listTitle', listTitle)
//     res.redirect('/submitList');

// });

// app.post('/submitList', function(req, res){


//     const newItem = new Item({
//         name: req.body.listItem,
//         listId: req.body.listId
//     });

//     List.findById(req.body.listId, function(err, foundList){
//         if(err){
//             console.log(err)
//         } else {
//             foundList.items.push(newItem);
//             foundList.save();
//             req.flash('listTitle', foundList.title)
//             res.redirect(`/submitList`);
//         }
//     });
// });

// app.post('/delete', function(req, res){
//     List.findOneAndUpdate({_id: req.body.listId}, {$pull: {items: {_id: req.body.itemId}}}, function(err, foundList){
//         if(!err){
//             req.flash('listTitle', foundList.title)
//             res.redirect('/submitList');
//         }
//     });

// });

// app.post('/deleteList', function(req, res){
//     List.findOneAndRemove({_id: req.body.listId}, function(err, foundList){
//         if (err) {
//             console.log(err)
//         } else {
//             res.redirect('/viewLists');
//         }
//     })
// });


// app.post('/deleteAccount', function(req, res){
//    List.deleteMany({userId: req.user.id}, function(err){
//        if(err){
//            console.log(err)
//        } else {
//             console.log('Lists deleted successfully');
//        }
//    });
//    User.deleteOne({_id: req.user.id}, function(err){
//        if(err){
//            console.log(err)
//        } else {
//            console.log('Account deleted successfully');
//            res.redirect('/');
//        }
//    })

// });

// app.post('/editList', function(req, res){
//     req.flash('listTitle', req.body.listTitle);
//     res.redirect('/submitList');
// });

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function(){
    console.log('Server has started successfully')
})