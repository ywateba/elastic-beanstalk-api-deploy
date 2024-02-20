import express from 'express';
import bodyParser from 'body-parser';
import validator from 'validator'
import cors from 'cors'

import { filterImageFromURL, deleteLocalFiles, isImageFilename } from './util/util.js';



// Init the Express application
const app = express();

// Set the network port
const port = process.env.PORT || 8082;


// Use the body parser middleware for post requests
app.use(bodyParser.json());

app.get("/filteredimage", async (req, res) => {

  const { image_url: image_url } = req.query;
  console.log(image_url)

  // Validate the URL
  if (!image_url || !validator.isURL(image_url)) {
    console.log("Url provided is not valid")
    return res.status(400).send({ message: "The image_url provided is not a valid URL." });
  }

  // Check if the url refer to a file
  console.log(image_url.split('/').pop())
  if (!isImageFilename(image_url.split('/').pop())) {
    console.log("Url provided is not an image")
    return res.status(400).send({ message: "The url provided must refer to  an image file." });
  }


  let saved_url = await filterImageFromURL(image_url)
  console.log("saved_url :",saved_url)

  if (saved_url) {
    res.status(200).sendFile(saved_url, (err) => {
      if (err) {
        console.log(err)
        res.status = 500

      } else {
        console.log("File sent successful")
        res.status = 200

        // delete file after sending it
        deleteLocalFiles([saved_url])

      }
    })
  } else {
    console.log("Could not retrieve image file")
    return res.status(500).send({ message: "Could not retrieve image file" });
  }


});

// Root Endpoint
// Displays a simple message to the user
app.get("/", async (req, res) => {
  res.send("try GET /filteredimage?image_url={{}}")
});


// Start the Server
app.listen(port, () => {
  console.log(`server running http://localhost:${port}`);
  console.log(`press CTRL+C to stop server`);
});
