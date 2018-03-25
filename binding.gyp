{
  "targets": [
    {
    "include_dirs" : [
        "<!(node -e \"require('nan')\")"
    ],
    "target_name": "wav_parser",
    "sources": [ "src/wav_parser.cc" ]
    }
  ]
}
