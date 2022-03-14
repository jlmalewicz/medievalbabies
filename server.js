var fs = require('fs'),
    path = require('path'),
    Twit = require('twit'),
    config = require(path.join(__dirname, 'config.js')),
    images = require(path.join(__dirname, 'images.js'));

var T = new Twit(config);

// update to include a way to track which images have been posted already
// --> rotate between 2 lists (primary and secondary). When image is tweeted, corresponding entry is moved to
// the other array. When the first array is emptied, the secondary becomes the primary
function random_from_array(images){
    let primary = images.primary;
    let secondary = images.secondary;
    
    if (primary.length === 0) {
        primary = secondary.map((x) => x);
        secondary = [];
    }  
    var random_number = Math.floor(Math.random() * primary.length)
    var random_image = primary[random_number]
    secondary.push(random_image);
    primary.splice(random_number, 1);
    
    let to_save = {}
    to_save.primary = primary
    to_save.secondary = secondary
    
    let to_save_string = JSON.stringify(to_save, null, 4)
    
    fs.writeFile(path.join(__dirname, 'images.js'), "var images =" + to_save_string + ";\n\nmodule.exports = images;", function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved!");
}); 
  return random_image;
}

function random_text(){
    text_array = [" hers's a bABy for yeou \n", 
                  " i foudn thkis :) \n", 
                  " thankk, foor folololwing ME \n", 
                  " wwoW! i hasve founD thid 4 u \n"];
    return text_array[Math.floor(Math.random() * text_array.length)]
}


function upload_random_image(images, optional_text =''){
  console.log('Opening an image...');
  var image = random_from_array(images),
      image_path = path.join(__dirname, '/images/' + image.file ),
      b64content = fs.readFileSync(image_path, { encoding: 'base64' });

  console.log('Uploading an image...');

  T.post('media/upload', { media_data: b64content }, function (err, data, response) {
    if (err){
      console.log('ERROR:');
      console.log(err);
    }
    else{
      console.log('Image uploaded!');
      console.log('Now tweeting it...');
        
        // pull out source info and shove it in the Tweet text variable
      var tweet_text = optional_text + image.source;

      T.post('statuses/update', {
        /* You can include text with your image as well. */                       
        status: tweet_text,
        media_ids: new Array(data.media_id_string)
      },
        function(err, data, response) {
          if (err){
            console.log('ERROR:');
            console.log(err);
          }
          else{
            console.log('Posted an image!');
          }
        }
      );
    }
  });
};


// Now setting up a function that tweets a special pic at new followers
// should pic be solely of the ones we've already posted?
// make file with possible statuses
// include as always, the source

var stream = T.stream('statuses/filter', { track: '@medievalbabies'});

stream.on('follow', followed);

function followed(eventMsg) {
    var screenName = eventMsg.source.screen_name;
    console.log('I was followed by: ' + screenName);
    //upload_random_image(images, '@' + screenName + random_text());
};



// The following will post a random image from the \images directory
// and post it, every 10 seconds.
// The interval is given in [ms].

//setInterval(function(){
//  upload_random_image(images);
//}, 100000000);
