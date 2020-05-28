const Twit = require("twit");
const config = require("../config");
const fs = require("fs");

const T = new Twit(config);

const videoNames = fs.readdirSync("input videos").map(name => name.split(".")[0]);

// // tweet "foo"
// // T.post("statuses/update", { status: "foo" })

// // get status of media
// // T.get("media/upload", { command: "STATUS", media_id: "1263871395437608961" }, bla)
// // function bla(err, data, response) {
// // 	// console.log(err);
// // 	console.log(data);
// // 	// console.log(response);
// // }

const stream = T.stream("statuses/filter", {
	track: ["@vibingbot"]
});

function tweetEvent(tweet) {
	if (tweet.in_reply_to_status_id !== null) {
		T.get("statuses/show", { id: tweet.in_reply_to_status_id_str }, function (err, data, response) {
			if (err !== undefined) { console.log(err); }

			// If the original tweet contains media
			if (data.extended_entities !== undefined) {
				let mentionedName;
				for (const videoName of videoNames) {
					if (tweet.text.includes(videoName)) {
						mentionedName = videoName;
						break;
					}
				}

				// If the reply contains a file's name
				if (mentionedName) {
					const variants = data.extended_entities.media[0].video_info.variants;
					let highestBitrate = -1; // Only bitrates of 0 and higher are possible 
					let highestBitrateIndex = 0;
					for (let i = 0; i < variants.length; i++) {
						const variant = variants[i];
						const bitrate = variant.bitrate;
						if (bitrate > highestBitrate) {
							highestBitrate = bitrate;
							highestBitrateIndex = i;
						}
					}

					const url = variants[highestBitrateIndex].url;

					// Pass url along with mentionedName to combiner.py
					console.log(url, mentionedName);


					console.log("Posting chunked media")

					const filePath = "output videos/" + mentionedName + ".mp4";
					T.postMediaChunked({ file_path: filePath }, async function (err, data, response) {
						console.log("Finished posting chunked media!");

						// console.log(data);

						// Optional code for handling with files that still need to be processed.
						// while (data.processing_info.state === "pending") {
						// 	console.log("Sleeping " + data.processing_info.check_after_secs + " secs");
						// 	await new Promise(r => setTimeout(r, data.processing_info.check_after_secs));
						// 	T.get("media/upload", { command: "STATUS", media_id: "1263871395437608961" }, function (err2, data2, response2) {
						// 		err = err2;
						// 		data = data2;
						// 		response = response2;
						// 	});
						// }

						replyWithMedia(err, data, response);
					})

					function replyWithMedia(errMedia, dataMedia, responseMedia) {
						console.log("Uploaded media!")

						console.log("Replying with media")

						const name = tweet.user.screen_name;
						const reply = `@${name}`;
						const nameID = tweet.id_str;

						// console.log("dataMedia.media_id_string:")
						// console.log(dataMedia.media_id_string)

						const mediaID = dataMedia.media_id_string;

						const params = {
							status: reply,
							in_reply_to_status_id: nameID,
							media_ids: [mediaID]
						};

						T.post("statuses/update", params, tweeted);

						function tweeted(err, data, response) {
							if (err !== undefined) {
								console.log(err);
							} else {
								console.log("Replied: " + params.status);
							}
						}
					}
				} else {
					console.log("Got invalid mention reply | The tweet that the user is responding to didn't contain any file names")
				}
			} else {
				console.log("Got invalid mention reply | The tweet that the user is responding to didn't contain any media")
			}
		});
	} else {
		console.log("Got invalid mention tweet | A new tweet can't tag this bot")
	}
}

stream.on("tweet", tweetEvent);

stream.on("disconnect", function (disconn) {
	console.log("Disconnect");
});

stream.on("connect", function (conn) {
	console.log("Connecting");
	console.log("Waiting on mention in a reply");
});

stream.on("reconnect", function (reconn, res, interval) {
	console.log("Reconnecting. statusCode:", res.statusCode);
});

console.log("Running");
