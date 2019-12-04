import React, { Component } from "react";
import sf from "../utils/img/sf.jpeg";
import island from "../utils/img/island.jpeg";
import rome from "../utils/img/rome.jpeg";
import i1 from "../utils/img/i1.jpeg";
import i2 from "../utils/img/i2.jpeg";
import quote from "../utils/img/quote.webp";
import axios from "axios";

class Hotel extends Component {
  state = {
    result: {},
    sort: {},
    location: "",
    inDate: "",
    outDate: "",
    photos: {},
    description: "",
    hotelId: "",
    hotel: {},
    reviews: {},
    images: {},
    photos: {},
    min_total_price: "",
    hotel_name: "",
    address: "",
    district: "",
    city_trans: "",
    country_trans: "",
    review_score: "",
    review_nr: "",
    hotel_include_breakfast: "",
    checkin_from: "",
    checkin_until: "",
    checkout_until: ""
  };

  componentDidMount() {
    console.log(this.props.match.params);

    this.getHotelsList(
      this.props.match.params.a1,
      this.props.match.params.a2,
      this.props.match.params.a3
    );
    this.setState({
      location: this.props.match.params.a1,
      inDate: this.props.match.params.a2,
      outDate: this.props.match.params.a3,
      hotelId: this.props.match.params.a4,
      hotel_name: this.props.match.params.a5,
      address: this.props.match.params.a6,
      district: this.props.match.params.a7,
      min_total_price: this.props.match.params.a8,
      city_trans: this.props.match.params.a9,
      country_trans: this.props.match.params.a10,
      review_score: this.props.match.params.a11,
      review_nr: this.props.match.params.a12,
      hotel_include_breakfast: this.props.match.params.a13,
      checkin_from: this.props.match.params.a14,
      checkin_until: this.props.match.params.a15,
      checkout_until: this.props.match.params.a16
    });
    // console.log(this.state.result);
    this.getHotelDetails(this.props.match.params.a4);
    this.getDescription(
      Math.abs(this.props.match.params.a4.trim()),
      this.props.match.params.a2.trim(),
      this.props.match.params.a3.trim()
    );

    this.getReviews(this.props.match.params.a4.trim());
    this.getPhotos(this.props.match.params.a4.trim());
    Math.abs(this.props.match.params.a4.trim());
    // this.getPhotoString();
    console.log(this.state);
  }

