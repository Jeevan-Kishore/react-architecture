import * as React from 'react';

import {CodeNavBar} from './nav-bar/code-nav-bar';
import {Component} from 'react';

export class RenderBodyElement extends Component{
   constructor(props: any){
       super(props);
   }
    componentDidMount () {
        this.getData();
    }
    async getData () {
        const rawData = await fetch('http://headers.jsontest.com/');
        const data = await rawData.json();
        console.log('data', data);
    }

   render(){
       return (
           <div className='parent-div container-fluid'>
               <CodeNavBar />
               <h1>Hello world as usual!!</h1>
           </div>
       );
   }
}

