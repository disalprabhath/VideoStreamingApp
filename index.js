const Express = require("express");
const fs = require("fs");
const app = new Express();


app.get("/",(req, res) => {
    res.sendFile(__dirname+"/index.html");
});

app.get("/video",(req, res) => {
    const range = req.headers.range;
    if(!range){
        res.status(400).send("Needs Range In Header");
    }

    const videoPath = "Gara.mp4";
    const videoSize = fs.statSync("Gara.mp4").size;

    const chunkSize =  10 ** 6;
    

    const start = Number(range.replace(/\D/g,""));
    
    const end = Math.min(chunkSize+start,videoSize-1);
    
    const contentLength = end - start + 1 ;

    const headers = {
        "Content-Range":`bytes ${start}-${end}/${videoSize}`,
        "Accept-Range":"bytes",
        "Content-Length":contentLength,
        "Content-Type":"video/mp4",
    };

    res.writeHead(206,headers);
    const videoStream = fs.createReadStream(videoPath,{"start":start ,"end":end});
    
    videoStream.pipe(res);
});

app.listen(8080,()=>console.log("Server Running at Port 8080"));