  // Get Hotel Details
  getHotelDetails = id => {
    for (let i = 0; i < Object.keys(this.state.result).length; i++) {
      if (this.state.result[i].hotel_id === id) {
        console.log("bitch", this.state.result[i]);
        this.setState({
          hotel: this.state.result[i]
        });
        return this.state.result[i];
      }
    }
  };

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
        arrival_date: b.trim(),
        departure_date: c.trim(),
        room_qty: "1"
      }
    })
      .then(response => {
        console.log(response);
        this.setState({
          result: response.data.result,
          sort: response.data.sort
        });
        console.log(this.state);
      })
      .catch(error => {
        console.log(error);
      });
  };

  // Get Featured Reviews
  getReviews = id => {
    axios({
      method: "GET",
      url:
        "https://apidojo-booking-v1.p.rapidapi.com/properties/get-featured-reviews",
      headers: {
        "content-type": "application/octet-stream",
        "x-rapidapi-host": "apidojo-booking-v1.p.rapidapi.com",
        "x-rapidapi-key": "4e29a7917fmsha100132be880c55p1409edjsn01cb4c45395f"
      },
      params: {
        languagecode: "en-us",
        hotel_id: id
      }
    })
      .then(response => {
        console.log(response.data.vpm_featured_reviews);
        this.setState({
          reviews: response.data.vpm_featured_reviews
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  getPhotos = id => {
    const photos = [];
    const photoString = [];
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
        console.log(response.data.data[Object.keys(response.data.data)[0]]);

        photos.push({
          photo: response.data.data[Object.keys(response.data.data)[0]]
        });
        console.log("PHOTOS", photos);

        Object.keys(photos[0].photo).map((key, item) => {
          photoString.push({
            link: "http://r-ec.bstatic.com" + photos[0].photo[key][4]
          });
          // console.log(photoString);
        });
        this.setState({
          images: photoString,
          photos: response.data.data[Object.keys(response.data.data)[0]]
        });
        console.log(this.state.images[0].link);
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
        console.log(response);
        this.setState({
          description: response.data[0].description
        });
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
  // Get Hotel photo string

  // getPhotoString = () => {
  //   const photoString = [];
  //   const x = this.getPhotos(this.props.match.params.a4.trim());
  //   console.log("lalalalala", x);
  //   // console.log("not working");
  //   Object.keys(this.state.photos).map((key, item) => {
  //     photoString.push({
  //       link: "http://r-ec.bstatic.com" + this.state.reviews[key][4]
  //     });
  //     console.log(photoString);
  //   });
  //   this.setState({
  //     images: photoString
  //   });
  // };
  render() {
    let reviews = Object.keys(this.state.reviews).map((key, index) => (
      <li className="reviews_list_item" key={key}>
        <img src={quote} />
        <p className="review_p">{this.state.reviews[key].pros}</p>
        <br />
        <h3 className="review_name">{this.state.reviews[key].author.name}</h3>
        <small>{this.state.reviews[key].author.type}</small>
      </li>
    ));
    return (
      <div className="hotel">
        <div className="hotels_top lolol">
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
        <div className="hotels_main_info">
          <h3 className="light_location">
            {this.state.min_total_price}
            <span>&#8226;</span>
            {this.state.country_trans}
          </h3>

          <h2 className="hotels_main_info_heading">{this.state.hotel_name}</h2>

          <br />
          <p className="hotels_main_info_para">
            {this.state.district}, {this.state.city_trans}
            <hr />
          </p>

          <h2 className="hotels_main_info_price">
            <span>$</span>205 /<span>3 Nights</span>
          </h2>

          {this.state.hotel_include_breakfast == 1 && (
            <span className="notify">
              <span>&#8226;</span> Free Breakfast
            </span>
          )}
          <span className="notify">
            <span>&#8226;</span> Free Cancellation
          </span>
          <br />
          <button className="book_hotel_button now_hotel">Book Now</button>
        </div>
        {Object.keys(this.state.images).length > 0 && (
          <div className="wrap">
            <div className="gallery">
              <figure className="gallery__item gallery__item--1">
                <a href="#img1">
                  {this.state.images && (
                    <img
                      src={this.state.images[0].link}
                      alt="01"
                      className="gallery__img"
                    />
                  )}
                </a>
                <div className="lightbox" id="img1">
                  {this.state.images && (
                    <img
                      src={this.state.images[0].link}
                      alt="01"
                      className="gallery__img"
                    />
                  )}
                  <a href="#_" className="btn-close">
                    &times;
                  </a>
                </div>
              </figure>

              <figure className="gallery__item gallery__item--2">
                <a href="#img2">
                  <img
                    src={this.state.images[1].link}
                    alt="02"
                    className="gallery__img"
                  />
                </a>
                <div className="lightbox" id="img2">
                  <img src={this.state.images[1].link} alt="" />
                  <a href="#_" className="btn-close">
                    &times;
                  </a>
                </div>
              </figure>

              <figure className="gallery__item gallery__item--3">
                <a href="#img3">
                  <img
                    src={this.state.images[2].link}
                    alt="03"
                    className="gallery__img"
                  />
                </a>
                <div className="lightbox" id="img3">
                  <img src={this.state.images[2].link} alt="" />
                  <a href="#_" className="btn-close">
                    &times;
                  </a>
                </div>
              </figure>

              <figure className="gallery__item gallery__item--4">
                <a href="#img4">
                  <img
                    src={this.state.images[3].link}
                    alt="04"
                    className="gallery__img"
                  />
                </a>
                <div className="lightbox" id="img4">
                  <img src={this.state.images[3].link} alt="" />
                  <a href="#_" className="btn-close">
                    &times;
                  </a>
                </div>
              </figure>
            </div>
          </div>
        )}

        <div className="hotelss">
          {" "}
          <div className="col-md-6 hotel_des">
            <ul className="hotel_des_list">
              <li className="hotel_des_list_item">
                Bedrooms <br />
                <i class="fas fa-bed" /> <span>1</span>
              </li>
              <li className="hotel_des_list_item">
                Bathrooms <br />
                <i class="fas fa-bath" /> <span>1</span>
              </li>
              <li className="hotel_des_list_item">
                Wifi <br />
                <i class="fas fa-wifi" /> <span>Yes</span>
              </li>
              <li className="hotel_des_list_item">
                Area <br />
                <i class="fas fa-ruler" /> <span>645 ft(sq.)</span>
              </li>
              <li className="hotel_des_list_item">
                Breakfast <br />
                <i class="fas fa-coffee" />{" "}
                <span>
                  {this.state.hotel_include_breakfast == 1 && "Yes"}
                  {this.state.hotel_include_breakfast == 0 && "No"}
                </span>
              </li>
            </ul>
            <br />
            <h2 className="description_head">Description:</h2>
            {this.state.description && (
              <p className="hotel_des_p">{this.state.description}</p>
            )}

            <a href="#" className="show_more">
              Show More...
            </a>
            <br />
            <br />
            <h2 className="description_head">Featured Reviews:</h2>

            <ul className="reviews_list">
              {reviews}

              <li className="reviews_list_item">
                <button className="view_more_reviews">
                  View More Reviews..
                </button>
              </li>
            </ul>
          </div>
          <div className="col-md-4 amenities">
            <h1 className="hotel_rating">9.6</h1>
            <br />
            <h2 className="hotel_review_count">426 Reviews.</h2>
          </div>
        </div>
      </div>
    );
  }
}

export default Hotel;
