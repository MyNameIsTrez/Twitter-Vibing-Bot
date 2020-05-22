const Twit = require("twit");
const config = require("../config");

const T = new Twit(config);

// // tweet "foo"
// // T.post('statuses/update', { status: "foo" })

// // get status of media
// // T.get('media/upload', { command: "STATUS", media_id: "1263871395437608961" }, bla)
// // function bla(err, data, response) {
// // 	// console.log(err);
// // 	console.log(data);
// // 	// console.log(response);
// // }

const stream = T.stream("statuses/filter", {
	track: ["@vibingbot"]
});

function tweetEvent(tweet) {
	// console.log(tweet);

	T.get("statuses/show", { id: tweet.in_reply_to_status_id_str }, function (err, data, response) {
		if (err !== undefined) { console.log(err); }

		const variants = data.extended_entities.media[0].video_info.variants;
		let highestBitrate = -1; // Only bitrates of 0 and higher are given 
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
		// Give combiner.py the URL
		console.log(url);
	})

	if (tweet.in_reply_to_status_id !== null) {
		console.log("Posting chunked media...")
		const filePath = "output videos/bean.mp4";

		T.postMediaChunked({ file_path: filePath }, async function (err, data, response) {
			console.log("Finished posting chunked media!");

			// console.log(data);
			// while (data.processing_info.state === "pending") {
			// 	console.log("Sleeping " + data.processing_info.check_after_secs + " secs...");
			// 	await new Promise(r => setTimeout(r, data.processing_info.check_after_secs));
			// 	T.get('media/upload', { command: "STATUS", media_id: "1263871395437608961" }, function (err2, data2, response2) {
			// 		err = err2;
			// 		data = data2;
			// 		response = response2;
			// 	});
			// }

			replyWithMedia(err, data, response);
		})

		function replyWithMedia(errMedia, dataMedia, responseMedia) {
			console.log("Uploaded media!")

			console.log("Replying with media...")

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

			console.log("Waiting on mention in a reply...");
		}
	}
}

stream.on("tweet", tweetEvent);

stream.on("disconnect", function (disconn) {
	console.log("Disconnect");
});

stream.on("connect", function (conn) {
	console.log("Connecting");
	console.log("Waiting on mention in a reply...");
});

stream.on("reconnect", function (reconn, res, interval) {
	console.log("Reconnecting. statusCode:", res.statusCode);
});

console.log("Running");
