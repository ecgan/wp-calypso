/**
 * External dependencies
 */
import React, { PropTypes } from 'react';
import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import Card from 'components/card';
import FormFieldset from 'components/forms/form-fieldset';
import FormLabel from 'components/forms/form-label';
import FormSelect from 'components/forms/form-select';
import MarkdownWpcom from './markdown-wpcom';

const Composing = ( {
	fields,
	handleToggle,
	onChangeField,
	eventTracker,
	isRequestingSettings,
	isSavingSettings,
	translate
} ) => {
	return (
		<Card className="site-settings">
			<FormFieldset>
				<FormLabel htmlFor="default_post_format">
					{ translate( 'Default Post Format' ) }
				</FormLabel>
				<FormSelect
					name="default_post_format"
					id="default_post_format"
					value={ fields.default_post_format }
					onChange={ onChangeField( 'default_post_format' ) }
					disabled={ isRequestingSettings || isSavingSettings }
					onClick={ eventTracker( 'Selected Default Post Format' ) }
				>
					<option value="0">{ translate( 'Standard', { context: 'Post format' } ) }</option>
					<option value="aside">{ translate( 'Aside', { context: 'Post format' } ) }</option>
					<option value="chat">{ translate( 'Chat', { context: 'Post format' } ) }</option>
					<option value="gallery">{ translate( 'Gallery', { context: 'Post format' } ) }</option>
					<option value="link">{ translate( 'Link', { context: 'Post format' } ) }</option>
					<option value="image">{ translate( 'Image', { context: 'Post format' } ) }</option>
					<option value="quote">{ translate( 'Quote', { context: 'Post format' } ) }</option>
					<option value="status">{ translate( 'Status', { context: 'Post format' } ) }</option>
					<option value="video">{ translate( 'Video', { context: 'Post format' } ) }</option>
					<option value="audio">{ translate( 'Audio', { context: 'Post format' } ) }</option>
				</FormSelect>
			</FormFieldset>

			{
				fields.markdown_supported &&
				<MarkdownWpcom
					handleToggle={ handleToggle }
					isSavingSettings={ isSavingSettings }
					isRequestingSettings={ isRequestingSettings }
					fields={ fields }
				/>
			}
		</Card>
	);
};

Composing.defaultProps = {
	isSavingSettings: false,
	isRequestingSettings: true,
	fields: {}
};

Composing.propTypes = {
	handleToggle: PropTypes.func.isRequired,
	onChangeField: PropTypes.func.isRequired,
	eventTracker: PropTypes.func.isRequired,
	isSavingSettings: PropTypes.bool,
	isRequestingSettings: PropTypes.bool,
	fields: PropTypes.object,
};

export default localize( Composing );
