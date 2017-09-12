import * as React from 'react';
import {Component} from 'react';
import * as localforage from 'localforage';
require('pnotify/src/pnotify.css'); //Import pnotify css for notification support
const PNotify = require('pnotify/src/pnotify.desktop.js'); //Import pnotify js for notification support

interface MatrixInterface{
    matrix: MatrixCell[],
    gameComplete: boolean
}

interface MatrixCell{
    displayData: string,
    clicked: boolean,
    diamondFlag: boolean
    showArrow: boolean
}

export class DiamondSweeperComponent extends Component{
    state:MatrixInterface;
    NUMBER_OF_DIAMONDS:number = 8;
    COLUMN_COUNT:number = 8;
    ROW_COUNT:number = 8;
    diamondsFound:number = 0;
    diamondsIndices: number[] = [];
    gameScore: number = 0;

    constructor(props: any){
        super(props);
        this.state = {
            matrix : [],
            gameComplete: false
        }
    }
    componentDidMount () {
        this.getMatrix();
    }

    getInitialState () {
        const matrixInitState: MatrixInterface =  {
            matrix:  [],
            gameComplete: false
        };
        return matrixInitState;
    }

    async getMatrix(){
        const matrix = await this.replaceQuestionWithDiamonds();
        this.setState({ matrix });
    }

    async replaceQuestionWithDiamonds(){
        const questionMatrix = await this.getQuestionableMatrix(this.ROW_COUNT,this.COLUMN_COUNT);
        const diamondCell:MatrixCell = {
            displayData: 'questionMarkTag',
            clicked: false,
            diamondFlag: true,
            showArrow: false
        };

        for(let diamondNumber = 0; diamondNumber < this.NUMBER_OF_DIAMONDS; diamondNumber++){
            const randomnIndex = this.getRandomDiamondPositions(0 , questionMatrix.length - 1);
            questionMatrix[randomnIndex] = diamondCell;
            this.diamondsIndices.push(randomnIndex);
        }
        return questionMatrix;
    }

    getClosest(inputArray: number[], element: number){
        let closest = Math.max.apply(null, inputArray);
        for(let i = 0; i < inputArray.length; i++){
            if(inputArray[i] >= element && inputArray[i] < closest){
                closest = inputArray[i];
            }
        }
        return closest;
    }

    getQuestionableMatrix(row:number, col:number) {
        const cellData:MatrixCell = {
            displayData: 'questionMarkTag',
            clicked: false,
            diamondFlag: false,
            showArrow: false
        };

        return new Array(row * col).fill(cellData);
    };


    getRandomDiamondPositions(min: number, max: number)
    {
        return Math.floor(Math.random()*(max - min + 1) + min);
    }

    async revealCell(event: any, incomingIndex: number){
        event.preventDefault();
        if(this.state.gameComplete) {
            return;
        }
        const currentState: MatrixInterface = $.extend(true,{}, this.state); //Deep copy state object, needed to setstate after computation
        const diamondCellState: MatrixCell = {
            displayData: 'diamondMarkTag',
            clicked: true,
            diamondFlag: true,
            showArrow: false
        };
        const emptyCellState: MatrixCell = {
            displayData: '',
            clicked: true,
            diamondFlag: false,
            showArrow: false
        };

        await this.setState(currentState); //Setback the entire object
        if(currentState.matrix[incomingIndex].diamondFlag){
            currentState.matrix[incomingIndex] = diamondCellState;
            this.diamondsFound++;
            const diamondIndex = this.diamondsIndices.findIndex((ele) => ele === incomingIndex );
            this.diamondsIndices.splice(diamondIndex, 1);
            await this.clearPreviousArrow();
        } else{
            currentState.matrix[incomingIndex] = emptyCellState;
            await this.clearPreviousArrow();
            await this.showNearestDiamond(incomingIndex);
        }
        this.checkWinCriteria();

    }

