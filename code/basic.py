import ffmpeg

input_video_name = 'Satisfactory - Bean'
input_video_extension = '.mp4'

input_audio_name = 'Donkey Kong Country - Aquatic Ambience'
input_audio_extension = '.webm'

input_video = ffmpeg.input('input videos/' + input_video_name + input_video_extension)
input_audio = ffmpeg.input('input audio/'+ input_audio_name + input_audio_extension)

stream = ffmpeg.concat(input_video, input_audio, v=1, a=1)

stream = ffmpeg.output(stream, 'output videos/' + input_video_name + ' & ' + input_audio_name + '.mp4', shortest=1)
ffmpeg.run(stream)