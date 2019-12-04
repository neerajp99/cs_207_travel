import React, { Component } from "react";
import axios from "axios";
import { Calendar } from "react-date-range";
import Moment from "react-moment";
import { format, addDays } from "date-fns";
import unirest from "unirest";
import About from "./About";
import BlogPost from "./BlogPost";
import Newsletter from "./Newsletter";
import Footer from "./Footer";
import { Link } from "react-router-dom";
// import {findDOMNode} from 'react-dom'

class Landing extends Component {
  state = {
    from: "",
    fromFinal: "DEL-sky",
    to: "",
    finalTo: "LIS-sky",
    fromDate: "2019-12-05",
    toDate: "2019-12-10",
    session: "",
    location: "",
    finalLocation: "-2167973",
    fromHotelDate: "2019-12-07",
    toHotelDate: "2019-12-10",
    flight: {},
    from_state: false,
    fromPointers: {},
    from_value: "",
    to_state: false,
    toPointers: {},
    to_value: "",
    location2: "",
    locationPointers: {},
    location_state: false,
    fromsDate: "",
    calendar_state: false
  };

  //###########################################################
  //###########################################################
  // Flights Requets and code goes here
  //###########################################################
  //###########################################################

  // componentDidMount() {
  //   if (this.state.from.length == 0) {
  //     this.setState({
  //       from_state: false
  //     });
  //   }
  // }

  // Change the state back
  backState = event => {
    this.setState({
      from_state: false,
      [event.target.name]: event.target.value,
      fromFinal: event.target.value
    });
  };

  backState2 = event => {
    this.setState({
      to_state: false,
      [event.target.name]: event.target.value,
      finalTo: event.target.value
    });
  };

  backState3 = event => {
    this.setState({
      location_state: false,
      [event.target.name]: event.target.value,
      finalLocation: event.target.value
    });
  };

  handleStateChange = (event) => {
    this.setState({
      calendar_state: true
    })
  }
  handleChangeState = event => {
    this.setState({
      calendar_state: false
    })
    console.log('kakakaak')
  }