    checkWinCriteria(){
        if(this.diamondsFound === this.NUMBER_OF_DIAMONDS){
            this.state.matrix.forEach((cell) => {
                !cell.clicked && this.gameScore++;
            });
            this.setState({gameComplete: true});
            this.showNotification('Game Status', `Game complete : ${this.gameScore}`, 'success');
        }
    }

    async clearPreviousArrow(){
        const currentState: MatrixInterface = $.extend(true,{}, this.state);
        currentState.matrix =  await currentState.matrix.map((cell) => {
            cell.showArrow = false;
            return cell;
        });
        await this.setState(currentState);
    }

    async showNearestDiamond(currentIndex: number){
        const closestIndex = this.getClosest(this.diamondsIndices, currentIndex);
        if(!this.state.matrix[closestIndex].clicked){
            const stateClone : MatrixInterface = $.extend(true,{}, this.state);
            stateClone.matrix[closestIndex].showArrow = true;
            await this.setState(stateClone);
        }
    }

    generateCells(){
        const cells = this.state.matrix.map((cell: MatrixCell, index: number) => {
            return (
                <div key={`cell-${index}`} className={`col col-sm matrix-cells`}>
                    {cell.showArrow ? <div className="arrowTag">&nbsp;</div> : null}
                    <button className={`btn btn-light clickable ${cell.displayData}`} onClick={ (e) => this.revealCell(e, index) }>&nbsp;</button>
                </div>
            )
        });

        for(let i = 1; i < cells.length; i++){ //Loop through array to insert break points after specified number of column elements
            if(i % (this.COLUMN_COUNT + 1) === 0){
                cells.splice(i-1, 0, this.generateBreakPoint(i));
            }
        }

        return cells;
    }

    generateBreakPoint(index: number){
        return(
            <div key={`break-${index}`} className="w-100"></div>
        )
    }

    showGameAlert(){
        return (
            <div className="col-sm-6 game-complete-notification">
                <div className="alert alert-info alert-dismissible fade show" role="alert">
                    Game complete. Score : {this.gameScore}
                </div>
            </div>
        )
    }

    renderSaveLoadGame(){
        return (
            <div className="col-sm-6 game-options-col">
                <button type="button" className="btn btn-outline-primary clickable save-button" onClick={(e) => this.saveGame(e)}>Save Game</button>
                <button type="button" className="btn btn-outline-secondary clickable load-button" onClick={(e) => this.loadGame(e)}>Load Game</button>
            </div>
        )
    }

    async saveGame(event: any){
        event.preventDefault();
        await localforage.setItem('diamondSweeperMatrix', this.state.matrix);
        await localforage.setItem('diamondSweeperDiamondIndices', this.diamondsIndices);
        this.showNotification('Game Notification', 'Game saved', 'success');
    }

    async loadGame(event: any){
        event.preventDefault();
        const savedState = await localforage.getItem('diamondSweeperMatrix');
        const savedDiamondIndices = await localforage.getItem('diamondSweeperDiamondIndices').then((response: number[]) => response);
        if (savedState && savedDiamondIndices){
            await this.setState({matrix : savedState});
            this.diamondsIndices = Array.from(savedDiamondIndices);
            this.showNotification('Game Notification', 'Game loaded', 'success');
        }else{
            this.showNotification('Game Notification', 'No previous data to load', 'error');
        }
    }

    showNotification(title:string, text: string, type: string){
        PNotify.desktop.permission();
        new PNotify({
            title: title,
            text: text,
            styling: 'bootstrap3',
            animate_speed: 'normal',
            shadow: true,
            hide: true,
            delay: 2000,
            type: type,
            desktop: {
                desktop: true
            }
        });
    }


    render(){
        return (
            <div className="matrixWrapper col-12 col-sm-12 col-md-10 col-lg-10 col-xl-10">
                <div className="row justify-content-between infoBoxWrapper">
                    {!this.state.gameComplete ? this.renderSaveLoadGame() : null}
                    {this.state.gameComplete ? this.showGameAlert() : null}
                </div>
                <div className="row">
                    {this.generateCells()}
                </div>
            </div>
        );
    }
}

