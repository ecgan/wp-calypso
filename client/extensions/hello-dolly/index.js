/**
 * External dependencies
 */
import page from 'page';
import React from 'react';

/**
 * Internal dependencies
 */
import { navigation, siteSelection } from 'my-sites/controller';
import { renderWithReduxStore } from 'lib/react-helpers';
import { addReducer } from 'state';
import HelloWorldPage from './hello-world-page';
import reducer from './state/reducer';

/**
 * Extension init
 */
// TODO: Maybe make this part of the extension load/unload code for all extensions?
addReducer( 'helloDolly', reducer );

const render = ( context ) => {
	renderWithReduxStore( <HelloWorldPage />, document.getElementById( 'primary' ), context.store );
};

export default function() {
	page( '/hello-dolly/:site?', siteSelection, navigation, render );
}
