import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
const request = require('request');


//import registerServiceWorker from './registerServiceWorker';
var servers = ["https://cognition.dev.stackworx.cloud/api/status",
			   "https://ord.dev.stackworx.io/health",
			   "https://api.durf.dev.stackworx.io/health",
			   "https://prima.run/health",
			   "https://stackworx.io/",
			   "https://google.com"
			   ];

class Server extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			upTime: 0,
			displayPrevious: false
			
		};
		this.handleClick = this.handleClick.bind(this);
		this.startTime = null;
		this.ticking = false;
	}

	componentDidMount(){
		//if(this.props.status === "up"){
		const startTime = Date.now() - this.state.upTime;
		this.timer = setInterval(() =>{
			this.setState({	upTime: Date.now() - startTime });
			this.ticking = true;
		});
		//}

	}
	componentDidUpdate(){
		if(this.props.status === "other" || this.props.status === "down"){
			clearInterval(this.timer);
			this.ticking = false;
			//this.setState({ticking:false});
			//this.setState({upTime: this.state.upTime - 30000})
		}
		if((this.props.status === "up" && !this.ticking) || (this.props.status === "up" && !this.ticking)){
			console.log("THE TIME HAS BEEN RESTARTED");
			this.startTime = Date.now() - this.state.upTime;
			this.timer = setInterval(() =>{
			this.setState({upTime: Date.now() - this.startTime});
			this.ticking = true;
		});
		}

	}

	handleClick(){
		this.setState({
			displayPrevious: !this.state.displayPrevious
		});
	}
	render(){
		return(
			<div className="server" value = {this.props.status} onClick = {this.handleClick}>
			<h3><u>Server:</u><br /> {this.props.value}</h3>
			<div className="statusBar" value = {this.props.status}>{this.props.status}</div>
			{this.state.displayPrevious === true && this.props.previous != null ?
				(<p>Last response {this.props.previous}</p>) : (<p> no previous response </p>) }

			<p className="time">{milliToMinutes(this.state.upTime)}</p>
			</div>
			);
	}
}

const DocumentRoot = document.getElementById("root");

class ServerRack extends React.Component{
	constructor(props){
		super(props);
		this.state ={
			history: [{
				servers: Array(servers.length).fill(null),
			}],
			urls: servers,
			prev:Array(servers.length).fill(null),
			active: Array(servers.length).fill(null)


		}
		this.promise = null;
		this.stuff = null;
		this.parentDiv = document.createElement('div');
		this.el = document.createElement('div');
		this.el2 = document.createElement('div');
		this.stagingHeading = document.createElement('h1');
		this.productionHeading = document.createElement('h1');
	}
	checkStatus(){
		this.state.urls.map((item,key) => {

		request.get(item).on('response',(response) => {
		
			let activeCopy = this.state.active.slice();
	
			if(response.statusCode === 200){
			

			activeCopy[key] = "up";
			this.setState({
				active: activeCopy
			});
			//this.state.active[key] = "up";
			}else{
				activeCopy[key] = "down";
				this.setState({
				active: activeCopy
				});
			}
	
		}).on('error',(err) =>{
			let activeCopy = this.state.active.slice();
			//let activeCopyTwo = this.state.active;
			activeCopy[key] = "other";
			//console.log("error");
			this.setState({
				active: activeCopy
			});
		
		})

		});

		 this.pushHistory();

		setTimeout(function(){
      		this.checkStatus();
   		 }.bind(this), 30000);

	}
	 componentDidMount() {
	 	// renderInitial();
	 DocumentRoot.appendChild(this.parentDiv);
	 this.parentDiv.setAttribute("class","environment");

	 this.parentDiv.insertBefore(this.el, this.parentDiv.firstChild);
	 this.parentDiv.insertBefore(this.el2, this.parentDiv.firstChild);

	 this.stagingHeading.textContent="Staging";
	 this.productionHeading.textContent ="Production";
	 this.el.insertBefore(this.stagingHeading, this.el.firstChild);
	 this.el2.insertBefore(this.productionHeading, this.el2.firstChild);

	 this.el.setAttribute("class","staging");
	 this.el2.setAttribute("class","production");
	 this.checkStatus(); 	
	 console.log("checking health");

	
 	}

 	componentDidUpdate(){
 		//console.log("Component updated");
 	}

 	pushPrevious(){
 		if(this.state.history.length < 2){
 			return;
 		}
		console.log("push previous history");
 		const newHistory = this.state.history.slice();
 		console.log(newHistory[this.state.history.length -2].servers);
 		this.setState({'prev' : newHistory[this.state.history.length -1].servers});
 	}

	 pushHistory() {
	 	console.log("pushing history");
	 	const prev = this.state.active.slice();
	    const history = this.state.history.slice();
	    this.setState({
	      history: history.concat([{
	        servers: prev
	      }])
	    }, () => console.log("hey there"), this.pushPrevious());
	  }

	render(){
			// renderInitial();
		return(
		<div className ="portal">
		{
			this.stuff = this.state.urls.map((item,key) => 
			item.includes("dev") ?	
			ReactDOM.createPortal(
			<Server value={item} status= {this.state.active[key]}
					 previous = {this.state.prev[key]}/>,
			this.el
			) :
			ReactDOM.createPortal(
			<Server value={item} status= {this.state.active[key]}
					 previous = {this.state.prev[key]}/>,
			this.el2

			)
			)
		}
			
		</div>

		);
	}
}

function renderInitial(){
	ReactDOM.render(
		<div className="serverRoom">
				<h1>HELLO</h1>
				<div className="production"></div>
				<div className="staging"></div>
				
		</div>,
		document.body
		)
}






function milliToMinutes(millis){
	var minutes = Math.floor(millis / 60000);
	var seconds = ((millis % 60000) / 1000).toFixed(0);
	return minutes + " : " + (seconds < 10 ? '0' : '') + seconds; 
}
ReactDOM.render(<ServerRack/>, document.getElementById('root'));
//registerServiceWorker();
