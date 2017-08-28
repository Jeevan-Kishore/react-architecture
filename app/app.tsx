/**
 * Created by jeevz on 27/08/17.
 */
/*Import react framework*/
import * as React from 'react';
import * as ReactDOM from 'react-dom';

/*Import bootstrap styles*/
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-grid.css';

/*Import custom styles*/
import './less/app.less';

/*Import components*/
import {RenderBodyElement} from "./components/body-element";

declare const $:any;

ReactDOM.render(<RenderBodyElement />, document.getElementById('root'));