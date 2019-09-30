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
    api.createSqlConn();
    this.state = {
      connections: []
    }
  }

  selectDatabase1 = (db) => {
    this.setState({database1Name: db})
  }

  render() {
    let db1 = this.state.database1Name;
    return <div><DropdownDatabase1 currentDatabase={db1} databases={["a","b"]} selectDatabase={this.selectDatabase1} /></div>
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
