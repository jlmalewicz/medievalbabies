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
    
    let to_save_string = JSON.stringify(to_save)
    
    //console.log(to_save_string)
    
    //console.log("var images = {'primary' :" + String(test_images.primary) + ", \n 'secondary' :" + String(secondary) + " }; \n module.exports = images;");
    
    //fs.writeFileSync(String(__dirname, 'test_images.js'), to_save);
    //console.log(primary)
    
    fs.writeFile(path.join(__dirname, 'test_images.js'), "var images =" + to_save_string + "; \n module.exports = images;", function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved!");
}); 
  return random_image;
}

function random_text(){
    text_array = [" hers's a bABy for yeou \n", " i foudn thkis :) \n", " thankk, foor folololwing ME \n"];
    return text_array[Math.floor(Math.random() * text_array.length)]
}



// console.log(random_text())
console.log(random_from_array(test_images))

