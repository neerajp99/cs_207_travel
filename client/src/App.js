import React, { Component } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Landing from "./components/Landing";
import Navbar from "./components/Navbar";
import FlightList from "./components/FlightList";
import HotelsList from "./components/HotelsList";
import Hotel from "./components/Hotel";
import Flight from "./components/Flight";

function App() {
  return (
    <div className="App">
      <Router>
        <Route exact path="/" render={() => <Landing />} />
        <Route
          exact
          path={"/flightlist/:v1,:v2,:v3"}
          component={FlightList}
        />
        <Route exact path="/hotellist/:a1,:a2,:a3" component={HotelsList} />
        <Route exact path="/hotel/:a1,:a2,:a3, :a4" component={Hotel} />
        <Route exact path="/flight" render={() => <Flight />} />
      </Router>
    </div>
  );
}

export default App;
