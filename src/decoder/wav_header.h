// WAV file header format
typedef struct {
  unsigned char riff[4];                // RIFF string
  unsigned int overall_size;            // overall size of file in bytes
  unsigned char wave[4];                // WAVE string
  unsigned char fmt_chunk_marker[4];    // fmt string with trailing null char
  unsigned int fmt_chunk_size;          // length of the format data
  unsigned short format_type;           // format type. 1-PCM, 3- IEEE float, 6 - 8bit A law, 7 - 8bit mu law
  unsigned short channels;              // no.of channels
  unsigned int sample_rate;             // sampling rate (blocks per second)
  unsigned int byte_rate;               // SampleRate * NumChannels * BitsPerSample/8
  unsigned short sample_alignment;      // NumChannels * BitsPerSample/8
  unsigned short bit_depth;             // bits per sample, 8- 8bits, 16- 16 bits etc
  unsigned char data_chunk_header [4];  // DATA string or FLLR string
  unsigned int data_size;               // NumSamples * NumChannels * BitsPerSample/8 - size of the next chunk that will be read
  unsigned char data[];
} wav_file_t;

