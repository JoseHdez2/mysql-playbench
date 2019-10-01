import React from 'react';
import {Button, Card, Dropdown, Table} from 'react-bootstrap';
import './App.css';
import api from './api';
import util from 'util';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        MySQL Playbench
      </header>
      downtown
      <MySqlPlaybench />
    </div>
  );
}

class MySqlPlaybench extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      configs: [], // connection configs
      connections: [],
      clipboards: []
    }
  }

  createConn = async (config) => {
    let firstConnConfig = await api.createSqlConn(config).then(res => res.data);
    let connId = this.state.connections.length;
    let connTables = await api.getTables(connId).then(res => res.data);
    connTables = connTables.flatMap(t => Object.values(t));
    let newConn = { id: connId, config: firstConnConfig, tables: connTables };
    this.setState({ connections: [...this.state.connections, newConn] });
  }

  componentWillMount = async () => {
    this.createConn();
  }

  // selectDatabase = (connId, db) => {
  //   let conn = this.state.connections[connId];
  //   conn.database = db;
  //   this.setState({connect: conn})
  // }

  selectTable = async (connId, table) => {
    let connections = this.state.connections;
    connections[connId].selTable = table;
    await this.setState({ connections: connections })
    this.loadTable(connId, table); // bad practice?
  }

  loadTable = async (connId, table) => {
    let connections = this.state.connections;
    connections[connId].tableData = await api.loadTable(connId, table).then(res => res.data);
    this.setState({ connections: connections })
  }

  render() {
    let conns = this.state.connections || [];
    console.log(`marinara: ${util.inspect(conns)}`)
    return <div>
      <div>
        {conns.map(c => <ConnectionView conn={c} onSelectTable={this.selectTable}/>)}
      </div>
      <ConnCreator configs={this.state.configs} createConn={this.createConn} />
    </div>
  }
}

const ConnectionView = ({conn, onSelectTable}) => (
  <Card>
    <Card.Title>Connection [{conn.id}]</Card.Title>
    <Card.Subtitle>host: [{conn.config.host}], user: [{conn.config.user}]</Card.Subtitle>
    <span>
      Selected table:
      <DropdownSelector connId={conn.id} currIt={conn.selTable || '...'} items={conn.tables} onSelect={onSelectTable} />
    </span>
    <RoTable tableData={conn.tableData} />
  </Card>
);

const DropdownSelector = ({connId, currIt, items, onSelect}) => (
  <Dropdown>
    <Dropdown.Toggle id="dropdown-basic">
      {currIt}
    </Dropdown.Toggle>

    <Dropdown.Menu>
      {items.map(it => <Dropdown.Item onSelect={() => onSelect(connId, it)}>{it}</Dropdown.Item>)}
    </Dropdown.Menu>
  </Dropdown>
)

const RoTable = ({tableData}) => (
  <Table striped bordered hover>
    <thead>
      {inferColumnNames(tableData).map(h => <th>{h}</th>)}
    </thead>
    <tbody>
      {!tableData ? "" : tableData.map(row => <tr>{Object.values(row).map(field => <td>{field}</td>)}</tr>)}
    </tbody>
  </Table>
)

const inferColumnNames = (tableData) => !tableData ? [] :
                tableData.map(row => Object.keys(row))
                .flatMap(a => a)
                .filter((v, i, a) => a.indexOf(v) === i); // unique values (https://stackoverflow.com/a/14438954/3399416)

class ConnCreator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      configs: this.props.configs || [],
      selConfig: {}
    }
  }

  render() {
    return <div>
      <Button onClick={() => this.props.createConn(this.state.config)} variant="success">New Connection</Button>
    </div>
  }
}

export default App;
