#include <stdio.h>
#include <sys/stat.h>
#include <sys/mman.h>
#include <unistd.h>
#include <limits.h>

#include <node.h>
#include <nan.h>

#include "wav_header.h"

namespace decoder {
  using v8::Exception;
  using v8::FunctionCallbackInfo;
  using v8::Isolate;
  using v8::Local;
  using v8::Number;
  using v8::Object;
  using v8::String;
  using v8::Value;
  using v8::Boolean;
  using v8::Function;
  using v8::ArrayBuffer;
  using v8::Float32Array;
  using v8::Integer;

  const char* ToCString(const String::Utf8Value& value) {
    return *value ? *value : "<string conversion failed>";
  }

  void decode(const FunctionCallbackInfo<Value>& args) {
    Isolate* isolate = args.GetIsolate();

    // check arguments
    if(!( args.Length() == 3 &&
          args[0]->IsString() &&
          args[1]->IsBoolean() &&
          args[2]->IsFunction()
        )) {
      isolate->ThrowException(Exception::TypeError(
            String::NewFromUtf8(isolate,
              "Invalid args: decode(fileName, returnData, callback)")));
      return;
    }

    // get arguments
    String::Utf8Value fileNameUtf8(args[0]->ToString());
    const char* fileName = ToCString(fileNameUtf8);
    bool returnData = Local<Boolean>::Cast(args[1])->Value();
    Local<Function> callback = Local<Function>::Cast(args[2]);

    // open wav file
    printf("\n\nOpening WAV file: %s\n", fileName);
    int wavFD = open(fileName, O_RDONLY);
    if( wavFD < 0 ) {
      isolate->ThrowException(Exception::TypeError(
            String::NewFromUtf8(isolate, "Error: Failed to open WAV file.")));
      return;
    }

    // get wav file size
    struct stat wavSD;
    if(fstat(wavFD, &wavSD) < 0) {
      close(wavFD);
      isolate->ThrowException(Exception::TypeError(
            String::NewFromUtf8(isolate, "Error: Failed to stat WAV file.")));
      return;
    }
    printf("WAV File Size: %llu\n", wavSD.st_size);

    // mmap file info memory
    void* mappedData = mmap(NULL, wavSD.st_size, PROT_WRITE, MAP_PRIVATE, wavFD, 0);
    if (mappedData == MAP_FAILED) {
      close(wavFD);
      isolate->ThrowException(Exception::TypeError(
            String::NewFromUtf8(isolate, "Error: Failed to map WAV file into memory.")));
      return;
    }
    wav_file_t* wavFile = (wav_file_t*) mappedData;
    printf("overall_size: %d\n",      wavFile->overall_size);
    printf("fmt_chunk_size: %d\n",    wavFile->fmt_chunk_size);
    printf("format_type: %u\n",       wavFile->format_type);
    printf("channels: %u\n",          wavFile->channels);
    printf("sample_rate: %d\n",       wavFile->sample_rate);
    printf("byte_rate: %d\n",         wavFile->byte_rate);
    printf("sample_alignment: %u\n",  wavFile->sample_alignment);
    printf("bit_depth: %d\n",         wavFile->bit_depth);

    // check if format is supported
    if(!( wavFile->channels == 2 &&
          wavFile->format_type == 1 &&
          wavFile->bit_depth == 16
        )) {
      munmap(mappedData, wavSD.st_size);
      close(wavFD);
      isolate->ThrowException(Exception::TypeError(
            String::NewFromUtf8(isolate, "Error: Unsupported audio format.")));
      return;
    }

    // Compute params
    int samples = (wavFile->overall_size - 36) / wavFile->sample_alignment;
    int channelSize = wavFile->sample_alignment / wavFile->channels;
    int bufferSize = samples*2*4;
    printf("samples: %d\n", samples);
    printf("channelSize: %d\n", channelSize);
    printf("bufferSize: %d\n", bufferSize);

    if(returnData) {

      // Read data into JS array buffer
      Local<ArrayBuffer> buf = ArrayBuffer::New(isolate, bufferSize);
      Local<Float32Array> chan = Float32Array::New(buf, 0, bufferSize);
      Nan::TypedArrayContents<float> arr(chan);
      for(int i = 0; i < samples*2; i++) {
        float sample = (float)((short*) wavFile->data)[i];
        (*arr)[i] = sample / SHRT_MAX;
      }

      // return result via callback
      // callback(samples, sampleRate, buf);
      // sampleRate: Hz
      // buf: ArrayBuffer(Float32Array)
      const unsigned argc = 3;
      Local<Value> argv[argc] = {
        Integer::New(isolate, samples),
        Integer::New(isolate, wavFile->sample_rate),
        buf
      };
      callback->Call(Null(isolate), argc, argv);

    } else {
    
      // return result via callback
      const unsigned argc = 2;
      Local<Value> argv[argc] = {
        Integer::New(isolate, samples),
        Integer::New(isolate, wavFile->sample_rate),
      };
      callback->Call(Null(isolate), argc, argv);
    }

    // unmap & close file
    munmap(wavFile, wavSD.st_size);
    close(wavFD);
  }

  void init(Local<Object> exports) {
    NODE_SET_METHOD(exports, "decode", decode);
  }

  NODE_MODULE(NODE_GYP_MODULE_NAME, init)

}
