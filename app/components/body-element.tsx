import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {CodeNavBar} from "./nav-bar/code-nav-bar";
import {Component} from "react";

export class RenderBodyElement extends Component{
   constructor(props: any){
       super(props);
   }

   render(){
       return (
           <div className="parent-div container-fluid">
               <CodeNavBar />
               <h1>Hello world as usual!!</h1>
               <div>
                   <button type="button" className="btn btn-primary">Primary</button>
               </div>
           </div>
       );
   }
}

