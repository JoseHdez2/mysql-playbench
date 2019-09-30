import React from 'react';
import {Dropdown} from 'react-bootstrap';
import './App.css';

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
      "url": null,
      database1Name: "initialValue",
      table1Name: null,
      database2Name: null,
      table2Name: null
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
