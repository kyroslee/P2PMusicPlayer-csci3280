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
│       │   main.js
│       │   httpSrv.js
│       │   
│   └───render //"front-end" of the program, the render process
│       │   index.html
│       │   index.js
│       │   p2p.js
│       │   visualizer.js
│       │   
│   
└───media //folder contains albums
```
