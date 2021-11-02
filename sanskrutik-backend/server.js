import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import multer from 'multer'
import GridFsStorage from 'multer-gridfs-storage'
import Grid from 'gridfs-stream'
import bodyParser from 'body-parser'
import path from 'path'
import Pusher from 'pusher'
import mongoPosts from './models/postModel.js'
import dotenv from 'dotenv'
dotenv.config()


Grid.mongo = mongoose.mongo;

// app config
const app = express();
const port = process.env.PORT || 9000

const pusher = new Pusher({
    appId: "1219114",
    key: "76a2a535c2203dc6eeff",
    secret: "3add4670c73f2d62e2dd",
    cluster: "ap2",
    useTLS: true
  });



//middlewares
app.use(bodyParser.json());
app.use(cors());



//db config
const mongoURI=process.env.DEV_DB_URI

const promise = mongoose.connect(mongoURI, {useNewUrlParser : true})

const conn = mongoose.createConnection(mongoURI,{
    useCreateIndex : true,
    useNewUrlParser : true,
    useUnifiedTopology : true
});

let gfs

mongoose.connect(mongoURI,{
    useCreateIndex : true,
    useNewUrlParser : true,
    useUnifiedTopology : true
});

mongoose.connection.once('open',()=>{
    console.log('Db Connected');

    const changeStream = mongoose.connection.collection('posts').watch()

    changeStream.on('change', (change) =>{
        console.log(change);

        if (['insert', 'update'].includes(change.operationType)) {
            console.log("Trigger Pusher");

            pusher.trigger('posts','inserted',{
                change : change
            })
        } else {
            console.log("Error Triggering Pusher");
        }
    })
})

conn.once('open', () => {
    console.log("DB Connected");

    gfs= Grid(conn.db, mongoose.mongo)
    gfs.collection('images')
});

const storage = new GridFsStorage({
    db : promise,
    file : (req,file)=>{
        return new Promise((resolve,reject)=> {
            {
                const filename = `image-${Date.now()}${path.extname(file.originalname)}`

                const fileInfo = {
                filename: filename,
                bucketName: 'images'
                }

                resolve(fileInfo);
            }
        });
    }
});

const upload = multer({storage});


//api routes
app.get('/',(req,res)=> res.status(200).send('Hello Mr.Stark'));


//route for image upload
app.post('/upload/image', upload.single('file') , (req,res)=> {
    res.status(201).send(req.file)
})


//route for post upload
app.post('/upload/post', (req,res)=>{
    const dbPost = req.body
    dbPost.timeStamp = Date.now();

    console.log(dbPost);

    mongoPosts.create(dbPost, (err,data)=>{
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(201).send(data)
        }
    })
})


//route for post likes
app.post('/posts/:postId/likes', (req,res)=>{
    const bodyParams = req.body;
    const urlParams = req.params;

    mongoPosts.findOne({_id: urlParams.postId}, (err, post) => {
      if (err) {
          res.status(404).send({
            message: "NOT FOUND"
          });
      }

      post.likes.push({
          user: bodyParams.user,
          avatar: bodyParams.avatar,
          createdAt: Date.now(),
      });

      post.save(error => {
          if (err) {
              res.status(500).send(err)
          } else {
              res.status(200).send(post)
          }
      });
    });
});


//route to delete likes from post
app.delete('/posts/:postId/likes/:id', (req,res)=>{
    const urlParams = req.params;

    mongoPosts.findOne({_id: urlParams.postId}, (err, post) => {
      if (err) {
          res.status(404).send({
            message: "NOT FOUND"
          });
      }

      post.likes.id(urlParams.id).remove();
      post.save(error => {
          if (err) {
              res.status(500).send(err)
          } else {
              res.status(200).send(post)
          }
      });
    });
});


//route for post comments
app.post('/posts/:postId/comments', (req,res)=>{
    const bodyParams = req.body;
    const urlParams = req.params;

    mongoPosts.findOne({_id: urlParams.postId}, (err, post) => {
      if (err) {
          res.status(404).send({
            message: "NOT FOUND"
          });
      }

      post.comments.push({
          user: bodyParams.user,
          avatar: bodyParams.avatar,
          text: bodyParams.text,
          createdAt: Date.now(),
      });

      post.save(error => {
          if (err) {
              res.status(500).send(err)
          } else {
              res.status(200).send(post)
          }
      });
    });
});





app.get('/retrieve/posts', (req,res)=>{
    mongoPosts.find((err,data)=>{
        if (err) {
            res.status(500).send(err)
        } else {
            data.sort((b,a)=>{
                return a.timeStamp - b.timeStamp;
            });
            res.status(200).send(data)
        }
    })

})




app.get('/retrieve/image/single', (req,res) => {
    gfs.files.findOne({filename : req.query.name},(err,file)=>{
        if (err) {
            res.status(500).send(err)
        } else {
            if (!file || file.length === 0) {
                res.status(404).json({err : 'file not found'})
            } else {
                const readstream = gfs.createReadStream(file.filename);
                readstream.pipe(res);
            }
        }
    })

})



//listen
app.listen(port,()=>console.log(`Server started at PORT : ${port}`))
