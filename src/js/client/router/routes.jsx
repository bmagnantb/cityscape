import React from 'react'
import { DefaultRoute, Route, Redirect } from 'react-router'

import AppView from '../components/AppView'
import GalleryView from '../components/GalleryView'
import LoginView from '../components/LoginView'
import RegisterView from '../components/RegisterView'
import DetailView from '../components/DetailView'
import PassEmailView from '../components/PassEmailView'
// import GalleryAddPage from './defaultParams'

export default (
	<Route path="/" handler={AppView}>
		<Route name="gallery" path="/gallery">
			<Route name="gallerysearch" path="/gallery/:tags/page:page" handler={GalleryView} />
			<Route name="gallerynosearch" path="/gallery/page:page" handler={GalleryView} />
			<Redirect from="*" to="gallerynosearch" params={{page: 1}} />
		</Route>
		<Route name="photo" path="/photo/:id/:tags?" handler={DetailView} />
		<Route name="login" path="/login" handler={LoginView} />
		<Route name="register" path="/register" handler={RegisterView} />
		<Route name="passemailsent" path="/passemailsent" handler={PassEmailView} />
		<Redirect from="*" to="gallerynosearch" params={{page: 1}}/>
	</Route>
)