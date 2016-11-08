/**
 * External dependencies
 */
var React = require( 'react' ),
	debug = require( 'debug' )( 'calypso:my-sites:people:team-list' ),
	omit = require( 'lodash/omit' );

/**
 * Internal dependencies
 */
var Card = require( 'components/card' ),
	PeopleListItem = require( 'my-sites/people/people-list-item' ),
	UsersActions = require( 'lib/users/actions' ),
	InfiniteList = require( 'components/infinite-list' ),
	deterministicStringify = require( 'lib/deterministic-stringify' ),
	NoResults = require( 'my-sites/no-results' ),
	analytics = require( 'lib/analytics' ),
	PeopleListSectionHeader = require( 'my-sites/people/people-list-section-header' ),
	config = require( 'config' );

module.exports = React.createClass( {
	displayName: 'Team',

	getInitialState: function() {
		return {
			bulkEditing: false
		};
	},

	isLastPage() {
		return this.props.totalUsers <= this.props.users.length + this.props.excludedUsers.length;
	},

	fetchHasCompleted() {
		return this.props.fetchInitialized && ! this.props.fetchingUsers;
	},

	render: function() {
		var key = deterministicStringify( omit( this.props.fetchOptions, [ 'number', 'offset' ] ) ),
			headerText = this.translate( 'Team', { context: 'A navigation label.' } ),
			listClass = ( this.state.bulkEditing ) ? 'bulk-editing' : null,
			people,
			showRoles = ! this.props.search && config.isEnabled( 'manage/people/role-filtering' );

		if ( this.fetchHasCompleted() && ! this.props.users.length && this.props.fetchOptions.search ) {
			return (
				<NoResults
					image="/calypso/images/people/mystery-person.svg"
					text={
						this.translate( 'No results found for {{em}}%(searchTerm)s{{/em}}',
							{
								args: { searchTerm: this.props.search },
								components: { em: <em /> }
							}
						)
					} />
			);
		}

		if ( this.fetchHasCompleted() && this.props.site && ( this.props.users.length || this.props.role ) ) {
			if ( this.props.search && this.props.totalUsers ) {
				headerText = this.translate(
					'%(numberPeople)d Person Matching {{em}}"%(searchTerm)s"{{/em}}',
					'%(numberPeople)d People Matching {{em}}"%(searchTerm)s"{{/em}}',
					{
						count: this.props.users.length,
						args: {
							numberPeople: this.props.totalUsers,
							searchTerm: this.props.search
						},
						components: {
							em: <em />
						}
					}
				);
			}

			if ( this.props.role && this.props.users.length === 0 ) {
				const noResultsMessage = this.translate(
					'No users have this role on this site'
				);
				people = (
					<NoResults
						image="/calypso/images/people/mystery-person.svg"
						text={ noResultsMessage }
					/>
				);
			} else {
				people = (
					<InfiniteList
						key={ key }
						items={ this.props.users }
						className="people-selector__infinite-list"
						ref="infiniteList"
						fetchingNextPage={ this.props.fetchingUsers }
						lastPage={ this.isLastPage() }
						fetchNextPage={ this._fetchNextPage }
						getItemRef={ this._getPersonRef }
						renderLoadingPlaceholders={ this._renderLoadingPeople }
						renderItem={ this._renderPerson }
						guessedItemHeight={ 126 }>
					</InfiniteList>
				);
			}
		} else {
			people = this._renderLoadingPeople();
		}

		return (
			<div style={{minHeight: "300px"}}>
				<PeopleListSectionHeader
					role={ this.props.role }
					showRoles={ showRoles }
					label={ headerText }
					site={ this.props.site }
					count={ this.props.fetchingUsers || this.props.fetchOptions.search ? null : this.props.totalUsers } />
				<Card className={ listClass }>
					{ people }
				</Card>
				{ this.isLastPage() && <div className="infinite-scroll-end" /> }
			</div>
		);
	},

	_renderPerson: function( user ) {
		return (
			<PeopleListItem
				key={ user.ID }
				user={ user }
				type="user"
				site={ this.props.site }
				isSelectable={ this.state.bulkEditing } />
		);
	},

	_fetchNextPage: function() {
		var offset = this.props.users.length;
		var fetchOptions = Object.assign( {}, this.props.fetchOptions, { offset: offset } );
		analytics.ga.recordEvent( 'People', 'Fetched more users with infinite list', 'offset', offset );
		debug( 'fetching next batch of users' );
		UsersActions.fetchUsers( fetchOptions );
	},

	_getPersonRef: function( user ) {
		return 'user-' + user.ID;
	},

	_renderLoadingPeople: function() {
		return <PeopleListItem key="people-list-item-placeholder" />;
	}
} );