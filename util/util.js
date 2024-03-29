import fs from "fs";
import Jimp from "jimp";


// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
 export async function filterImageFromURL(inputURL) {
    try {
      const outpath = "/tmp/filtered." + Math.floor(Math.random() * 2000) + ".jpg";

      console.log(outpath)
      console.log("input_url", inputURL)
      const photo = await Jimp.read(inputURL);


      await photo
        .resize(256, 256) // resize
        .quality(60) // set JPEG quality
        .greyscale() // set greyscale
        .writeAsync(outpath)

      return outpath
    } catch (error) {
      console.log(error)
      console.log("Some error occured")

    }

}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
 export async function deleteLocalFiles(files) {
  for (let file of files) {
    fs.unlinkSync(file);
  }
}


export function isImageFilename(filename) {
  // Regular expression to match common image file extensions
  const pattern = /\.(jpg|jpeg|png|gif|bmp|webp)$/i;
  return pattern.test(filename.toLowerCase());
}
