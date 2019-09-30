import React from 'react';
import {Dropdown} from 'react-bootstrap';
import './App.css';
import api from './api';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        MySQL Playbench
      </header>
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

  componentWillMount = async () => {
    let firstConnConfig = await api.createSqlConn();
    let firstConnTables = await api.getTables(0); // .then((res) => {console.log("pizza:" + res); res.flatMap(t => t.values())});
    firstConnTables = firstConnTables.flatMap(t => t.values());
    let firstConn = {config: firstConnConfig, tables: firstConnTables};
    this.setState({ connections: [firstConn]});
  }

  selectDatabase = (connId, db) => {
    let conn = this.state.connections[connId];
    conn.database = db;
    this.setState({connect: conn})
  }

  render() {
    let conns = this.state.connections;
    return <div>{conns.map(c => <p>{(c.tables || []).join()}</p>)}</div>
  }
}

const DropdownDatabase1 = ({currentDatabase, databases, selectDatabase}) => (
  <Dropdown>
    <Dropdown.Toggle id="dropdown-basic">
      {currentDatabase}
    </Dropdown.Toggle>

    <Dropdown.Menu>
      {databases.map(db => <Dropdown.Item onSelect={() => selectDatabase(db)}>{db}</Dropdown.Item>)}
    </Dropdown.Menu>
  </Dropdown>
)

const RoTable = () => (
  <p>ro-table</p>
)

export default App;
