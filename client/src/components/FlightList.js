import React, { Component } from "react";
import map from "../utils/img/map.png";
import plane from "../utils/img/flight.png";
import next from "../utils/img/next.webp";
import ryan from "../utils/img/ryan.png";
import air from "../utils/img/air.png";
import axios from "axios";
import unirest from "unirest";

class FlightList extends Component {
  state = {
    content: false,
    details: {},
    carrier: {},
    legs: {},
    places: {},
    itineraries: {},
    agents: {},
    segments: {},
    final: {}
  };

  componentDidMount() {
    console.log(this.props.match.params.v2);
    this.getFlights(
      this.props.match.params.v1,
      this.props.match.params.v2,
      this.props.match.params.v3
      // this.props.match.params.v4
    );
  }

  handleChange = () => {
    this.setState({
      content: !this.state.content
    });
    console.log("lmao");
  };

  // create a session and then poll session results

  getFlights = (a, b, c) => {
    console.log(a, b.trim(), c);
    let y;
    var req = unirest(
      "POST",
      "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/pricing/v1.0"
    );

    req.headers({
      "x-rapidapi-host":
        "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
      "x-rapidapi-key": "f251de0f98msh616a56f76aa80abp10ca81jsn82b6415d9005",
      "content-type": "application/x-www-form-urlencoded"
    });

    req.form({
      inboundDate: "",
      cabinClass: "economy",
      children: "0",
      infants: "0",
      country: "US",
      currency: "USD",
      locale: "en-US",
      originPlace: a.trim(),
      destinationPlace: b.trim(),
      outboundDate: c.trim(),
      adults: "1"
    });

    req.end(res => {
      if (res.error) throw new Error(res.error);
      let x = res.headers.location;
      console.log(x);
      y = x.split("/");
      let z = y[y.length - 1];
      console.log(z);
      this.setState({
        session: y[y.length - 1]
      });
      this.getFlightsFinal(z);
    });
  };

  getFlightsFinal = session => {
    console.log("Z", session);
    axios({
      method: "GET",
      url: `https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/pricing/uk2/v1.0/${session}?sortType=duration&sortOrder=asc&pageIndex=0&pageSize=10`,
      headers: {
        "content-type": "application/octet-stream",
        "x-rapidapi-host":
          "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
        "x-rapidapi-key": "f251de0f98msh616a56f76aa80abp10ca81jsn82b6415d9005"
      },
      params: {
        pageIndex: "0",
        pageSize: "10"
      }
    })
      .then(response => {
        console.log("Response", response);
        this.setState({
          details: response.data,
          carrier: response.data.Carriers,
          legs: response.data.Legs,
          places: response.data.Places,
          segments: response.data.Segments,
          agents: response.data.Agents,
          itineraries: response.data.Itineraries
        });
        const finalFlightDetailsState = [];
        // console.log(this.state);
        Object.keys(this.state.itineraries).map((key, index) => {
          // console.log(this.state.itineraries[key].OutboundLegId);

          finalFlightDetailsState.push({
            flight: this.getLegsItiernary(
              this.state.itineraries[key].OutboundLegId,
              this.state.itineraries[key].PricingOptions[0]
            ),
            key: this.getLegsDetails(
              this.state.itineraries[key].OutboundLegId,
              this.state.itineraries[key].PricingOptions[0]
            )
          });
        });
        // console.log("Final", finalFlightDetailsState);
        this.setState({
          final: finalFlightDetailsState
        });
        console.log(this.state.final);
        // {this.state.final[0].flight[0].originStation.Name}
      })
      .catch(error => {
        console.log(error);
      });
  };

