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
│   package.json // node modules config file
|   binding.gyp // config file for building node native modules
│   config.js // config file for the application, indicates the media folder path
│
└───media //folder contains albums
│   └───album 1
│       |   album.yml // manually input file that indicates the info of the albums e.g. tracks info, album artist(optional) 
│       |   cover.jpg // album cover image
│       |   track1.wav // your tracks here
│       |   track2.wav
│   └───album 2
│   └───album 3
│   └───... //as long as how many albums you have here
│ 
└───src
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
│   └───decoder //wav file decoder
│       |   wav_parser.h //header file of the wav decoder
│       |   wav_parser.cc //the C++ source code of wav decoder
 

```
