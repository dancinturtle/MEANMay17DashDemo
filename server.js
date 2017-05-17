var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/soobin');
var soobinSchema = new mongoose.Schema({
  name: {type: String, required: [true, "A name is required!"], minlength: [2, "Names must be at least 2 characers long."]},
  description: {type:String, required:[true, "A description is required!"], minlength: [10, "Descriptions must contain at least 10 characters."]}
}, {timestamps: true})
// set our model
mongoose.model('Soobin', soobinSchema);
var Soobin = mongoose.model('Soobin');


app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, './bower_components')));
app.use(express.static(path.join(__dirname, './static')));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

app.get('/', function(req, res){
  Soobin.find({}, function(err, soobins){
    if(err){
      console.log("We have an error getting the soobins", err);
    }
    else {
      console.log("All the soobins", soobins);
      if(soobins.length == 0){
        res.redirect('/mongooses/new')
      }
      res.render('index', {data:soobins})
    }
  })

})

app.get('/mongooses/new', function(req, res){
  // show the form to create a new mongooses
  res.render('new')
})

app.post('/mongooses', function(req, res){
  // add the new mongooses
  Soobin.create(req.body, function(err){
    if(err){
      var errors = [];
      for(var key in err.errors){
        errors.push(err.errors[key].message);
      }
      res.render('new', {errors: errors})

    }
    else {
      res.redirect('/')
    }
  })

})

app.get('/mongooses/:id', function(req, res){
  // get the data about the mongoose with the given id in the url
  res.render('show');
})

app.post('/mongooses/:id', function(req, res){
  // update the mongoose of the id that's in the url to the submitted info
  Soobin.update({_id: req.params.id}, req.body, {runValidators: true}, function(err, soobin){
    if(err){
      // dig through the err object and send back the errors to the edit page
      console.log("Error while updating", err);
    }
    else {
        res.redirect('/')
    }
  })
})

app.post('/mongooses/destroy/:id', function(req, res){
  // remove the mongoose of the id that's in the url
  console.log("Made it to post /mongooses/destroy/id");
  Soobin.remove({_id: req.params.id}, function(err){
    if(err){
      console.log("Got an error while deleting", err);
    }
    else{
      res.redirect('/')
    }
  })

})

app.get('/mongooses/edit/:id', function(req, res){
  // grab the mongoose with that id, display the edit form, prepopulated with the existing data
  Soobin.findOne({_id:req.params.id}, function(err, soobin){
    if(err){
      console.log("Got an error getting the one soobin", err);
    }
    else {
      res.render('edit', {data:soobin})
    }
  })

})


app.listen(8000, function(){
  console.log("Running on 8000");
})
