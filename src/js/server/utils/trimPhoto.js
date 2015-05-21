export default function trimPhoto(data) {
	if (data.photo) data = data.photo
	var photo = {}
	var props = ['farm', 'server', 'photo_id', 'secret', 'original_format', 'owner', 'urls', 'description', 'location', 'dates', 'ownername', 'url_m', 'height_m', 'width_m', 'title', 'dateuploaded', 'dateupload', 'tags', 'id']

	for (var i = 0, arr = props, imax = arr.length; i < imax; i++) {
		if (data[arr[i]]) photo[arr[i]] = data[arr[i]]
	}

	if (photo.owner && photo.owner instanceof Object) {
		photo.ownername = photo.owner.username
		photo.owner = photo.owner.path_alias
	}
	if (photo.title && photo.title instanceof Object) photo.title = photo.title._content
	if (photo.tags instanceof Object) {
		var extractedTags = []
		for (var i = 0, arr = photo.tags.tag, imax = arr.length; i < imax; i++) {
			extractedTags.push(arr[i]._content)
		}
		photo.tags = extractedTags
	}
	if (photo.tags && typeof photo.tags === 'string') photo.tags = photo.tags.split(' ')
	if (photo.dateupload) {
		photo.date_uploaded = +photo.dateupload
		delete photo.dateupload
	}
	if (photo.dateuploaded) {
		photo.date_uploaded = +photo.dateuploaded
		delete photo.dateuploaded
	}
	if (photo.id) {
		photo.photo_id = photo.id
		delete photo.id
	}

	return photo
}
