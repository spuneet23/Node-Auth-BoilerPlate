const Card = require('../models/cards');
var AWS = require('aws-sdk');
AWS.config.loadFromPath('./aws_key.json');


/*--------- Create Card --------*/
exports.createCard = function(req, res){
  
    const file = req.files.file;
    //   console.log('file',file)
     
    var s3Bucket = new AWS.S3( { params: {Bucket: 'augmentedr'} } );
      var data = {Key: 'videos/'+file.name, Body: file.data , ACL: 'public-read'};
      s3Bucket.upload(data, function(err, data2){
                  if (err) 
                    { console.log('Error uploading data: ',err); 
                       
                    } else {
                      console.log('yo',data2)
                        Card.findOne().sort({uploadedAt:-1})
                          .then((lastCard) =>{
                                console.log('lastCard',lastCard)
                             const card = new Card({
                                    video_id:lastCard.video_id+1,
                                    url:data2['Location'],
                                    barcode:(lastCard.video_id+1)+'.png'
                                })
                                
                                card.save(function(err){
                                    if(err)
                                        console.log('err',err)
                                    console.log('card saved')
                                    res.send('success')
                                });
                          })
                    //   const card = new Card({
                           
                    //   })
                    }
                })
                
                
    // const url = req.body.url;

}


/*------ Get Cards ------*/
exports.getCards = function(req,res){
    Card.find({})
     .then((cards) => {
         res.send(cards)
         })
}


exports.uploadVideo = function(req,res){
const Youtube = require("youtube-api")
    , fs = require("fs")
    , readJson = require("r-json")
    , Lien = require("lien")
    , Logger = require("bug-killer")
    , opn = require("opn")
    , prettyBytes = require("pretty-bytes")
    ;
// I downloaded the file from OAuth2 -> Download JSON
const CREDENTIALS = readJson('./youtube_credentials.json');

// Init lien server
let server = new Lien({
    host: "localhost"
  , port: 5000
});

// Authenticate
// You can access the Youtube resources via OAuth2 only.
// https://developers.google.com/youtube/v3/guides/moving_to_oauth#service_accounts
let oauth = Youtube.authenticate({
    type: "oauth"
  , client_id: CREDENTIALS.web.client_id
  , client_secret: CREDENTIALS.web.client_secret
  , redirect_url: CREDENTIALS.web.redirect_uris[0]
});

opn(oauth.generateAuthUrl({
    access_type: "offline"
  , scope: ["https://www.googleapis.com/auth/youtube.upload"]
}));

// Handle oauth2 callback
server.addPage("/oauth2callback", lien => {
    Logger.log("Trying to get the token using the following code: " + lien.query.code);
    oauth.getToken(lien.query.code, (err, tokens) => {
         console.log(tokens)
        if (err) {
            lien.lien(err, 400);
            return Logger.log(err);
        }

        Logger.log("Got the tokens.");

        oauth.setCredentials(tokens);

        lien.end("The video is being uploaded. Check out the logs in the terminal.");

        var req = Youtube.videos.insert({
            resource: {
                // Video title and description
                snippet: {
                    title: "hola"
                  , description: "Test video upload via YouTube API"
                }
                // I don't want to spam my subscribers
              , status: {
                    privacyStatus: "public"
                }
            }
            // This is for the callback function
          , part: "snippet,status"

            // Create the readable stream to upload the video
          , media: {
                body: fs.createReadStream("./video.mp4")
            }
        }, (err, data) => {
            console.log("Done.");
            process.exit();
        });

        setInterval(function () {
            Logger.log(`${prettyBytes(req.req.connection._bytesDispatched)} bytes uploaded.`);
        }, 250);
    });
});
}