import { FixedSizeGrid as Grid } from 'react-window';
import React from 'react';
import {Badge, Table} from 'react-bootstrap';
import {useEffect, useState} from 'react';

// https://stackoverflow.com/a/36862446/3399416
function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height
    };
}

// https://stackoverflow.com/a/36862446/3399416
export default function useWindowDimensions() {
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

    useEffect(() => {
        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowDimensions;
}

const VirtTableCell = ({ columnIndex, rowIndex, data, style, onSelect }) => {
  if(rowIndex == 0){ 
    return <div style={style}><Badge style={{color: "red"}}>{data[rowIndex][columnIndex]}</Badge></div>
  } else {
    return <div style={style} onClick={onSelect ? () => onSelect(columnIndex, rowIndex) : console.log("No onSelect()")}>
      {data[rowIndex][columnIndex]}
    </div>
  }
}
   
export const VirtualTable = ({tableData, onSelect}) => {
const { height, width } = useWindowDimensions();
const headers = inferColumnNames(tableData);
const tableData2 = isNonEmptyArr(tableData) ? [headers, ...tableData.map(row => Object.values(row))] : []

return (<Grid
    columnCount={headers.length}
    columnWidth={300}
    height={150}
    rowCount={tableData2.length}
    rowHeight={35}
    itemData={tableData2}
    width={width*.98}
>
    {VirtTableCell}
</Grid>
)};

const extractMaxWidth = (arr) => {
  return arr.map()
}

/**
 * Uses canvas.measureText to compute and return the width of the given text of given font in pixels.
 * 
 * @param {String} text The text to be rendered.
 * @param {String} font The css font descriptor that text is to be rendered with (e.g. "bold 14px verdana").
 * 
 * @see https://stackoverflow.com/questions/118241/calculate-text-width-with-javascript/21015393#21015393
 */
function getTextWidth(canvas, text, font) {
  // re-use canvas object for better performance
  var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
  var context = canvas.getContext("2d");
  context.font = font;
  var metrics = context.measureText(text);
  return metrics.width;
}

export const RoTable = ({tableData, settings}) => (
    <Table striped bordered hover size="sm" variant={settings.dark ? "dark":"light"}>
      <thead>
        {inferColumnNames(tableData).map(h => <th>{h}</th>)}
      </thead>
      <tbody>
        {!tableData ? "" : tableData.map(row => <tr>{Object.values(row).map(field => <td>{field}</td>)}</tr>)}
      </tbody>
    </Table>
  )

/* infer column names from rows that may not have the complete column set. */
const inferColumnNames = (tableData) => isNonEmptyArr(tableData) ?
                tableData.map(row => Object.keys(row))
                .flatMap(a => a)
                .filter((v, i, a) => a.indexOf(v) === i) : []; // unique values (https://stackoverflow.com/a/14438954/3399416)

/* Get columns from first row. */
const getColumnNames = (tableData) => isNonEmptyArr(tableData) ? Object.keys(tableData[0]) : [];

const isNonEmptyArr = (arr) => Array.isArray(arr) && arr.length;