## CSCI3280 Project: P2PMusicPlayer
CSCI3280 project

## Run
```
$ npm install
$ npm run build
$ npm start
```

## Project Architechture
```
Project Root Folder
│   README.md
│   package.json
│   
└───src
│   │   binding.gyp
│   │
│   └───main //"back-end" of the program, the main process
│       │   main.js //the entrance of the application
│       │   httpSrv.js // http server
│       │   db.js // get the local song databases
│       │   
│   └───render //"front-end" of the program, the render process
│       │   index.html // html page of the main app
│       │   index.js // js of the main app
│       │   index.css // css stylesheet of the main app
│       │   p2p.js // p2p function
│       │   audioPlayer.js // playing audio besides wav
│       │   wavPlayer.js // playing wav audio by using wav decoder
│       │   videoPlayer.js // playing video
│       │   mediaControl.js // media control bar
│       │   visualizer.js // music visualizer
│       │   
│   
└───media //folder contains albums
```
