import React, { Component } from "react";
import i1 from "../utils/img/i1.jpeg";
import sf from "../utils/img/sf.jpeg";
import next from "../utils/img/next.webp";
import axios from "axios";
import { Link } from "react-router-dom";

class HotelsList extends Component {
  state = {
    value: {
      min: 2,
      max: 10
    },
    result: {},
    sort: {},
    location: "",
    inDate: "",
    outDate: "",
    photos: {},
  };

  componentDidMount() {
    console.log(this.state.result);

    this.getHotelsList(
      this.props.match.params.a1,
      this.props.match.params.a2,
      this.props.match.params.a3
    );
    this.setState({
      location: this.props.match.params.a1,
      inDate: this.props.match.params.a2,
      outDate: this.props.match.params.a3,

    });
    // console.log(this.state.result);
    this.getDescription(
    Math.abs(this.props.match.params.a1.trim()),
      this.props.match.params.a3.trim(),
      this.props.match.params.a2.trim()
    );

    this.getPhotos(Math.abs(this.props.match.params.a1.trim()));
  }

  // Get hotels lists
  getHotelsList = (a, b, c) => {
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
        dest_ids: a.trim(),
        guest_qty: "1",
        arrival_date: c.trim(),
        departure_date: b.trim(),
        room_qty: "1"
      }
    })
      .then(response => {
        console.log(response);
        this.setState({
          result: response.data.result,
          sort: response.data.sort
        });
        console.log(this.state.result);
      })
      .catch(error => {
        console.log(error);
      });
  };


  getPhotos = id => {
    axios({
      method: "GET",
      url:
        "https://apidojo-booking-v1.p.rapidapi.com/properties/get-hotel-photos",
      headers: {
        "content-type": "application/octet-stream",
        "x-rapidapi-host": "apidojo-booking-v1.p.rapidapi.com",
        "x-rapidapi-key": "4e29a7917fmsha100132be880c55p1409edjsn01cb4c45395f"
      },
      params: {
        languagecode: "en-us",
        hotel_ids: id
      }
    })
      .then(response => {
        console.log(response);
        this.setState({
          photos: response
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  // Get Hotel description
  getDescription = (id, inDate, outDate) => {
    axios({
      method: "GET",
      url:
        "https://apidojo-booking-v1.p.rapidapi.com/properties/get-description",
      headers: {
        "content-type": "application/octet-stream",
        "x-rapidapi-host": "apidojo-booking-v1.p.rapidapi.com",
        "x-rapidapi-key": "4e29a7917fmsha100132be880c55p1409edjsn01cb4c45395f"
      },
      params: {
        check_out: outDate,
        languagecode: "en-us",
        check_in: inDate,
        hotel_ids: id
      }
    })
      .then(response => {
        console.log("Description", response);
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
    const { result } = this.state;

    const hotelItems = Object.keys(result).map((key, hotel) => (
      <ul className="col-md-9 hotellist_right_list list-group" key={key}>
        <li className="col-md-9 hotellist_right_list_item">
          <div
            className="card mb-3"
            style={{
              width: "65vw",
              border: "none"
            }}
          >
            <div className="row no-gutters">
              <div className="col-md-4">
                <img src={sf} className="card-img hotel_card" alt="..." />
              </div>
              <div className="col-md-8">
                <div className="card-body hotel_card_body">
                  <span>{result[key].accommodation_type_name}</span>
                  <span className="hotel_price">
                    <span className="dollar">$</span>
                    {result[key].min_total_price} <br />
                  </span>
                  <span className="green_quote">Save 20%</span>

                  <span className="book_hotel_button">
                    <Link
                      className="lala"
                      to={`/hotel/${this.props.match.params.a1}, ${
                        this.props.match.params.a3
                      }, ${this.props.match.params.a2}, ${result[key].hotel_id}`}
                    >
                      Book Now
                    </Link>
                  </span>

                  <h5 className="card-title">{result[key].hotel_name}</h5>
                  <p className="card-text">
                    {result[key].address}
                    <br />
                    {result[key].district}
                    {result[key].city_name_en}
                  </p>
                  <p className="card-text">
                    <small className="text-muted">
                      <i className="far fa-star star_reviews" />
                      {result[key].review_nr} Reviews
                      <br />
                      <i class="fas fa-bolt star_reviews" />
                      {result[key].review_score} Review Score
                    </small>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
    ));
    return (
      <div className="hotellist">
        <div className="hotels_top">
          <div className="hotels_top_search">
            <ul className="hotels_top_search_list">
              <li className="hotels_top_search_list_item">
                <i class="fas fa-map-marker-alt" />
                <input type="text" placeholder="LISBON" />
              </li>
              <li className="hotels_top_search_list_item">
                <i class="fas fa-calendar-alt" />
                <input type="text" placeholder="2019-12-01" />
              </li>
              <li className="hotels_top_search_list_item">
                <i class="fas fa-calendar-alt" />
                <input type="text" placeholder="2019-12-10" />
              </li>
              <li className="hotels_top_search_list_item">
                <i class="fas fa-user-friends" />
                <input type="text" placeholder="2 TRAVELLERS" />
              </li>
              <li className="hotels_top_search_list_item">
                <input type="submit" value="SUBMIT" />
              </li>
            </ul>
          </div>
        </div>
        <div className="hotellist_main">
          <div className="col-md-3 hotellist_left">
            <ul className="hotellist_left_list">
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
              <li className="hotellist_left_list_item">
                <h6 className="hotellist_left_subheading">Frequently Used:</h6>
                <br />
                <div className="frequent">
                  <span>Hotel</span>
                  <span>Hostels</span>
                  <span>Wi-Fi</span>
                  <br />
                  <span>Double Bed</span>
                  <span>Apartments</span>
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
          <div className="col-md-9 hotellist_right">
            <h2 className="hotel_result">
              Lisbon: {Object.keys(this.state.result).length} properties found.
            </h2>
            <br />

            {/*jajajajajajjajaajaj*/}
            {hotelItems}
          </div>
        </div>
      </div>
    );
  }
}
export default HotelsList;
