import React, { Component } from 'react';
import Spinner from '../spinner.gif'
import axios from 'axios'

import  '../Search.css'


class Search extends Component {


	constructor(props) {
		super(props)
		this.state = {
			query: '',
			results: {},
			spinning: false,
			message: '',
			description: {},

			
		};

		this.cancel = ''
	}
	
	

	/**
	 * Get the result from search and update the state 
	 * Cancel requests  before sending a new request
	 * 
	 * @param  {[String]} query         the searched text
	 * 
	 */
	
	performSearch=(query) =>{
		this._isMounted = true;
		const url= `https://api.gavagai.se/v3/lexicon/en/${query}?additionalFields=SEMANTICALLY_SIMILAR_WORDS&apiKey=${process.env.REACT_APP_KEY}`
		
		/* 
		* Canceling a request using a cancel token.
		* Not to make a request after every character typed
		*   
		*/
		if(this.cancel) {
			this.cancel.cancel();
		}

		this.cancel= axios.CancelToken.source();

		axios.get( url, {
			cancelToken: this.cancel.token
			
		})
		.then(response=>{
		
			console.log(response.data)
			
			const noResultFound = ! response.data.semanticallySimilarWords.length
										? 'No search results'
										:''
			
				this.setState({
				results: response.data.semanticallySimilarWords,
				message: noResultFound,
				spinning: false,
				description: response.data.wordInformation
				})
		
		/* handle error*/
		}).catch(err=>{
			if(axios.isCancel(err)|| err){
				 console.log('Error: ', err.message); // => prints: Api is being canceled

				this.setState({
					spinning: false,
					message: 'Failed to fetch'
				})
			}
		})
		
	}

	/**
	 * a handler which is fired after on every key stroke
	 * 
	 * 
	 */
	handleInputChange=(event)=>{
		event.preventDefault();
		const query = event.target.value

		if(!query){
			this.setState({ 
				query, 
				results: {}, 
				message: '',
				description: {},
			});

		}else{
			this.setState({
				query,
				spinning: true,
				message: ''
			},()=>{
				this.performSearch(query)

			})
		}
		
	}
	
	/**
	 * show search result beneth the search input
	 * 
	 */
	showSearchResult =()=>{
		const { results, description} = this.state
		if(Object.keys( results ).length && results.length ){
			console.log(description)
			return (
				
				<div className="list-container">
					{/*<div className="list list-top">
						<div className="list-top--inner">
							<h1>Informations about the word</h1>
							<h4>Frequency of occurrence: {description.frequency} </h4>
							<h4>Absolute Rank of the Word : {description.absoluteRank}</h4>
							<h4>Additional Link : 

								<a href={description.additionalInformation.link}>
										Click here
									</a>
							</h4>
						</div>
						
					</div>*/}
					<ul>
						{ results.map( item => {
							return (
								<div className="list" key={ item.word }>
									<li  className="result-item">
										<h4 className="">{item.word}</h4>
									</li>
								</div>
								
							)
						} ) }
					</ul>
						
				</div>



				
			)

		}
	}



  render() {
  	const {query,message, spinning} = this.state
		return(

			<div className="container">
				
				<label className="search-label" htmlFor="search-input">
					<input
						type="text"
						name="query"
						value={query}
						id="search-input"
						placeholder="Search..."
						onChange={this.handleInputChange}

					/>
					<i className="fas fa-search search-icon"/>
				</label>

				{ this.showSearchResult() }

				{	/*
					* If there is a message , message error  will be shown
					*/
				}

				{message && 
					<p className="error-message">
						{ message }
					</p>
				}
				
				
				<img 
					src={ Spinner } 	
					className={`spinner-icon ${ spinning ? 'show' : 'hide' }`}
					alt="Spinner gif"/>

			</div>
			)
  	}
    
}

export default Search
