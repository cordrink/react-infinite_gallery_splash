import React, { useEffect, useRef, useState } from "react";
import "./InfiniteScroll.css";
import { v4 as uuidv4 } from "uuid";

export default function InfiniteScroll() {
  const [dataImg, setDataImg] = useState([[], [], []]);
  const [pageIndex, setPageIndex] = useState(1);
  const [searchState, setSearchState] = useState("random");
  const [firstCall, setFirstCall] = useState(true);

  const infiniteFetchData = () => {
    fetch(
      `https://api.unsplash.com/search/photos?page=${pageIndex}&per_page=30&query=${searchState}&client_id=ACCESS_KEY_UNSPLASH`
    )
      .then((reponse) => reponse.json())
      .then((data) => {
        const imgsReceived = [];

        data.results.forEach((img) => {
          imgsReceived.push(img.urls.regular);
        });

        const newFreshState = [
          [...dataImg[0]],
          [...dataImg[1]],
          [...dataImg[2]],
        ];

        let index = 0;
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 10; j++) {
            newFreshState[i].push(imgsReceived[index]);
            index++;
          }
        }

        setDataImg(newFreshState);
        setFirstCall(false);
      });
  };

  const searchFetchData = () => {
    fetch(
      `https://api.unsplash.com/search/photos?page=${pageIndex}&per_page=30&query=${searchState}&client_id=ACCESS_KEY_UNSPLASH`
    )
      .then((reponse) => reponse.json())
      .then((data) => {
        const imgsReceived = [];

        data.results.forEach((img) => {
          imgsReceived.push(img.urls.regular);
        });

        const newFreshState = [[], [], []];

        let index = 0;
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 10; j++) {
            newFreshState[i].push(imgsReceived[index]);
            index++;
          }
        }

        setDataImg(newFreshState);
      });
  };

  useEffect(() => {
    if (firstCall) return;

    searchFetchData();
  }, [searchState]);

  useEffect(() => {
    infiniteFetchData();
  }, [pageIndex]);

  useEffect(() => {
    window.addEventListener("scroll", infiniteCheck);
    return () => {
      window.removeEventListener("scroll", infiniteCheck);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();

    setSearchState(inpRef.current.value);
    setPageIndex(1);
  };

  const inpRef = useRef();

  const infiniteCheck = () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    if (scrollHeight - scrollTop === clientHeight) {
      setPageIndex((pageIndex) => pageIndex + 1);
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSearch}>
        <label htmlFor="search">Votre recherche</label>
        <input type="search" id="search" ref={inpRef} />
      </form>

      <div className="card-list">
        <div>
          {dataImg[0].map((img) => {
            return <img key={uuidv4()} src={img} alt="img unsplash" />;
          })}
        </div>
        <div>
          {dataImg[1].map((img) => {
            return <img key={uuidv4()} src={img} alt="img unsplash" />;
          })}
        </div>
        <div>
          {dataImg[2].map((img) => {
            return <img key={uuidv4()} src={img} alt="img unsplash" />;
          })}
        </div>
      </div>
    </div>
  );
}
