import React, {useState, useEffect} from 'react';
export default function GolGame ({width, height, timeInterval}): any {

    const [tableWidth, setTableWidth] = useState(width);
    const [tableHeight, setTableHeight] = useState(height);
    const [iterationHander, setIterationHander] = useState(null);
    const [iterationRunning, setIterationRunning] = useState(false);
    const [currentCycle, setCurrentCycle] = useState(0);

    const makeEmptyTable = function() : any{
        let table = [];
        for (let i = 0; i < tableWidth; i++) {
            table[i] = [];
            for (let j = 0; j < tableHeight; j++) {
                table[i][j] = false;
            }
        }
        return table;
    }

    const [golTable, setGolTable] = useState(makeEmptyTable());

    const calculateActiveNeighbors = function(y, x){
        let activeNeighbors = 0;
        let neighborDirections = [[0, 1], [0, -1], [1, 0], [1, 1], [1, -1], [-1, 0], [-1, 1], [-1, -1]];

        // neighborDirections.lenhth is 8
        for(let i = 0; i < 8; i++) {
            let currY = y + neighborDirections[i][0];
            let currX = x + neighborDirections[i][1];

            if (currX >= 0 && currX < tableHeight && currY >= 0 && currY < tableWidth && Array.isArray(golTable) && golTable[currY][currX]) {
                activeNeighbors++;
            }
        }
        return activeNeighbors;
    }

    const computeNextTable = function(){
        let newEmptyTable = makeEmptyTable();
        for (let i = 0; i < tableWidth; i++) {
            for (let j = 0; j < tableHeight; j++) {
                let activeNeighbors = calculateActiveNeighbors(j, i);
                if ((Array.isArray(golTable) && golTable[i][j] && (activeNeighbors === 2 || activeNeighbors === 3)) || (Array.isArray(golTable) && !golTable[i][j] && activeNeighbors === 3)) {
                    newEmptyTable[i][j] = true;
                } else {
                    newEmptyTable[i][j] = false;
                }
            }
        }
        return newEmptyTable;
    }

    const getDisplayTable = function (newTable) {

        let currTable = newTable ? newTable : golTable;
        var rows = Array.isArray(currTable) ? currTable?.map(function (item, i){
            var entry = item?.map(function (element, j) {
                return ( 
                    <td className='border-solid border-2 border-black' style={{width:"5px", height:"5px", backgroundColor: (currTable[i][j] ? "#000" : "#fff")}} key={j+'-'+i}><button  style={{width:"25px", height:"5px", backgroundColor: (currTable[i][j] ? "#000" : "#fff")}} onClick={() => toggleTableCellValue(i,j)} ></button></td>
                );
            });
            return (
                <tr className='border-solid border-2 border-black' key={i}>{entry?entry:'-'}</tr>
             );
        }) : <tr className='border-solid border-2 border-black' key={0}><td>-</td></tr>;
        return (
            <table style={{"display":"flex", "alignItems":"center", "justifyContent": "center", "marginTop":"50px"}}>
                <tbody>
                    {rows}
                </tbody>
            </table>
        );
    }

    const [displayTable, setdisplayTable] = useState(getDisplayTable(undefined));

    const toggleTableCellValue= function(y, x) {
        console.log(y, x);
        if(Array.isArray(golTable)) {
            let newTable = golTable;
            newTable[y][x] = !golTable[y][x];
            setGolTable(newTable);
            setdisplayTable(getDisplayTable(newTable))
            setCurrentCycle(currentCycle+1)
        }
    }

    const toggleRunningIteration = function () {
        setIterationRunning(!iterationRunning);
    }

    useEffect(() => {
        let i = 0;
        function callFunc() {
            console.log({iterationRunning})
            // if (iterationRunning) {
                let nextTable = computeNextTable()
                setGolTable(nextTable)
                setdisplayTable(getDisplayTable(nextTable))
                setCurrentCycle(currentCycle+1)
                console.log(i);
                i++;
            // }
        }
        const sinterval = setInterval(callFunc, timeInterval);
        return () => clearInterval(sinterval);
    }, [])

    return (<>
        { displayTable }
        <div>
            {currentCycle}
        </div>
        <button onClick={toggleRunningIteration}>Toggle~{iterationRunning?'T':'F'}</button>
    </>);
}