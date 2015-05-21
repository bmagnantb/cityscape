import React from 'react'
import Router from 'react-router'

export default class GalleryAddPage extends React.Component {}

GalleryAddPage.willTransitionTo = function(transition, params) {
	if (params.tags) return transition.redirect(`/gallery/${params.tags}/page1`)
	else return transition.redirect('/gallery/page1')
}
