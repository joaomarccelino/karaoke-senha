import { useEffect, useState } from "react";
import { Button, Container, Table } from "react-bootstrap";
import ModalComponent from "../../components/Modal";
import { NewSongForm } from "../../components/NewSongForm";
import { SingersSongs } from "../../components/SingerSongs";
import { useSingers } from "../../hooks/SingersContext";
import styles from './Home.module.css';

const Home = () => {
  const [newSong, setNewSong] = useState(false);
  const [currentSinger, setCurrentSinger] = useState(null);
  const [showSingersSongs, setShowSingersSongs] = useState(false);
  const [selectedSongs, setSelectedSongs] = useState(null);
  const [selectedSongsSinger, setSelectedSongsSinger] = useState(null);
  const { singers, handleAlreadySing } = useSingers();
  const baseURL = "https://www.youtube.com/results?search_query="

  function handleCurrentSinger() {
    if (singers[0]) {
      const name = singers[0].singer
      const song = singers[0].songs.find(s => s.alreadySing === false) || '';
      const singerData = {
        name,
        song
      }
      setCurrentSinger(singerData);
    }
  }

  function handleNewSong() {
    setNewSong(!newSong);
  }

  function handleShowSingerSongs(songs, singer) {
    setSelectedSongsSinger(singer);
    setSelectedSongs(songs);
    setShowSingersSongs(true);
  }

  function handleHideSingerSongs() {
    setShowSingersSongs(false);
  }

  function countUnsingedSongs(p) {
    const count = p.songs.filter(s => s.alreadySing === false);
    return count.length;
  }

  useEffect(() => {
    handleCurrentSinger();
  }, [singers]);
  return (
    <main>
      <Container className="mt-5">
        <div>
          <div className={styles.actualSinger}>
            {
              currentSinger && currentSinger.song ?
                <>
                  <h1>Cantando agora: {currentSinger.name}</h1>
                  <a href={`${baseURL}${encodeURIComponent(currentSinger.song.songName)}%20karaoke`}>{currentSinger.song.songName}</a>
                  <Button onClick={() => handleAlreadySing(currentSinger.song.songName, currentSinger.name)} variant="success">Finalizou</Button>
                </> :
                <h1>Nenhum cantor cadastrado!</h1>
            }

          </div>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th className="text-center">Ordem</th>
                <th className="text-center">Cantor</th>
                <th className="text-center">Música</th>
                <th className="text-center">Já cantadas</th>
                <th className="text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {singers
              .filter(p => {
                const check = countUnsingedSongs(p);
                if (check > 0) return p;
              })
              .map((p, index) => {
                const actualSong = p.songs.find(s => s.alreadySing === false);
                return (
                  <tr key={index}>
                    <td className="text-center">{index + 1}</td>
                    <td>{p.singer}</td>
                    <td>{actualSong.songName}</td>
                    <td className="text-center">{p.songs.filter(s => s.alreadySing === true).length}</td>
                    <td>
                      <div className="text-center d-flex justify-content-around">
                        <Button onClick={() => handleShowSingerSongs(p.songs, p.singer)}>Próximas</Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </div>
        <Button onClick={handleNewSong}>Nova música</Button>
        <ModalComponent
          show={newSong}
          setShow={() => setNewSong(false)}
        >
          <NewSongForm />
        </ModalComponent>
        <ModalComponent
          show={showSingersSongs}
          setShow={() => setShowSingersSongs(false)}
        >
          <SingersSongs songs={selectedSongs} singer={selectedSongsSinger} setSingerSongs={handleHideSingerSongs} />
        </ModalComponent>
      </Container>
    </main>
  )
}

export { Home }