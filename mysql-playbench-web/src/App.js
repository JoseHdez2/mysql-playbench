import React from 'react';
import {Button, Card, Dropdown, DropdownButton, Table} from 'react-bootstrap';
import './App.css';
import api from './api';
import util from 'util';
import {RoTable, VirtualTable} from './util/table';

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
      configs: [], // loaded connection configs
      connections: [], // currently open connections
      clipboards: [], // data that the user has clipped
      events: [], // local events log
      settings: { // webapp visualization settings
        dark: false,
        size: "jumbo"
      }
    }
  }

  getConfigs = async () => {
    let configs = await api.getConfigs();
    this.setState({configs: configs});
  }

  createConn = async (config) => {
    let firstConnConfig = await api.createSqlConn(config).then(res => res.data);
    let connId = this.state.connections.length;
    let connTables = await api.getTables(connId).then(res => res.data);
    connTables = connTables.flatMap(t => Object.values(t));
    let newConn = { id: connId, config: firstConnConfig, tables: connTables };
    this.setState({ 
      connections: [...this.state.connections, newConn],
      events: [...this.state.events, {when: new Date().toUTCString(), what: `Created new connection [${connId}].`}]
     });
  }

  componentWillMount = async () => {
    this.createConn();
    this.getConfigs();
  }

  selectTable = async (connId, table) => {
    let connections = this.state.connections;
    connections[connId].selTable = table;
    await this.setState({ 
      connections: connections,
      events: [...this.state.events, {when: new Date().toUTCString(), what: `[Conn ${connId}]: Selected table [${table}].`}]
    })
    this.loadTable(connId, table); // bad practice?
  }

  loadTable = async (connId, table) => {
    let connections = this.state.connections;
    connections[connId].tableData = await api.loadTable(connId, table).then(res => res.data);
    this.setState({ 
      connections: connections,
      events: [...this.state.events, {when: new Date().toUTCString(), what: `[Conn ${connId}]: Table [${table}] has loaded.`}]
    })
  }

  saveSettings = () => {
    localStorage.setItem("settings", JSON.stringify(this.state.settings));
    this.setState({
      events: [...this.state.events, {when: new Date().toUTCString(), what: `Saved user settings in localStorage.`}]
    })
  }

  loadSettings = () => {
    let str = localStorage.getItem("settings");
    if(!str) {
      let err = `Failed to load user settings from localStorage.`;
      console.log(err);
      this.setState({
        // events: [...this.state.events, {when: new Date().toUTCString(), what: err}]
      })
    } else {
      let settings = JSON.parse(str);
      this.setState({
        settings: settings,
        // events: [...this.state.events, {when: new Date().toUTCString(), what: `Loaded user settings from localStorage.`}]
      })
    }
  }

  render() {
    let conns = this.state.connections || [];
    let settings = this.state.settings;
    let dark = settings.dark;
    return <div>
      <Button variant={dark ? "dark" : "light"} onClick={() => this.setState({settings: {...settings, dark: !dark}})}>{(dark ? "dark" : "light") + " mode"}</Button>
      <div>
        {conns.map(c => <ConnectionView conn={c} onSelectTable={this.selectTable} settings={settings}/>)}
      </div>
      <ConnCreator configs={this.state.configs} createConn={this.createConn} />
      <div>
        <h4>Event log</h4>
        <RoTable tableData={this.state.events} settings={this.state.settings} />
      </div>
    </div>
  }
}

const ConnectionView = ({conn, onSelectTable, settings}) => (
  <Card>
    <Card.Title>Connection [{conn.id}]</Card.Title>
    <Card.Subtitle>host: [{conn.config.host}], user: [{conn.config.user}]</Card.Subtitle>
    <span>
      Selected table:
      <DropdownSelectorConn connId={conn.id} currIt={conn.selTable || '...'} items={conn.tables} onSelect={onSelectTable} />
    </span>
    <VirtualTable tableData={conn.tableData} />
{/*     <RoTable tableData={conn.tableData} settings={settings}/> */}
  </Card>
);

const DropdownSelectorConn = ({connId, currIt, items, onSelect}) => (
  <DropdownButton id="dropdown-btn-conn" title={currIt}>
      {items.map(it => <Dropdown.Item onSelect={() => onSelect(connId, it)}>{it}</Dropdown.Item>)}
  </DropdownButton>);

const DropdownSelector = ({title, items, onSelect}) => (
  <DropdownButton id="dropdown-btn-selector" title={title}>
    {items.map(it => <Dropdown.Item onSelect={() => onSelect(it)}>{it}</Dropdown.Item>)}
  </DropdownButton>);

class ConnCreator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selInd: 0
    }
  }

  onSelect = (index) => {
    this.setState({
      selInd: index
    });
  }

  render() {
    let configs = this.props.configs;
    let selConfig = configs[this.state.selInd];
    let connTitle = selConfig ? `${selConfig.user}@${selConfig.host}:${selConfig.port}` : "none"
    return <div>
      <DropdownSelector title={connTitle} items={configs} onSelect={this.onSelect} />
      If you wish to add configurations, please modify the <code>config.json</code> file.
      <Button onClick={() => this.props.createConn(this.state.config)} variant="success">New Connection</Button>
    </div>
  }
}

export default App;
