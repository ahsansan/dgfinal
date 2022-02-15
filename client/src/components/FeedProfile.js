// React Responsive Masonry
import Masonry from "react-responsive-masonry";
// Custom CSS
import "../styles/components/feed.css";
// FontAwesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComment,
  faHeart,
  faPaperPlane,
} from "@fortawesome/free-regular-svg-icons";
// Import React Router DOM
import { Link, useParams } from "react-router-dom";
// OAS
import Aos from "aos";
import "aos/dist/aos.css";
// Hooks
import { useState, useEffect, useContext } from "react";
// API and Context
import { UserContext } from "../context/userContext";
import { API } from "../config/api";
// Detail Feed
import DetailFeed from "./DetailFeed";
// path
const path = "http://localhost:5000/uploads/";

function FeedProfile() {
  const { id } = useParams();
  // Animation
  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);
  // Detail Feed Modal
  const [state, dispatch] = useContext(UserContext);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  // feed by id
  const [feeds, setFeeds] = useState([]);
  const [feedsId, setFeedId] = useState({});
  // load Feed
  const showFeedFollow = async () => {
    try {
      const response = await API.get(`/feedscount/${id}`);
      setFeeds(response.data.data.feeds); // id follow
    } catch (error) {
      console.log(error);
    }
  };
  // order feed
  feeds.reverse();

  // Like
  const [likeUser, setLikeUser] = useState([]);

  const loadLike = async () => {
    try {
      const response = await API.get(`/like/${state.user.id}`);
      setLikeUser(response.data.like);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLike = (event) => {
    const id = event.target.getAttribute("content");
    like(id);
  };

  const like = async (id) => {
    try {
      const body = JSON.stringify({ id });
      const headers = {
        headers: { "Content-Type": "application/json" },
      };
      const response = await API.post("/like", body, headers);

      showFeedFollow();
      loadLike();
    } catch (error) {
      console.log(error);
    }
  };

  // Load loadLike
  useEffect(() => {
    loadLike();
  }, []);

  // Load loadFeedFollow
  useEffect(() => {
    showFeedFollow();
  }, []);

  return (
    <div data-aos="fade-up">
      <Masonry columnsCount={3}>
        {feeds.map((feed) => (
          <div
            className="feed-container"
            key={feed.id}
            onClick={() => setFeedId(feed)}
          >
            <div className="feed-gambar">
              <img
                alt="Gambar Feed"
                src={process.env.PUBLIC_URL + path + `${feed.fileName}`}
                onClick={handleShow}
                className="images-feed"
              />
            </div>
            <div className="feed-keterangan">
              <div className="prof-box">
                <div className="profile">
                  <img
                    src={process.env.PUBLIC_URL + path + `${feed.user.image}`}
                    className="card-profiles"
                    alt="pp"
                  />
                  <p className="post-name">
                    <Link to={`/profile/${feed.user.id}`}>
                      {feed.user.username}
                    </Link>
                  </p>
                </div>
                <div className="icon-container">
                  {feed.like ? (
                    <FontAwesomeIcon
                      className="card-icon text-danger"
                      onClick={handleLike}
                      icon={faHeart}
                      content={feed.id}
                    />
                  ) : (
                    <FontAwesomeIcon
                      className="card-icon"
                      onClick={handleLike}
                      icon={faHeart}
                      content={feed.id}
                    />
                  )}
                  <FontAwesomeIcon
                    className="card-icon"
                    icon={faComment}
                    onClick={handleShow}
                  />
                  <FontAwesomeIcon className="card-icon" icon={faPaperPlane} />
                </div>
              </div>
            </div>
            <div className="navlike">
              <div>
                <p className="like-total">{feed.like} Like</p>
              </div>
            </div>
          </div>
        ))}
        <DetailFeed
          show={show}
          handleClose={handleClose}
          feedsId={feedsId}
          showFeedFollow={showFeedFollow}
        />
        <br />
        <br />
      </Masonry>
    </div>
  );
}

export default FeedProfile;
