import express from 'express';
import bodyParser from 'body-parser';
import validator from 'validator'

import {filterImageFromURL, deleteLocalFiles} from './util/util.js';



  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  



  app.get( "/filteredimage/:image_url", async (req, res) => {

    const { image_url } = req.params;
    console.log(image_url)

    // Validate the URL
    if (!image_url || !validator.isURL(image_url)) {
      return res.status(400).send({ message: "The image_url provided is not a valid URL." });
    }
    let saved_url = await filterImageFromURL(image_url)
    console.log(saved_url)
    res.sendFile(saved_url,(err) => {
        if (err) {
          console.log(err)
          res.status = 500

        }else{
          console.log("File sent successful")
        }
    })
  } );

  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );


  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
