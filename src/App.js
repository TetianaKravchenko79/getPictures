import React from "react";
// import axios from "axios";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Swal from "sweetalert2";

export default class PixabayDialog extends React.Component {
  constructor(props) {
    super(props);
    this.handleSearch = this.handleSearch.bind(this);
    this.clickSearch = this.clickSearch.bind(this);
    this.modalClose = this.modalClose.bind(this);
    this.reload = this.reload.bind(this);

    this.state = {
      items: [],
      search: "",
      show: false,
      imgModal: null,
      loading: true,
      API: "https://pixabay.com/api/?key=40654025-a957e43275ffd168e1948dc66&q=",
    };
  }

  componentDidMount() {
    this.getAPI("");
  }

  getFetch(q) {
    fetch(this.state.API + q)
      .then((responce) => {
        return responce.json();
      })
      .then((data) => {
        this.setState({
          items: data.hits,
        });
      });
  }

  getAPI(q) {
    //   const response = await axios.get(
    //     "https://pixabay.com/api/?key=40654025-a957e43275ffd168e1948dc66&q=" + q
    //   );

    //   console.log(response.data);

    //   this.setState({
    //     items: response.data.hits,
    //   });
    // }
    this.setState({
      items: [],
    });
    this.getFetch(q);

    const result = new Promise((resolve, reject) => {
      let i = 0;
      let interval = setInterval(() => {
        console.log(i);
        i++;
        if (i > 40) {
          //2сек.(может, откорректировать - меньше сделать) - search dgg
          reject("This word is not correct!");
          clearInterval(interval);
        }
        if (this.state.items.length) {
          //search dog
          clearInterval(interval);
        }
      }, 50);
    });

    result
      .then((value) => {
        // console.log(value);
        console.log("then");
      })
      .catch((value) => {
        console.log("catch");
        console.log(result);
        console.error(value);
        Swal.fire({
          icon: "error",
          text: value,
        });
        this.getAPI("");
      });
  }

  handleSearch(event) {
    this.setState({
      search: event.target.value,
    });
  }

  clickSearch() {
    this.setState({
      items: [],
    });
    if (!this.state.search) {
      this.setState({
        items: ["."],
      });
      Swal.fire({
        icon: "error",
        text: "Field 'Search' must be filled in!",
        // timer: 2000,
      });
    } else {
      if (this.enSymbols(this.state.search)) {
        setTimeout(() => {
          this.getAPI(this.state.search);
        }, 1000);
      } else {
        this.setState({
          items: ["."],
        });
        Swal.fire({
          icon: "error",
          text: "Use only Latin characters!",
        });
      }
    }
  }

  enSymbols(str) {
    let regEn = /^[a-z]+$/i; //регулярное выражение-шаблон - могут быть только латинские буквы в любом регистре
    if (str.length) {
      if (regEn.test(str)) {
        //проверка
        return true;
      }
    }
    return false;
  }

  reload() {
    this.setState({
      search: "",
    });
    this.getAPI("");
  }
  modalClose() {
    this.setState({
      show: false,
    });
  }
  modalShow(imgUrl) {
    this.setState({
      imgModal: imgUrl,
      show: true,
    });
  }

  onKeyPressHandler(event) {
    if (event.key === "Enter") {
      console.log("Pressed Enter!!!");
      this.clickSearch();
      event.preventDefault();
    }
  }

  render() {
    return (
      <div className="container p-3">
        <Modal show={this.state.show}>
          <Modal.Header>
            <Button variant="secondary" onClick={this.modalClose}>
              Close
            </Button>
          </Modal.Header>
          <Modal.Body className="text-center">
            <img className="img_modal" src={this.state.imgModal} alt="" />
          </Modal.Body>
        </Modal>
        <button
          type="button"
          className="btn btn-primary size"
          style={{
            marginBottom: "15px",
          }}
          onClick={this.reload}
        >
          Reload
        </button>
        <div className="form">
          <div className="form-group has-search">
            <span
              className="fa fa-search form-control-feedback"
              onClick={this.clickSearch}
            ></span>

            <input
              type="text"
              className="form-control search-value"
              placeholder="Search"
              onChange={this.handleSearch}
              onKeyDown={(event) => {
                this.onKeyPressHandler(event);
              }}
              value={this.state.search}
            />
          </div>
        </div>

        {this.state.items.length ? (
          <div className="row">
            {this.state.items.map((item, key) => (
              <div className="col-xl-4 col-md-6" key={key}>
                <img
                  src={item.previewURL}
                  className="img_pixabay m-2"
                  alt=""
                  onClick={() => this.modalShow(item.previewURL)}
                />
              </div>
            ))}
          </div>
        ) : (
          <img
            className="img_loader"
            src="https://upload.wikimedia.org/wikipedia/commons/c/c7/Loading_2.gif"
            alt=""
          />
        )}
      </div>
    );
  }
}
