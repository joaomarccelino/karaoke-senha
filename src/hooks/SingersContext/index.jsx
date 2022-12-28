import { createContext, useContext, useEffect, useState } from "react";

export const SingersContext = createContext();

export function SingersContextProvider({ children }) {
  const [singers, setSingers] = useState([]);
  const [singersNames, setSingersNames] = useState([]);

  function countSongs(p) {
    const count = p.songs.filter(s => s.alreadySing === true);
    const countUnsinged = p.songs.filter(s => s.alreadySing === false);
    if (countUnsinged.length > 0) {
      return count.length;
    } else {
      return 100;
    }
  }

  function getSingersNames(names) {
    const newNames = names.map((s) => s.singer);
    setSingersNames(newNames);
  }

  function orderByDate(p1, p2) {
    const actualSongP1 = p1.songs.find(s => s.alreadySing === false);
    const actualSongP2 = p2.songs.find(s => s.alreadySing === false) || null;

    if ((actualSongP1 && actualSongP2) && actualSongP1.time > actualSongP2.time) {
      return 1
    } else if ((actualSongP1 && actualSongP2) && actualSongP1.time < actualSongP2.time) {
      return -1
    } else {
      return 0
    }
  }

  async function getSingers() {
    const singersData = await JSON.parse(localStorage.getItem('singers') || '[]');
    if (singersData.length > 1) {
      const orderedSingers = singersData.sort(
        (p1, p2) =>
          (countSongs(p1) > countSongs(p2)) ? 1 : (countSongs(p1) < countSongs(p2)) ? -1 : orderByDate(p1, p2)
      )
      singersData && setSingers(orderedSingers);
      getSingersNames(singersData);
    } else {
      singersData && setSingers(singersData);
      getSingersNames(singersData);
    }
  }

  async function handleAddSingers(newSinger) {
    const singersData = await JSON.parse(localStorage.getItem('singers') || '[]');
    const newSingersData = [...singersData, newSinger];
    if (newSingersData.length > 1) {
      const orderedSingers = newSingersData.sort(
        (p1, p2) =>
          (countSongs(p1) > countSongs(p2)) ? 1 : (countSongs(p1) < countSongs(p2)) ? -1 : 0
      );
      localStorage.setItem('singers', JSON.stringify(orderedSingers));
    } else {
      localStorage.setItem('singers', JSON.stringify(newSingersData));
    }

    getSingers();
  }

  async function handleAddSong(newSong, id) {
    const songData = {
      songName: newSong,
      alreadySing: false,
      time: new Date().getTime()
    }
    const singersData = await JSON.parse(localStorage.getItem('singers') || '[]');
    const newData = [...singersData];
    const singerData = singersData[id]
    const newSingerData = { ...singerData, songs: [...singerData.songs, songData] };
    newData.splice(id, 1);
    newData.push(newSingerData);
    if (newData.length > 1) {
      const orderedSingers = newData.sort(
        (p1, p2) =>
          (countSongs(p1) > countSongs(p2)) ? 1 : (countSongs(p1) < countSongs(p2)) ? -1 : 0
      );
      localStorage.setItem('singers', JSON.stringify(orderedSingers));
    } else {
      localStorage.setItem('singers', JSON.stringify(newData));
    }
    getSingers();

  }

  // async function handleAlreadySing(songId, singerId) {
  //   const singersData = await JSON.parse(localStorage.getItem('singers') || '[]');
  //   const newData = [...singersData];
  //   newData[singerId].songs[songId].alreadySing = true;
  //   const orderedSingers = newData.sort(
  //     (p1, p2) =>
  //       (countSongs(p1) > countSongs(p2)) ? 1 : (countSongs(p1) < countSongs(p2)) ? -1 : 0
  //   );
  //   localStorage.setItem('singers', JSON.stringify(orderedSingers));
  //   alert("Música finalizada!");
  //   getSingers();
  //  }

  async function handleAlreadySing(songName, singerName) {
    const singerId = singers.findIndex(s => s.singer === singerName);
    const songId = singers[singerId].songs.findIndex(s => s.songName === songName);
    getSingers();
    const newData = [...singers];
    const singerData = newData[singerId]
    const newSongs = singerData.songs
    const newSong = newSongs[songId]
    newSongs.splice(songId, 1);
    const newSongData = { ...newSong, alreadySing: true };
    newSongs.push(newSongData);
    const newSingerData = { ...singerData, songs: newSongs }
    newData.splice(singerId, 1);
    newData.push(newSingerData);
    localStorage.setItem('singers', JSON.stringify(newData));
    alert("Música finalizada!");
    getSingers();
  }

  async function handleRemoveSong(songName, singerName) {
    const singerId = singers.findIndex(s => s.singer === singerName);
    const songId = singers[singerId].songs.findIndex(s => s.songName === songName);
    const newData = [...singers];
    const singerData = singers[singerId]
    const newSongs = singerData.songs
    newSongs.splice(songId, 1);
    const newSingerData = { ...singerData, songs: newSongs }
    newData.splice(singerId, 1);
    newData.push(newSingerData)
    const orderedSingers = newData.sort(
      (p1, p2) =>
        (countSongs(p1) > countSongs(p2)) ? 1 : (countSongs(p1) < countSongs(p2)) ? -1 : 0
    );
    localStorage.setItem('singers', JSON.stringify(orderedSingers));
    getSingers();
    alert("Removido com sucesso!");
  }

  useEffect(() => {
    getSingers();
  }, []);

  return (
    <SingersContext.Provider
      value={{ singers, singersNames, handleAddSingers, handleAddSong, handleAlreadySing, handleRemoveSong }}
    >
      {children}
    </SingersContext.Provider>
  )
}

export const useSingers = () => {
  return useContext(SingersContext);
}