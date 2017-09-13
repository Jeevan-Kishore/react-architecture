import * as React from 'react';
import {Link} from 'react-router-dom';

interface NavbarState {
    activeLink: string
}

export class CodeNavBar extends React.Component{

    state: NavbarState;

    constructor(props: any){
        super(props);
        this.state = {
            activeLink : 'home'
        }
    }


    render(){
        return (
            <nav className="navbar navbar-expand-lg navbar-light bg-light row">
                <a className="navbar-brand clickable" >Quintype</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto">
                        <li className={`nav-item ${this.state.activeLink === 'home' ? 'active' : ''}`}>
                            <Link className="nav-link clickable" onClick={() => this.setState({activeLink : 'home'}) } to='/'>Home</Link>
                        </li>
                        <li className={`nav-item ${this.state.activeLink === 'diamond' ? 'active' : ''}`}>
                            <Link className="nav-link clickable" onClick={() => this.setState({activeLink : 'diamond'}) } to='/diamond-sweeper'>Diamond Sweeper</Link>
                        </li>
                    </ul>
                </div>
            </nav>
        );
    }
}