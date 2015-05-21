module.exports = photoMock()

function photoMock() {

	return {
		_owner_url: "https://www.flickr.com/people/113365131@N02",
		date_uploaded: 1428406916,
		dates: {
			lastupdate: "1429111420",
			posted: "1428406916",
			taken: "2015-04-07 19:12:38",
			takengranularity: 0,
			takenunknown: "1"
		},
		description: {
			_content: "Canon AE-1↵FD 50mm f/1.8↵Kodak Ektar 100↵Double Exposure ↵Hong Kong↵↵This shot is unedited. I took this double exposure as an experiment to see if I could &quot;make&quot; my own Revolog Kolor film. It's pretty easy to do; I chose red because I've been considering getting some redscale film because it's incredibly cheap. I'll definitely be taking more of these. "
		},
		farm: 9,
		height_m: "331",
		location: {
			accuracy: "16",
			context: "0",
			country: {
				_content: "Hong Kong",
				place_id: "4Jji9AVTVrLRrBR9Zg",
				woeid: "24865698"
			},
			latitude: "22.287994",
			longitude: "114.137767",
			neighbourhood: {
				_content: "Kennedy Town",
				place_id: "CM7rYadTVr3sbUPLMA",
				woeid: "24702912"
			},
			place_id: "CM7rYadTVr3sbUPLMA",
			region: {
				_content: "Central and Western",
				place_id: "_0bX7CNTVr1qai3swg",
				woeid: "24703128"
			},
			woeid: "24702912"
		},
		owner: "113365131@N02",
		ownername: "Hayden_Williams",
		photo_id: "16879221559",
		secret: "c802fa303c",
		server: "8751",
		tag_votes: {
			china: 1
		},
		tags: ["china", "road", "street", "city", "red", "people", "urban", "streets", "film", "analog", "canon", "vintage", "buildings", "hongkong", "asia", "traffic", "kodak", "doubleexposure", "grain", "hipster", "streetphotography", "retro", "multipleexposure", "fd50mmf18", "analogue", "grainy", "canonae1", "kolor", "redscale", "kodakektar", "revolog", "ektar100", "revologkolor"],
		title: "Velvet Pulse",
		total_votes: 2,
		url_m: "https://farm9.staticflickr.com/8751/16879221559_c802fa303c.jpg",
		urls: {
			url: [{
				Object_content: "https://www.flickr.com/photos/haydilliams/16879221559/",
				type: "photopage"
			}]
		},
		user_votes: ["kurtzmaple", "maplekurtz"],
		weighted_votes: 2,
		width_m: "500",
		_photoUrl: function(size) {
			return `https://farm${this.farm}.staticflickr.com/${this.server}/${this.photo_id}_${this.secret}_${size}.${this.originalformat ? this.originalformat : 'jpg'}`
		}
	}
}