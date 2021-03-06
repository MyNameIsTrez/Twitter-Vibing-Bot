import os
import requests
import ffmpeg

tempPath = 'temp/temp.mp4'

# Function I stole from StackOverflow:
# https://stackoverflow.com/a/35844551
def download_file(url, input_video_name):
	r = requests.get(url, stream=True)
	with open(tempPath, 'wb') as f:
		for chunk in r.iter_content(chunk_size=1024):
			if chunk:
				f.write(chunk)
		f.close() # Necessary?

	input_video = ffmpeg.input('input videos/' + input_video_name + '.mp4')
	input_audio = ffmpeg.input(tempPath)

	(
		ffmpeg
		.output(input_audio.audio, input_video.video, 'output videos/' + input_video_name + '.mp4', shortest=None, vcodec='copy')
		.run()
	)

	os.remove(tempPath)

# silent dancing pizza doesn't work, not sure if the bot should reply that it can't process silent vids:
# 'https://video.twimg.com/tweet_video/EYp_tsoWAAYeFG1.mp4'

download_file(
	url = 'https://video.twimg.com/ext_tw_video/1263968501263486976/pu/vid/288x360/28H_5TU5z9oXilFR.mp4?tag=10',
	input_video_name = 'dancing beans'
)