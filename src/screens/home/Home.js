import React, { Component } from "react";
import { Grid, FormControl } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Avatar from "@material-ui/core/Avatar";
import Header from "../../common/header/Header";
import profileImage from "../../assets/upgrad.svg";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import IconButton from "@material-ui/core/IconButton";
import FavoriteIcon from "@material-ui/icons/Favorite";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Redirect } from "react-router-dom";
import $ from "jquery";

import "./Home.css";

// Custom Styles to over ride material ui default styles
const styles = (theme) => ({
  root: {
    //style for the root
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  grid: {
    //style for the grid component
    padding: "20px",
    "margin-left": "10%",
    "margin-right": "10%",
  },
  card: {
    //style for the card component
    maxWidth: "100%",
  },
  media: {
    // style for the image in the card
    height: "56.25%",
    width: "100%",
    // paddingTop: '56.25%', // 16:9
  },
  avatar: {
    //style for the avatar in the card header

    margin: 10,
    width: 60,
    height: 60,
  },
  title: {
    //Style for the title of the card
    "font-weight": "600",
  },

  addCommentBtn: {
    // ADD button styling
    "margin-left": "15px",
  },

  comment: {
    //for the form control
    "flex-direction": "row",
    "margin-top": "25px",
    "align-items": "baseline",
    "justify-content": "center",
  },

  commentUsername: {
    //style for the userName of the comment
    fontSize: "inherit",
  },
});

// Creating Home class component to render the home page as per the design
class Home extends Component {
  constructor() {
    super();
    this.state = {
      respdata: [
        {
          id: "17848514759505485",
        },
        {
          id: "17908666795620558",
          caption: "Christmas time",
        },
        {
          id: "17892009775880031",
          caption: "Playing on rockers",
        },
        {
          id: "17857552316452074",
          caption: "Dancing",
        },
        {
          id: "17856506198409793",
          caption: "Vedanshi",
        },
      ],
      imageInfo: [],
      images: [],
      comments: [],
      profile_picture: sessionStorage.getItem("profile_picture"),
      userName: sessionStorage.getItem("username"),
      commentText: "",
      searchOn: false,
      originalImageArr: {},
      isLoggedIn: sessionStorage.getItem("access-token") == null ? false : true,
      accessToken: sessionStorage.getItem("access-token"),
      count: 1,
    };
  }

  async getImageDetails(x) {
    let myPromise = new Promise((resolve, reject) => {
      $.ajax({
        url:
          "https://graph.instagram.com/" +
          x.id +
          "?fields=id,media_type,media_url,username,timestamp&access_token=IGQVJVYTk2Q1d1NG0xOU5Td3p4QUkzQ0NTQkk1bi1kcGVmOXBjbWN1SUE2b1JqQ1lLNmpEZAHdwc3RacmZAQbTc4Q2pUd05qM213NjduMWppSXYxMVRlMk04SEFIcGpkYTk3am9mei1FZA2lWYVdZAWWZARNgZDZD",
        type: "GET",
        headers: { Accept: "application/json" },
        success: function(data) {
          data.caption = x.caption ? x.caption : "";
          var imgDetail = data;
          resolve(imgDetail);
        },
        error: function(error) {
          alert(JSON.stringify(error));
          reject(); // signify the promise faulted with no return value
        },
      });
    });
    let userid = await myPromise;
    return userid;
  }
  // As per the warning UNSAFE_ is prefixed before componentWillMount method
  // In this method all the api will be called before the component is show,
  // the rendering will occur once all the initial state are set
  UNSAFE_componentWillMount() {
    /*Get data from first API endpoint
    This is called to get the imageIds of the logged-in user
    API calls are made only when the user is Logged in*/
    let that = this;
    if (that.state.isLoggedIn) {
      let data = null;
      let xhr = new XMLHttpRequest();
      xhr.addEventListener("readystatechange", function() {
        if (xhr.readyState === 4) {
          that.setState({
            /*Set the respData to get the imageIds along with captions*/
            respdata: JSON.parse(that.responseText).data,
          });
        }
      });
      xhr.open(
        "GET",
        that.props.baseUrl +
          "me/media?fields=id,caption&access_token=" +
          that.state.accessToken
      );
      xhr.send(data);
    }

    /*Get data from second api all the images
    This api is called to get all the images data posted by the user
    This data will maintained in state as an array and the same of the array is images
    API calls are made only when the user is Logged in*/
    if (this.state.isLoggedIn) {
      let promiseArr = this.state.respdata.map((x) => this.getImageDetails(x));
      //Resolve the promise array and resturcture the data
      Promise.all(promiseArr)
        .then((values) => {
          that.setState({ imageInfo: values });
          that.reStructureData();
        })
        .catch((error) => {
          console.error(error.message);
        });
    }
  }

  reStructureData = () => {
    var tempImages = [];
    this.state.imageInfo.forEach((img) => {
      var imgObj = {
        id: img.id,
        created_time: new Date(img.timestamp).toLocaleString(),
        caption: {
          from: {
            profile_picture: img.media_url,
            username: img.username,
          },
          text: img.caption + "#" + img.id,
        },
        images: { standard_resolution: { url: img.media_url } },
        user_has_liked: 1,
        likes: { count: 1 },
      };
      tempImages.push(imgObj);
    });
    this.loadHomePage(tempImages);
  };
  //This method takes the image array as sets it to the state images array triggering rerender
  loadHomePage = (imageArr) => {
    this.setState({
      ...this.state,
      images: imageArr,
    });
  };

  //Method used to handle changes in the comment input text
  //This method takes the imageId as one parameter which is added to comment object and then updates the commentText state
  //ImageId is given so that the comment input line of active card only shows the input text given.
  onCommentTextChangeHandler = (event, imageId) => {
    var comment = {
      id: imageId,
      text: event.target.value,
    };
    this.setState({
      ...this.state,
      commentText: comment,
    });
  };

  //This method is to handle the ADD button beside the comment text box
  // This Method takes imageId so that comment is added/shown to the image it was added to
  //Don't add blank comment
  //Count is to keep key unique for every comment added
  //username is to keep the username if the user commented
  //Comments are stored in the comment array controlled by state
  //Once the comment is pushed to the state comment array commentText is made empty so that comment input box returns to empty line
  onClickAddBtn = (imageId) => {
    if (this.state.commentText.text) {
      var count = this.state.count;
      var comment = {
        id: count,
        imageId: imageId,
        username: this.state.userName,
        text: this.state.commentText.text,
      };
      count++;
      var comments = [...this.state.comments, comment];
      this.setState({
        ...this.state,
        count: count,
        comments: comments,
        commentText: "",
      });
    }
  };

  // This Handles when the like button is clicked.
  //The like button is favorite icon
  // when the like button is clicked the corresponding imageId is passed,
  //which is iterated over a loop to find the images and the boolean value of user_has_liked is changed to false
  //The likes count is either increased or decreased based on the previous state of user_has_liked
  likeBtnHandler = (imageId) => {
    var i = 0;
    var imageArray = this.state.images;
    for (i; i < imageArray.length; i++) {
      if (imageArray[i].id === imageId) {
        if (imageArray[i].user_has_liked === true) {
          // check to see if user has already liked
          imageArray[i].user_has_liked = false; // changing the status os user_has_liked
          imageArray[i].likes.count--; // Changing the count of the likes
          this.setState({
            images: imageArray,
          });
          break;
        } else {
          imageArray[i].user_has_liked = true; // changing the status os user_has_liked
          imageArray[i].likes.count++; // Changing the count of the likes
          this.setState({
            images: imageArray,
          });
          break;
        }
      }
    }
  };
  //This method is called from the header,this is passed as a props to the header
  //Method handles when search input is changed
  //The method takes the keyword checks with the caption and the images is updated with caption matching with keyword,
  //thus triggering render and only showing those images
  //The method maintains the original data in the controlled state using originalImageArr until the searchON is true
  //Once the search is complete or search input value is ""then the images is set to originalImageArr rendering back to original state
  onSearchTextChange = (keyword) => {
    if (!(keyword === "")) {
      //check if search input value is empty
      var originalImageArr = [];
      //First search the originalImageArr is set to images following it is set to itself so that data is not lost.
      this.state.searchOn
        ? (originalImageArr = this.state.originalImageArr)
        : (originalImageArr = this.state.images);
      var updatedImageArr = [];
      var searchOn = true; // changing the searchOn to true until it is keyword is null
      keyword = keyword.toLowerCase(); //changing to lower case for comparison

      originalImageArr.forEach((element) => {
        // extracting the caption and changing to lower case
        var caption = element.caption.text.split("\n")[0].toLowerCase();
        if (caption.includes(keyword)) {
          //checking if keyword is substring of caption
          updatedImageArr.push(element); //if yes adding to the updatedImageArr
        }
      });
      if (!this.state.searchOn) {
        // For the first search
        this.setState({
          ...this.state,
          searchOn: searchOn,
          images: updatedImageArr,
          originalImageArr: originalImageArr,
        });
      } else {
        this.setState({
          //Until keyword is null
          ...this.state,
          images: updatedImageArr,
        });
      }
    } else {
      //If keyword is null then search is not On and corresponding changes are done
      searchOn = false;
      this.setState({
        ...this.state,
        searchOn: searchOn,
        images: this.state.originalImageArr,
        originalImageArr: [],
      });
    }
  };

  render() {
    // Styles are stored in the const classes
    const { classes } = this.props;
    return (
      <div>
        {/* Rending the Header and passing three parameter profile_picture,showSearchBox & showProfileIcon based on the value it is shown in the header */}
        <Header
          profile_picture={this.state.profile_picture}
          showSearchBox={this.state.isLoggedIn ? true : false}
          showProfileIcon={this.state.isLoggedIn ? true : false}
          onSearchTextChange={this.onSearchTextChange}
          showMyAccount={true}
        />
        {this.state.isLoggedIn === true ? ( //checking isLoggedIn is true only then the images are shown
          <div className="flex-container">
            <Grid
              container
              spacing={3}
              wrap="wrap"
              alignContent="center"
              className={classes.grid}
            >
              {this.state.images.map((
                image //Iteration over images array and rendering each element of array as per the design.
              ) => (
                // components are data to the components are given as per the design and guidelines given
                //Grid Used to create two coloumns
                //Card used to show the images in two columns
                //Card Header to set the header of the card
                //Card Content to set the card content
                <Grid key={image.id} item xs={12} sm={6} className="grid-item">
                  <Card className={classes.card}>
                    <CardHeader
                      classes={{
                        title: classes.title,
                      }}
                      avatar={
                        <Avatar
                          src={this.state.profile_picture}
                          className={classes.avatar}
                        />
                      }
                      title={image.caption.from.username}
                      subheader={image.created_time}
                      className={classes.cardheader}
                    />

                    <CardContent>
                      <img
                        src={image.images.standard_resolution.url}
                        alt={profileImage}
                        className={classes.media}
                      />
                      <div className="horizontal-rule" />
                      <div className="image-caption">
                        {image.caption.text.substring(
                          0,
                          image.caption.text.indexOf("#")
                        )}
                      </div>
                      <div className="image-hashtags">
                        {image.caption.text.substring(
                          image.caption.text.indexOf("#")
                        )}
                      </div>
                      <div>
                        <IconButton
                          className="like-button"
                          aria-label="like-button"
                          onClick={() => this.likeBtnHandler(image.id)}
                        >
                          {/* Based on the condition of the icon will be filled red or only the border */}
                          {image.user_has_liked ? (
                            <FavoriteIcon
                              className="image-liked-icon"
                              fontSize="large"
                            />
                          ) : (
                            <FavoriteBorderIcon
                              className="image-like-icon"
                              fontSize="large"
                            />
                          )}
                        </IconButton>
                        {/* if like count is 1 it will show like or else likes */}
                        {image.likes.count === 1 ? (
                          <span>{image.likes.count} like</span>
                        ) : (
                          <span>{image.likes.count} likes</span>
                        )}
                      </div>
                      {this.state.comments.map(
                        (
                          comment //Iterating over comment array to show the comment to the corresponding image only
                        ) =>
                          image.id === comment.imageId ? ( //check if comment.imageId and imageId is same only the append the comment
                            <div className="comment-display" key={comment.id}>
                              <Typography
                                variant="subtitle2"
                                className={classes.commentUsername}
                                gutterbottom="true"
                              >
                                {comment.username}:
                              </Typography>
                              <Typography
                                variant="body1"
                                className="comment-text"
                                gutterbottom="true"
                              >
                                {comment.text}
                              </Typography>
                            </div>
                          ) : (
                            ""
                          )
                      )}
                      {/* Input to add comment consist of Input ,InputLabel and ADD button */}
                      <FormControl className={classes.comment} fullWidth={true}>
                        <InputLabel htmlFor="comment">Add a comment</InputLabel>
                        <Input
                          id={"comment" + image.id}
                          className="comment-text"
                          name="commentText"
                          onChange={(event) =>
                            this.onCommentTextChangeHandler(event, image.id)
                          }
                          value={
                            image.id === this.state.commentText.id
                              ? this.state.commentText.text
                              : ""
                          }
                        />
                        <Button
                          variant="contained"
                          color="primary"
                          className={classes.addCommentBtn}
                          onClick={() => this.onClickAddBtn(image.id)}
                        >
                          ADD
                        </Button>
                      </FormControl>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </div>
        ) : (
          <Redirect to="/" />
        ) //If the user is not logged in then redirecting to login page
        }
      </div>
    );
  }
}

export default withStyles(styles)(Home);