  // Get Legs in detail
  getLegsItiernary = (itiernary, price) => {
    const finalItiernary = [];
    for (let i = 0; i < Object.keys(this.state.legs).length; i++) {
      if (this.state.legs[i].Id === itiernary) {
        const destinationStation = this.getPlace(
          this.state.legs[i].DestinationStation
        );
        const originStation = this.getPlace(this.state.legs[i].OriginStation);
        const flightPrice = price;
        const arrivalDate = this.state.legs[i].Arrival.slice(0, 10);
        const departureDate = this.state.legs[i].Departure.slice(0, 10);
        const arrivalTime = this.state.legs[i].Arrival.slice(11, 16);
        const departureTime = this.state.legs[i].Departure.slice(11, 16);
        const duration = this.state.legs[i].Duration / 60;
        const stops = Object.keys(this.state.legs[i].Stops).length;

        finalItiernary.push({
          destinationStation: destinationStation,
          originStation: originStation,
          flightPrice: flightPrice,
          arrivalDate: arrivalDate,
          departureDate: departureDate,
          departureTime: departureTime,
          arrivalTime: arrivalTime,
          duration: duration,
          stops: stops
        });
        return finalItiernary;
      }
    }
  };

  getDestinationStation = stationValue => {
    for (let i = 0; i < Object.keys(this.state.places).length; i++) {
      if (this.state.places[i].Id === stationValue) {
        return this.state.places[i].name;
      }
    }
  };

  // Get Carrier Details
  getCarrier = carrier => {
    for (let i = 0; i < Object.keys(this.state.carrier).length; i++) {
      if (this.state.carrier[i].Id === carrier) {
        return this.state.carrier[i];
      }
    }
  };

  // Get Place details
  getPlace = place => {
    for (let i = 0; i < Object.keys(this.state.places).length; i++) {
      if (this.state.places[i].Id === place) {
        return this.state.places[i];
      }
    }
  };

  // get Carrier image url
  getCarrierImageUrl = carrier => {
    for (let i = 0; i < Object.keys(this.state.carrier).length; i++) {
      if (this.state.carrier[i].Id === carrier) {
        return this.state.carrier[i].ImageUrl;
      }
    }
  };

  getLegsDetails = (itiernary, price) => {
    const flightFinalArray = [];
    for (let i = 0; i < Object.keys(this.state.legs).length; i++) {
      if (this.state.legs[i].Id === itiernary) {
        for (
          let j = 0;
          j < Object.keys(this.state.legs[i].SegmentIds).length;
          j++
        ) {
          // console.log(j ,this.state.segments[this.state.legs[i].SegmentIds[j]]);
          const carrier = this.getCarrier(
            this.state.segments[this.state.legs[i].SegmentIds[j]].Carrier
          );
          // console.log(carrier)
          const originStation = this.getPlace(
            this.state.segments[this.state.legs[i].SegmentIds[j]].OriginStation
          );
          const destinationStation = this.getPlace(
            this.state.segments[this.state.legs[i].SegmentIds[j]]
              .DestinationStation
          );
          const arrivalDate = this.state.segments[
            this.state.legs[i].SegmentIds[j]
          ].ArrivalDateTime.slice(0, 10);
          const departureDate = this.state.segments[
            this.state.legs[i].SegmentIds[j]
          ].DepartureDateTime.slice(0, 10);
          const arrivalTime = this.state.segments[
            this.state.legs[i].SegmentIds[j]
          ].ArrivalDateTime.slice(11, 16);
          const departureTime = this.state.segments[
            this.state.legs[i].SegmentIds[j]
          ].DepartureDateTime.slice(11, 16);
          const carrierImage = this.getCarrierImageUrl(
            this.state.segments[this.state.legs[i].SegmentIds[j]].Carrier
          );
          const flightNumber = this.state.segments[
            this.state.legs[i].SegmentIds[j]
          ].FlightNumber;
          flightFinalArray.push({
            carrier: carrier,
            originStation: originStation,
            destinationStation: destinationStation,
            arrivalDate: arrivalDate,
            departureDate: departureDate,
            arrivalTime: arrivalTime,
            departureTime: departureTime,
            carrierImage: carrierImage,
            flightNumber: flightNumber
          });
        }
        return flightFinalArray;
      }
    }
  };
  // let originStation = this.state.legs[i].OriginStation;
  // let destinationStation;
  // console.log(typeof(this.state.legs[i]));
  //   for (let j = 0; j <= Object.keys(this.state.legs[i].Stops).length ; j++) {
  //     // console.log(j ,this.state.legs[i].Stops[j]);
  //     if (j < Object.keys(this.state.legs[i].Stops).length){
  //       destinationStation = this.state.legs[i].Stops[j];
  //     }
  //      if(j === Object.keys(this.state.legs[i].Stops).length){
  //       destinationStation = this.state.legs[i].DestinationStation;
  //     }
  //     for (let k = 0 ; k < Object.keys(this.state.segments).length ; k++){
  //       // console.log(originStation, destinationStation)
  //       if (this.state.segments[k].OriginStation === originStation && this.state.segments[k].DestinationStation === this.state.legs[i].Stops[j]) {
  //         console.log(i,j,k, this.state.segments[k]);
  //         // originStation = this.state.segments[k].OriginStation;
  //       }
  //     }
  //     originStation = this.state.legs[i].Stops[j]
  //
  //
  // }

