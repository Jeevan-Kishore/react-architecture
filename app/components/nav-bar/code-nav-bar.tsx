import * as React from 'react';
import {Component} from 'react';

export class CodeNavBar extends Component{
    render(){
        return (
            <nav className="navbar navbar-expand-lg navbar-light bg-light row">
                <a className="navbar-brand clickable" >Quintype</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item active">
                            <a className="nav-link clickable" >Diamond Sweeper <span className="sr-only">(current)</span></a>
                        </li>
                    </ul>
                </div>
            </nav>
        );
    }
}