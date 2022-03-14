var fs = require('fs'),
    path = require('path'),
    test_images = require(path.join(__dirname, 'test_images.js'));

// update to include a way to track which images have been posted already
// --> rotate between 2 lists (primary and secondary). When image is tweeted, corresponding entry is moved to
// the other array. When the first array is emptied, the secondary becomes the primary
function random_from_array(test_images){
    let primary = test_images.primary;
    let secondary = test_images.secondary;
    
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
    
    fs.writeFile(path.join(__dirname, 'test_images.js'), "var images =" + to_save_string + ";\n\nmodule.exports = images;", function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved!");
}); 
  return random_image;
}

function random_text(){
    text_array = [" hers's a bABy for yeou \n", " i foudn thkis :) \n", " thankk, foor folololwing ME \n", " wwoW! i hasve founD thid 4 u \n"];
    return text_array[Math.floor(Math.random() * text_array.length)]
}



// console.log(random_text())
console.log(random_from_array(test_images))

// Now setting up a function that tweets a special pic at new followers
// should pic be solely of the ones we've already posted?
// make file with possible statuses
// include as always, the source

var stream = T.stream('user');

stream.on('follow', followed);

function followed(eventMessage) {
    var name = eventMessage.source.name;
    var screenName = eventMessage.source.screen_name;
    upload_random_image(images, '@' + screenName + random_text());
};

// first we must post the media to Twitter
T.post('media/upload', { media_data: b64content }, function (err, data, response) {
  // now we can assign alt text to the media, for use by screen readers and
  // other text-based presentations and interpreters
  var mediaIdStr = data.media_id_string
  var altText = "Small flowers in a planter on a sunny balcony, blossoming."
  var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }