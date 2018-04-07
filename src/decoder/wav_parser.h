#pragma once
#include <iostream>

typedef struct  WAV_HEADER
{
	/* RIFF Chunk Descriptor */
	unsigned char         RIFF[4];        // RIFF Header Magic header
	unsigned int          ChunkSize;      // RIFF Chunk Size
	unsigned char         WAVE[4];        // WAVE Header
									/* "fmt" sub-chunk */
	unsigned char         fmt[4];         // FMT header
	unsigned int        Subchunk1Size;  // Size of the fmt chunk
	unsigned int        AudioFormat;    // Audio format 1=PCM,6=mulaw,7=alaw,     257=IBM Mu-Law, 258=IBM A-Law, 259=ADPCM
	unsigned int        NumOfChan;      // Number of channels 1=Mono 2=Sterio
	unsigned int        SampleRate;  // Sampling Frequency in Hz
	unsigned int        ByteRate;    // bytes per second
	unsigned int        blockAlign;     // 2=16-bit mono, 4=16-bit stereo
	unsigned int        bitsPerSample;  // Number of bits per sample
									/* "data" sub-chunk */
	unsigned char       Subchunk2ID[4]; // "data"  string
	unsigned int        Subchunk2Size;  // Sampled data length
  unsigned char data[];
} wav_hdr;
