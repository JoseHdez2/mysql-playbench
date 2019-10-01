import React from 'react';
import {Dropdown} from 'react-bootstrap';
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
      connections: []
    }
  }

  createConn = async () => {
    let firstConnConfig = await api.createSqlConn().then(res => res.data);
    let connId = this.state.connections.length;
    let connTables = await api.getTables(connId).then(res => res.data);
    connTables = connTables.flatMap(t => Object.values(t));
    let firstConn = { id: connId, config: firstConnConfig, tables: connTables };
    this.setState({ connections: [firstConn] });
  }

  componentWillMount = async () => {
    this.createConn();
  }

  // selectDatabase = (connId, db) => {
  //   let conn = this.state.connections[connId];
  //   conn.database = db;
  //   this.setState({connect: conn})
  // }

  selectTable = (connId, table) => {
    let connections = this.state.connections;
    connections[connId].selTable = table;
    this.setState({ connections: connections })
  }

  render() {
    let conns = this.state.connections || [];
    console.log(`marinara: ${util.inspect(conns)}`)
    return <div>{conns.map(c => <ConnectionView conn={c} onSelectTable={this.selectTable}/>)}</div>
  }
}

const ConnectionView = ({conn, onSelectTable}) => (
  <div>
    Connection [{conn.id}] (user: {conn.user} : {conn.password})
    <DropdownSelector curIt={conn.selTable || '...'} items={conn.tables} onSelect={() => this.selectTable(conn.id)} />
  </div>
);

const DropdownSelector = ({currIt, items, onSelect}) => (
  <Dropdown>
    <Dropdown.Toggle id="dropdown-basic">
      {currIt}
    </Dropdown.Toggle>

    <Dropdown.Menu>
      {items.map(it => <Dropdown.Item onSelect={() => onSelect(it)}>{it}</Dropdown.Item>)}
    </Dropdown.Menu>
  </Dropdown>
)

const RoTable = () => (
  <p>ro-table</p>
)

export default App;
