import * as React from 'react';
import {Component} from 'react';
import Event = JQuery.Event;
import {URLFormatOptions} from "url";

interface MatrixInterface{
    matrix: MatrixCell[]
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
    diamondsFound:number = 0;
    diamondsIndices: number[] = [];

    constructor(props: any){
        super(props);
        this.state = {
            matrix : []
        }
    }
    componentDidMount () {
        this.getMatrix();
    }

    getInitialState () {
        const matrixInitState: MatrixInterface =  {
            matrix:  []
        };
        return matrixInitState;
    }

    async getMatrix(){
        const matrix = await this.replaceQuestionWithDiamonds();
        this.setState({ matrix });
    }

    async replaceQuestionWithDiamonds(){
        const questionMatrix = await this.getQuestionableMatrix(8,8);
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
        console.log('Diamond indices', this.diamondsIndices);
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

        event.preventDefault();


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
        if(this.diamondsFound === this.NUMBER_OF_DIAMONDS){
            let gameScore = 0;
            this.state.matrix.forEach((cell) => {
                !cell.clicked && gameScore++;
            });
            alert(`Game complete - Score : ${gameScore}`);
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
        console.log(currentIndex, closestIndex);
            if(!this.state.matrix[closestIndex].clicked){
                const stateClone : MatrixInterface = $.extend(true,{}, this.state);
                stateClone.matrix[closestIndex].showArrow = true;
                await this.setState(stateClone);
            }
    }


    render(){
        return (
            <div className="matrixWrapper col-12">
                <div className="row">
                    {this.state.matrix.map((cell, index) => {
                        return (
                            <div key={`cell-${index}`} className="col matrix-cells ">
                                {cell.showArrow ? <div className="arrowTag">&nbsp;</div> : null}
                                <button className={`btn btn-light clickable ${cell.displayData}`} onClick={ (e) => this.revealCell(e, index) }>&nbsp;</button>
                            </div>
                        )
                    })}
                </div>
            </div>
        );
    }
}

