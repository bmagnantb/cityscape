module.exports = weightVotes

// set weighted votes
function weightVotes(photo, tags) {
		var weighted_votes = 0

		// if request tags exist, weight the votes
		if (tags.length) {

				// total vote holder for subtracting weighted votes
				var totalVote = photo.total_votes

				// check tag votes for each request tag
				for (var i = 0, arr = tags, imax = arr.length; i < imax; i++) {

						// if photo has matching tag vote, double and subtract from total votes
						if (photo.tag_votes[arr[i]]) {
								weighted_votes = photo.tag_votes[arr[i]] * 2
								totalVote -= photo.tag_votes[arr[i]]
						}
				}

				// after weighting, add fifth of remaining total votes
				weighted_votes += Math.round(totalVote / 5)
		}

		// if request tags don't exist, use total votes
		else weighted_votes = photo.total_votes

		return weighted_votes

}