  onChangeFrom = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
    axios({
      method: "GET",
      url:
        "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/autosuggest/v1.0/UK/GBP/en-GB/",
      headers: {
        "content-type": "application/octet-stream",
        "x-rapidapi-host":
          "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
        "x-rapidapi-key": "f251de0f98msh616a56f76aa80abp10ca81jsn82b6415d9005"
      },
      params: {
        query: this.state.from
      }
    })
      .then(response => {
        console.log(response);

        this.setState({
          from_state: true,
          fromPointers: response.data.Places
        });
        if (this.state.from.length === 0) {
          this.setState({
            from_state: false
          });
        }

        console.log(this.state);
      })
      .catch(error => {
        console.log(error);
      });
  };

  onChangeTo = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
    axios({
      method: "GET",
      url:
        "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/autosuggest/v1.0/UK/GBP/en-GB/",
      headers: {
        "content-type": "application/octet-stream",
        "x-rapidapi-host":
          "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
        "x-rapidapi-key": "f251de0f98msh616a56f76aa80abp10ca81jsn82b6415d9005"
      },
      params: {
        query: this.state.to
      }
    })
      .then(response => {
        console.log(response);
        this.setState({
          to_state: true,
          toPointers: response.data.Places
        });
        if (this.state.to.length === 0) {
          this.setState({
            to_state: false
          });
        }
        console.log(this.state);
      })
      .catch(error => {
        console.log(error);
      });
  };
  formatDateDisplay = (date, defaultText) => {
    if (!date) return defaultText;
    return format(date, "yyyy-MM-dd");
  };

  handleSelectFrom = date => {
    console.log(date._d);
    this.setState({
      fromDate: this.formatDateDisplay(date._d),
      calendar_state: false
    });
    console.log(this.state.fromDate);
  };

  handleSelectTo = date => {
    console.log(date._d);
    this.setState({
      toDate: this.formatDateDisplay(date._d)
    });
    console.log(this.state.toDate);
  };

  // create a session and then poll session results

  getFlights = () => {
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
      originPlace: this.state.fromFinal,
      destinationPlace: this.state.finalTo,
      outboundDate: this.state.fromDate,
      adults: "1"
    });

    req.end(res => {
      if (res.error) throw new Error(res.error);
      let x = res.headers.location;
      y = x.split("/");
      let z = y[y.length - 1];
      // console.log(z);
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
        // console.log(response);
        this.setState({
          flight: response.data
        });
        // console.log(this.state.flight);
      })
      .catch(error => {
        console.log(error);
      });
  };

  //###########################################################
  //###########################################################
  // Hotels Requets and code goes here
  //###########################################################
  // ###########################################################

  onChangeLocation = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
    // console.log(this.state.location)
    axios({
      method: "GET",
      url: "https://apidojo-booking-v1.p.rapidapi.com/locations/auto-complete",
      headers: {
        "content-type": "application/octet-stream",
        "x-rapidapi-host": "apidojo-booking-v1.p.rapidapi.com",
        "x-rapidapi-key": "4e29a7917fmsha100132be880c55p1409edjsn01cb4c45395f"
      },
      params: {
        languagecode: "en-us",
        text: this.state.location
      }
    })
      .then(response => {
        console.log(response);
        this.setState({
          finalLocation: response.data[0].dest_id
        });
        this.setState({
          location_state: true,
          locationPointers: response.data.Places
        });
        if (this.state.location.length === 0) {
          this.setState({
            location_state: false
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  // Get hotels lists
  getHotelsList = () => {
    axios({
      method: "GET",
      url: "https://apidojo-booking-v1.p.rapidapi.com/properties/list",
      headers: {
        "content-type": "application/octet-stream",
        "x-rapidapi-host": "apidojo-booking-v1.p.rapidapi.com",
        "x-rapidapi-key": "4e29a7917fmsha100132be880c55p1409edjsn01cb4c45395f"
      },
      params: {
        price_filter_currencycode: "USD",
        travel_purpose: "leisure",
        search_id: "none",
        order_by: "popularity",
        languagecode: "en-us",
        search_type: "city",
        offset: "0",
        dest_ids: "-2167973",
        guest_qty: "1",
        arrival_date: "2019-12-01",
        departure_date: "2019-12-10",
        room_qty: "1"
      }
    })
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      });
  };

  getPhotos = () => {
    axios({
      method: "GET",
      url:
        "https://apidojo-booking-v1.p.rapidapi.com/properties/get-description",
      headers: {
        "content-type": "application/octet-stream",
        "x-rapidapi-host": "apidojo-booking-v1.p.rapidapi.com",
        "x-rapidapi-key": "FUtTTNdLztmsh6S1nSNSqa78mgO5p1xZXFMjsnsVQl6Hlw3Nvz"
      },
      params: {
        check_out: "2019-12-15",
        languagecode: "en-us",
        check_in: "2019-12-13",
        hotel_ids: "1498618"
      }
    })
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      });
  };

  handleSelectFromHotel = date => {
    console.log(date._d);
    this.setState({
      fromHotelDate: this.formatDateDisplay(date._d)
    });
    console.log(this.state.fromHotelDate);
  };

  handleSelectToHotel = date => {
    console.log(date._d);
    this.setState({
      toHotelDate: this.formatDateDisplay(date._d)
    });
    console.log(this.state.toHotelDate);
  };

  render() {
    console.log(this.state.toPointers);
    const items = Object.keys(this.state.fromPointers).map((key, index) => (
      <input
        className="search_drop_list_item"
        type="button"
        name="from_value"
        value={this.state.fromPointers[key].PlaceId}
        onClick={this.backState}
      />
    ));
    const itemss = Object.keys(this.state.toPointers).map((key, index) => (
      <input
        className="search_drop_list_item"
        type="button"
        name="to_value"
        value={this.state.toPointers[key].PlaceId}
        onClick={this.backState2}
      />
    ));
    const itemsss = Object.keys(this.state.locationPointers).map(
      (key, index) => (
        <input
          className="search_drop_list_item"
          type="button"
          name="location_value"
          value={this.state.locationPointers[key].PlaceId}
          onClick={this.backState3}
        />
      )
    );

    return (
      <div className="landing">
        <div className="landing_first">
          <div className="container">
            <h1 className="main_heading">EXPLORE</h1>
          </div>
        </div>
        <div className="landing_search">
          <div className="col-xs-12 ">
            <nav>
              <div
                className="nav nav-tabs nav-fill"
                id="nav-tab"
                role="tablist"
              >
                <a
                  className="nav-item nav-link active nav_item_text"
                  id="nav-home-tab"
                  data-toggle="tab"
                  href="#nav-home"
                  role="tab"
                  aria-controls="nav-home"
                  aria-selected="true"
                >
                  Flights
                </a>

                <a
                  className="nav-item nav-link nav_item_text"
                  id="nav-contact-tab"
                  data-toggle="tab"
                  href="#nav-contact"
                  role="tab"
                  aria-controls="nav-contact"
                  aria-selected="false"
                >
                  Hotels
                </a>
              </div>
            </nav>
            <div className="tab-content py-3 px-3 px-sm-0" id="nav-tabContent">
              <div
                className="tab-pane fade show active"
                id="nav-home"
                role="tabpanel"
                aria-labelledby="nav-home-tab"
              >
                <ul className="bullshit_one">
                  <li className="bullshit_one_1">
                    <input
                      className="form-control form-control-lg text-field text_field"
                      placeholder={this.state.fromFinal}
                      name="from"
                      onChange={this.onChangeFrom}
                      type="text"
                    />
                    <div className="search_drop">
                      {this.state.from_state && (
                        <ul className="search_drop_list">{items}</ul>
                      )}
                    </div>
                  </li>

                  <li className="bullshit_one_1">
                    <input
                      className="form-control form-control-lg text-field text_field"
                      placeholder="Where"
                      name="to"
                      onChange={this.onChangeTo}
                    />
                    <div className="search_drop">
                      {this.state.to_state && (
                        <ul className="search_drop_list">{itemss}</ul>
                      )}
                    </div>
                  </li>

                  <li className="bullshit_one_1">
                    <input
                      className="form-control form-control-lg text-field text_field"
                      placeholder="Depart"
                      name="depart"
                      onClick = {this.handleStateChange}
                    />
                    {this.state.calendar_state && (
                      <Calendar
                      className="calendar_f"
                        date={this.state.fromsDate}
                        onChange={this.handleSelectFrom}
                        onClick={this.handleChangeState}
                      />
                    )}


                  </li>
                  <li className="bullshit_one_1">
                    <input
                      className="form-control form-control-lg text-field text_field"
                      placeholder="Return"
                      name="return"
                      disabled
                    />
                    {/*<Calendar
                      date={this.state.toDate}
                      onChange={this.handleSelectTo}
                    />*/}
                  </li>
                  <li className="bullshit_one_1">
                    <input
                      className="form-control form-control-lg text-field text_field"
                      placeholder="Class & Travellers"
                      name="cabin"
                      disabled
                    />
                  </li>
                  <li className="bullshit_one_1">
                    <Link
                      to={`/flightlist/${this.state.fromFinal}, ${
                        this.state.finalTo
                      }, ${this.state.fromDate}, ${this.state.fromFinal}, ${this.state.finalTo}`}
                    >
                      <input
                        type="submit"
                        className="form-control form-control-lg text_field text-field submit_button"
                        value="Find Flights"
                        onClick={this.getFlights}
                      />
                    </Link>
                  </li>
                </ul>
              </div>

              <div
                className="tab-pane fade"
                id="nav-contact"
                role="tabpanel"
                aria-labelledby="nav-contact-tab"
              >
                <ul className="bullshit_one">
                  <li className="bullshit_one_1">
                    <input
                      className="form-control form-control-lg  text_field"
                      placeholder="Location"
                      name="location"
                      onChange={this.onChangeLocation}
                    />
                    {this.state.location_state && (
                      <ul className="search_drop_list">{itemsss}</ul>
                    )}
                  </li>
                  <li className="bullshit_one_1">
                    <input
                      className="form-control form-control-lg text-field text_field"
                      placeholder="Check-in date"
                      name="from"
                    />
                    {/*<Calendar
                      date={this.state.fromHotelDate}
                      onChange={this.handleSelectFromHotel}
                    />*/}
                  </li>
                  <li className="bullshit_one_1">
                    <input
                      className="form-control form-control-lg text-field text_field"
                      placeholder="Check-out date"
                      name="from"
                    />
                    {/*  <Calendar
                      date={this.state.toHotelDate}
                      onChange={this.handleSelectToHotel}
                    />*/}
                  </li>
                  <li className="bullshit_one_1">
                    <input
                      className="form-control form-control-lg text-field text_field"
                      placeholder="Travellers"
                      name="cabin"
                    />
                  </li>
                  <li className="bullshit_one_1">
                    <input
                      className="form-control form-control-lg text-field text_field"
                      placeholder="Purpose"
                      name="purpose"
                    />
                  </li>
                  <li className="bullshit_one_1">
                    <Link
                      to={`/hotellist/${this.state.finalLocation}, ${
                        this.state.toHotelDate
                      }, ${this.state.fromHotelDate}`}
                    >
                      <input
                        type="submit"
                        className="form-control form-control-lg text_field text-field submit_button"
                        value="Find Hotels"
                      />
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <About />
        <BlogPost />
        <Newsletter />
        <Footer />
      </div>
    );
  }
}

export default Landing;
