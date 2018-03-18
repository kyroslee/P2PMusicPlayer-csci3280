{
  "targets": [
    {
    "include_dirs" : [
        "<!(node -e \"require('nan')\")"
    ],
    "target_name": "wav_parser",
    "sources": [ "wav_parser_new.cc" ]
    }
  ]
}
