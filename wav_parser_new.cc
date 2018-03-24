#include <iostream>
#include <stdexcept>

#include <node.h>
#include <nan.h>

#include "wav_parser.h"

using namespace std;

namespace wav_parser{

  using v8::Exception;
  using v8::FunctionCallbackInfo;
  using v8::Isolate;
  using v8::Local;
  using v8::Object;
  using v8::String;
  using v8::Value;
  using v8::Function;
  using v8::ArrayBuffer;
  using v8::Float32Array;
  using v8::Integer;

  const char* ToCString(const String::Utf8Value& value) {
    return *value ? *value : "<string conversion failed>";
  }

  void wav_parsing(const FunctionCallbackInfo<Value>& args){
    Isolate* isolate = args.GetIsolate();
    String::Utf8Value fileNameInUtf8(args[0]->ToString());
    Local<Function> callback = Local<Function>::Cast(args[1]);

//convert and read filename
    const char* fileName = ToCString(fileNameInUtf8);
    FILE* wavFile = fopen(fileName, "r");
    cout << "Now opening file :" << fileName << endl;
    if(wavFile == NULL){
      isolate->ThrowException(Exception::TypeError(
      String::NewFromUtf8(isolate, "Error: Failed to open WAV file.")));
      return;
    }

    wav_hdr wavHeader;
    //Read the header
    char buffer2[2];
    fread(&wavHeader.RIFF, 1, 4, wavFile);
    fread(&wavHeader.ChunkSize, 1, 4, wavFile);
    fread(&wavHeader.WAVE, 1, 4, wavFile);
    fread(&wavHeader.fmt, 1, 4, wavFile);
    fread(&wavHeader.Subchunk1Size, 1, 4, wavFile);

    fread(buffer2, 1, 2, wavFile);
    wavHeader.AudioFormat = buffer2[0] | buffer2[1] << 8;//converting from little to big endianness

    fread(buffer2, 1, 2, wavFile);
    wavHeader.NumOfChan = buffer2[0] | buffer2[1] << 8;//converting from little to big endianness

    fread(&wavHeader.SampleRate, 1, 4, wavFile);
    fread(&wavHeader.ByteRate, 1, 4, wavFile);

    fread(buffer2, 1, 2, wavFile);
    wavHeader.blockAlign = buffer2[0] | buffer2[1] << 8;//converting from little to big endianness

    fread(buffer2, 1, 2, wavFile);
    wavHeader.bitsPerSample = buffer2[0] | buffer2[1] << 8;//converting from little to big endianness

    fread(&wavHeader.Subchunk2ID, 1, 4, wavFile);
    fread(&wavHeader.Subchunk2Size, 1, 4, wavFile);

    	int filelength = wavHeader.ChunkSize + 8;

    cout << "File is                    :" << filelength << " bytes." << endl;
    //the header information extracted
    cout << "RIFF header                :" << wavHeader.RIFF[0] << wavHeader.RIFF[1] << wavHeader.RIFF[2] << wavHeader.RIFF[3] << endl;
    cout << "Chunk size                 :" << wavHeader.ChunkSize << endl;
    cout << "WAVE header                :" << wavHeader.WAVE[0] << wavHeader.WAVE[1] << wavHeader.WAVE[2] << wavHeader.WAVE[3] << endl;//it must be wave as we are parsing wav
    cout << "FMT                        :" << wavHeader.fmt[0] << wavHeader.fmt[1] << wavHeader.fmt[2] << wavHeader.fmt[3] << endl;
    cout << "Sub Chunk 1 Size           :" << wavHeader.Subchunk1Size << endl;
    cout << "Audio Format               :" << wavHeader.AudioFormat << endl;
    cout << "Number of channels         :" << wavHeader.NumOfChan << endl;
    cout << "Sampling Rate              :" << wavHeader.SampleRate << endl;
    cout << "Byte Rate                  :" << wavHeader.ByteRate << endl;
    cout << "Block align                :" << wavHeader.blockAlign << endl;
    cout << "bitsPerSample              :" << wavHeader.bitsPerSample << endl;
    cout << "Data string                :" << wavHeader.Subchunk2ID[0] << wavHeader.Subchunk2ID[1] << wavHeader.Subchunk2ID[2] << wavHeader.Subchunk2ID[3] << endl;
    cout << "Music data length          :" << wavHeader.Subchunk2Size << endl;

    int samples = (filelength - 44) / wavHeader.blockAlign;
    int channelSize = wavHeader.blockAlign / wavHeader.NumOfChan;
    int bufferSize = samples*4;
    printf("samples: %d\n", samples);
    printf("channelSize: %d\n", channelSize);
    printf("bufferSize: %d\n", bufferSize);
    Local<ArrayBuffer> leftBuffer = ArrayBuffer::New(isolate, bufferSize);
    Local<ArrayBuffer> rightBuffer = ArrayBuffer::New(isolate, bufferSize);
    Local<Float32Array> leftChannel = Float32Array::New(leftBuffer, 0, bufferSize);
    Local<Float32Array> rightChannel = Float32Array::New(rightBuffer, 0, bufferSize);
    Nan::TypedArrayContents<float> leftArr(leftChannel);
    Nan::TypedArrayContents<float> rightArr(rightChannel);

    unsigned char* data;
    data = new unsigned char[wavHeader.Subchunk2Size];
    fread(data, 1, wavHeader.Subchunk2Size, wavFile);
    for(int i = 0; i < samples; i++){
      float leftSample = (float)((short*) data)[i*2];
      float rightSample = (float)((short*) data)[i*2+1];
      (*leftArr)[i] = leftSample / SHRT_MAX;
      (*rightArr)[i] = rightSample / SHRT_MAX;
    }

    // callback(samples, sampleRate, leftBuffer, rightBuffer);

    const unsigned argc = 4;
    Local<Value> argv[argc] = {
      Integer::New(isolate, samples),
      Integer::New(isolate, wavHeader.SampleRate),
      leftBuffer,
      rightBuffer
    };
    callback->Call(Null(isolate), argc, argv);
    fclose(wavFile);
    return;
  }

  void init(Local<Object> exports){
    NODE_SET_METHOD(exports, "wav_parsing", wav_parsing);
  }

NODE_MODULE(wav_parser, init)

}