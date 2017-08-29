/**
 * Created by jeevz on 27/08/17.
 */
/*Import react framework*/
import * as React from 'react';
import * as ReactDOM from 'react-dom';

/*Import custom styles*/
import './scss/app.scss';

/*Import components*/
import {RenderBodyElement} from "./components/body-element";

declare const $:any;

ReactDOM.render(<RenderBodyElement />, document.getElementById('root'));