  render() {
    const itemss = Object.keys(this.state.final).map((key, index) => (
      <div className="flightToggle" key={index}>
        <ul className="flightlist_right_list">
          <li className="flightlist_right_list_item">
            <h3 className="flightlist_right_list_item_h3">
              {this.state.final[key].flight[0].departureTime}
            </h3>
            <br />
            <small>Departure</small>
          </li>
          <li className="flightlist_right_list_item">
            <span>&#8226;&#8226;&#8226;</span>

            <small className="stop">
              {this.state.final[key].flight[0].stops} Stops
            </small>
            <span>&#8226;&#8226;&#8226;</span>
            <br />
            <br />
            <small>5 hours 35 mins</small>
          </li>
          <li className="flightlist_right_list_item">
            <h3 className="flightlist_right_list_item_h3">
              {this.state.final[key].flight[0].arrivalTime}
            </h3>
            <br />
            <small>Arrival</small>
          </li>

          <li className="flightlist_right_list_item">
            <h3 className="flightlist_right_list_item_h3">
              ${this.state.final[key].flight[0].flightPrice.Price}
            </h3>
            <br />
            <small>Price from</small>
          </li>
          <li className="flightlist_right_list_item">
            <button className="toggleFlight">Details</button>
            <br />
            <br />
          </li>
          <li className="flightlist_right_list_item ">
            <button className="ll">Book Now</button>
            <br />
            <br />
          </li>
        </ul>

        {Object.keys(this.state.final[key].key).map((keys, index) => (
          <div className="flightDetails">
            <ul className="flightDetails_list">
              <li className="flightDetails_list_item">
                <ul className="flight_details_list">
                  <li className="flight_details_list_item">
                    <img
                      src={this.state.final[key].key[keys].carrierImage}
                      alt="flight_logo"
                      className="flight_logo"
                    />
                  </li>
                  <li className="flight_details_list_item">
                    <h2 className="flight_details_list_item_h2">
                      {this.state.final[key].key[keys].carrier.Name}
                    </h2>
                    <br />
                    <small>
                      {this.state.final[key].key[keys].carrier.Code}{" "}
                      {this.state.final[key].key[keys].flightNumber}
                    </small>
                  </li>
                  <li className="flight_details_list_item">
                    <h2 className="flight_details_list_item_h2 divi">
                      {this.state.final[key].key[keys].originStation.Code}
                    </h2>
                    <br />
                    <small>
                      {this.state.final[key].key[keys].departureTime}
                    </small>
                  </li>
                  <li className="flight_details_list_item">
                    <h2 className="flight_details_list_item_h2">
                      <i class="fas fa-plane-departure" />
                      6H 20M
                      <i class="fas fa-plane-arrival" />
                    </h2>
                    <br />
                  </li>
                  <li className="flight_details_list_item">
                    <h2 className="flight_details_list_item_h2">
                      {this.state.final[key].key[keys].destinationStation.Code}
                    </h2>
                    <br />
                    <small>{this.state.final[key].key[keys].arrivalTime}</small>
                  </li>
                </ul>
              </li>
              <hr className="break_hr" />
            </ul>
          </div>
        ))}
      </div>
    ));

    return (
      <div className="flightlist">
        <div className="hotels_top flights_top">
          <div className="hotels_top_search flights_top_search">
            <ul className="hotels_top_search_list flights_top_search_list ">
              <li className="hotels_top_search_list_item flights_top_search_list_item">
                <i className="fas fa-map-marker-alt" />
                <input type="text" placeholder="DELHI" />
              </li>
              <li className="hotels_top_search_list_item flights_top_search_list_item">
                <i className="fas fa-map-marker-alt" />
                <input type="text" placeholder="LISBON" />
              </li>
              <li className="hotels_top_search_list_item flights_top_search_list_item">
                <i className="fas fa-calendar-alt" />
                <input type="text" placeholder="2019-12-01" />
              </li>
              <li className="hotels_top_search_list_item flights_top_search_list_item">
                <i className="fas fa-calendar-alt" />
                <input type="text" placeholder="2019-12-10" />
              </li>
              <li className="hotels_top_search_list_item flights_top_search_list_item">
                <i class="fas fa-user-friends" />
                <input type="text" placeholder="2 TRAVELLERS" />
              </li>
              <li className="hotels_top_search_list_item flights_top_search_list_item">
                <input type="submit" value="SUBMIT" />
              </li>
            </ul>
          </div>
        </div>

        <div className="flights_main">
          <div className="col-md-3 hotellist_left flightlist_left">
            <ul className="hotellist_left_list flight_leftt">
              <li className="hotellist_left_list_item">
                <input type="text" placeholder="Search" />
                <i class="fas fa-search" />
              </li>
              <li className="hotellist_left_list_item recom">
                Sort:{" "}
                <span className="light">
                  Recommended <span>&#10515;</span>
                </span>
              </li>
              <li className="hotellist_left_list_item stops">
                No of stops: <br />
                <div className="stop_span">
                  {" "}
                  <span>0</span>
                  <span>1</span>
                  <span>2</span>
                  <span>3+</span>
                </div>
              </li>

              <li className="hotellist_left_list_item recom">
                <a href="#" className="main_btn more_button">
                  See more options
                  <img src={next} alt="" />
                </a>
              </li>
            </ul>
          </div>
          <div className="col-md-7 flightlist_right hotellist_right">
            <div className="flightlist_right_main">
              <ul className="flightlist_right_top_list">
                <li className="flightlist_right_top_list_item">
                  <small>Departure</small>
                  <br />
                  <br />
                  {Object.keys(this.state.final).length > 0 && (
                    <h2 className="flightlist_right_top_list_item_h2">
                      {this.state.final[0].flight[0].originStation.Name}
                    </h2>
                  )}
                  {Object.keys(this.state.final).length > 0 && (
                    <small>
                      {this.state.final[0].flight[0].originStation.Code}
                    </small>
                  )}
                </li>
                <li className="flightlist_right_top_list_item">
                  <img src={plane} className="plane" />
                </li>
                <li className="flightlist_right_top_list_item">
                  <small>Arrival</small>
                  <br />
                  <br />
                  {Object.keys(this.state.final).length > 0 && (
                    <h2 className="flightlist_right_top_list_item_h2">
                      {this.state.final[0].flight[0].destinationStation.Name}
                    </h2>
                  )}
                  {Object.keys(this.state.final).length > 0 && (
                    <small>
                      {this.state.final[0].flight[0].destinationStation.Code}
                    </small>
                  )}
                </li>

                <li className="flightlist_right_top_list_item">
                  <small>Depart</small>
                  <br />
                  <br />
                  {Object.keys(this.state.final).length > 0 && (
                    <small>
                      <i class="fas fa-calendar-alt" />
                      {this.state.final[0].flight[0].departureDate}
                    </small>
                  )}
                </li>
                <li className="flightlist_right_top_list_item">
                  <small>Arrive</small>
                  <br />
                  <br />
                  {Object.keys(this.state.final).length > 0 && (
                    <small>
                      <i class="fas fa-calendar-alt" />
                      {this.state.final[0].flight[0].arrivalDate}
                    </small>
                  )}
                </li>
              </ul>
            </div>

            {/*Here goes the loop for the flight itineraries*/}

            {itemss}
            {/* {Object.keys(this.state.carrier).map((key, index) => (
              <div className="flightToggle" key={index}>
                <ul className="flightlist_right_list">
                  <li className="flightlist_right_list_item">
                    <h3 className="flightlist_right_list_item_h3">16:15</h3>
                    <br />
                    <small>Departure</small>
                  </li>
                  <li className="flightlist_right_list_item">
                    <span>&#8226;&#8226;&#8226;</span>

                    <small className="stop">0 Stops</small>
                    <span>&#8226;&#8226;&#8226;</span>
                    <br />
                    <br />
                    <small>5 hours 35 mins</small>
                  </li>
                  <li className="flightlist_right_list_item">
                    <h3 className="flightlist_right_list_item_h3">21:44</h3>
                    <br />
                    <small>Arrival</small>
                  </li>
                  <li className="flightlist_right_list_item">
                    <h3 className="flightlist_right_list_item_h3">$140</h3>
                    <br />
                    <small>Economy from</small>
                  </li>
                  <li className="flightlist_right_list_item">
                    <h3 className="flightlist_right_list_item_h3">$450</h3>
                    <br />
                    <small>Business from</small>
                  </li>
                  <li className="flightlist_right_list_item">
                    <button className="toggleFlight">Details</button>
                    <br />
                    <br />
                  </li>
                  <li className="flightlist_right_list_item ">
                    <button className="ll">Book Now</button>
                    <br />
                    <br />
                  </li>
                </ul>

                <div className="flightDetails">
                  <ul className="flightDetails_list">
                    <li className="flightDetails_list_item">
                      <ul className="flight_details_list">
                        <li className="flight_details_list_item">
                          <img
                            src={ryan}
                            alt="flight_logo"
                            className="flight_logo"
                          />
                        </li>
                        <li className="flight_details_list_item">
                          <h2 className="flight_details_list_item_h2">
                            British Airways
                          </h2>
                          <br />
                          <small>BI 765</small>
                        </li>
                        <li className="flight_details_list_item">
                          <h2 className="flight_details_list_item_h2 divi">
                            SFO
                          </h2>
                          <br />
                          <small>13:00</small>
                        </li>
                        <li className="flight_details_list_item">
                          <h2 className="flight_details_list_item_h2">
                            <i class="fas fa-plane-departure" />
                            6H 20M
                            <i class="fas fa-plane-arrival" />
                          </h2>
                          <br />
                        </li>
                        <li className="flight_details_list_item">
                          <h2 className="flight_details_list_item_h2">DEL</h2>
                          <br />
                          <small>19:00</small>
                        </li>
                      </ul>
                    </li>
                    <hr className="break_hr" />
                    <li className="flightDetails_list_item">
                      <ul className="flight_details_list">
                        <li className="flight_details_list_item">
                          <img
                            src={air}
                            alt="flight_logo"
                            className="flight_logo"
                          />
                        </li>
                        <li className="flight_details_list_item">
                          <h2 className="flight_details_list_item_h2">
                            British Airways
                          </h2>
                          <br />
                          <small>BI 765</small>
                        </li>
                        <li className="flight_details_list_item">
                          <h2 className="flight_details_list_item_h2 divi">
                            SFO
                          </h2>
                          <br />
                          <small>13:00</small>
                        </li>
                        <li className="flight_details_list_item">
                          <h2 className="flight_details_list_item_h2">
                            <i class="fas fa-plane-departure" />
                            6H 20M
                            <i class="fas fa-plane-arrival" />
                          </h2>
                          <br />
                        </li>
                        <li className="flight_details_list_item">
                          <h2 className="flight_details_list_item_h2">DEL</h2>
                          <br />
                          <small>19:00</small>
                        </li>
                      </ul>
                    </li>
                  </ul>

                  <hr />
                </div>
              </div>
            ))} */}
          </div>
        </div>
      </div>
    );
  }
}

export default FlightList;
