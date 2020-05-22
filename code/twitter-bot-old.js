const Twit = require("twit");
const config = require("../config");
const fs = require("fs");

const T = new Twit(config);

const stream = T.stream("statuses/filter", {
	track: ["@vibingbot"]
});

// function tweetEvent(tweet) {
// 	// console.log(tweet);

// 	if (tweet.in_reply_to_status_id !== null) {
// 		// console.log(tweet);

// 		uploadMedia();

// 		function uploadMedia() {
// 			console.log("Uploading media...")
// 			// const fileName = "output videos/trees.jpg"; // needs base64
// 			// const fileName = "output videos/pizza.gif"; // needs base64
// 			const fileName = "output videos/bean.mp4"; // needs 
// 			// const fileName = "output videos/Satisfactory - Bean & Donkey Kong Country - Aquatic Ambience.mp4"; // needs
// 			// const fileName = "output videos/small.mp4"; // needs 

// 			const params = {
// 				encoding: "base64"
// 			}
// 			const file = fs.readFileSync(fileName, params);

// 			// const file = fs.readFileSync(fileName);

// 			console.log(typeof (file));
// 			console.log(file.length);

// 			T.post("media/upload", { media_data: file }, replyWithMedia);
// 		}

// 		function replyWithMedia(errMedia, dataMedia, responseMedia) {
// 			console.log("Uploaded media!")

// 			if (errMedia !== undefined) {
// 				console.log("errMedia:");
// 				console.log(errMedia);
// 			}

// 			// if (responseMedia !== undefined) {
// 			// 	console.log("responseMedia:");
// 			// 	console.log(responseMedia);
// 			// }

// 			console.log("Replying with media...")
// 			const name = tweet.user.screen_name;
// 			const reply = "You mentioned me! @" + name + " You are super cool!";
// 			const nameID = tweet.id_str;
// 			console.log("dataMedia.media_id_string:")
// 			console.log(dataMedia.media_id_string)
// 			const mediaID = dataMedia.media_id_string;

// 			const params = {
// 				status: reply,
// 				in_reply_to_status_id: nameID,
// 				media_ids: [mediaID]
// 			};

// 			T.post("statuses/update", params, tweeted);

// 			function tweeted(err, data, response) {
// 				if (err !== undefined) {
// 					console.log(err);
// 				} else {
// 					console.log("Tweeted: " + params.status);
// 				}
// 			}

// 			console.log("Waiting on mention in a reply...");
// 		}
// 	}
// }

// stream.on("tweet", tweetEvent);

// stream.on("disconnect", function (disconn) {
// 	console.log("Disconnect");
// });

// stream.on("connect", function (conn) {
// 	console.log("Connecting");
// 	console.log("Waiting on mention in a reply...");
// });

// stream.on("reconnect", function (reconn, res, interval) {
// 	console.log("Reconnecting. statusCode:", res.statusCode);
// });

// console.log("Running");
