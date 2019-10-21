const Card = require('../models/cards');
var AWS = require('aws-sdk');
// AWS.config.loadFromPath('./aws_key.json');


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
  
                        Card.findOne().sort({uploadedAt:-1})
                          .then((lastCard) =>{
                              // incrementing last video id saved 
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
           
                    }
                })
                

}


/*------ Get Cards ------*/
exports.getCards = function(req,res){
    Card.find({})
     .then((cards) => {
         res.send(cards)
         })
}


