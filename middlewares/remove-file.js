const path = require("path");
const fs = require("node:fs");



//const directory = path.join(__dirname, '..', 'images');

//const limiter = rateLimit({

const handleFileDeletion = (file_to_delete) => {
/*   fs.readdir(directory, (error, files) => {
    if (error) {
      console.log(error);
      throw new Error('Could not read directory');
    } */

/*     files.forEach((file) => {
      const file_path = path.join(directory, file);

      fs.stat(file_path, (error, stat) => {
        if (error) {
          console.log(error);
          throw new Error('Could not stat file');
        }

        if (stat.isDirectory()) {
          // Here instead of doing a consle.log(),
          // we recursively search for the file in subdirectories
          handleFileDeletion(file_path, file_to_delete);
        } else if (file === file_to_delete) { */
          fs.unlink(file_to_delete, (error) => {
            if (error) {
              console.log(error);
              throw new Error('Could not delete file');
            }
            console.log(`Deleted ${file_to_delete}`);
          });
        //}
   //   });
 //   });
 // });
}

module.exports = handleFileDeletion;

// Calling the function
// handleFileDeletion(directory, '1676410030129-screen.webp')