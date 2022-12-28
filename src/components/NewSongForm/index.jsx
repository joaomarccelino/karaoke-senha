import { useState } from "react"
import { Button, Form } from "react-bootstrap"
import { useSingers } from "../../hooks/SingersContext";

const NewSongForm = () => {
  const [singer, setSinger] = useState('');
  const [singerId, setSingerId] = useState('');
  const [song, setSong] = useState('');
  const [newSinger, setNewSinger] = useState(true);
  function handleNewSinger() {
    setNewSinger(!newSinger)
  }

  const { singersNames, handleAddSingers, handleAddSong } = useSingers();

  function handleAddNewSong(event) {
    if (newSinger) {
      const singerData = {
        singer,
        songs: [
          {
            songName: song,
            alreadySing: false,
            time: new Date().getTime()
          }
        ]
      }
      handleAddSingers(singerData);
    } else {
      handleAddSong(song, singerId);
    }
  }

  return (
    <div>
      <Button onClick={handleNewSinger}>{newSinger ? 'Cantor já existente' : 'Novo cantor?'}</Button>
      <Form onSubmit={() => handleAddNewSong()}>
        {!newSinger ?
          <Form.Group className="mb-3">
            <Form.Label>Cantor</Form.Label>
            <select
              className="form-select"
              value={singerId}
              onChange={(e) => setSingerId(e.target.value)}
            >
              <option value="" selected disabled hidden>Escolha um cantor</option>
              {
                singersNames.map((name, index) =>
                  <option value={index} id={index.toString()} key={index}>{name}</option>
                )
              }
            </select>
          </Form.Group>
          :
          <Form.Group className="mb-3">
            <Form.Label>Cantor</Form.Label>
            <Form.Control
              type="text"
              placeholder="Fulano de tal..."
              value={singer}
              onChange={(e) => setSinger(e.target.value)}
            />
          </Form.Group>

        }
        <Form.Group className="mb-3">
          <Form.Label>Música</Form.Label>
          <Form.Control
            type="text"
            placeholder="Escolha a música..."
            value={song}
            onChange={(e) => setSong(e.target.value)}
          />
        </Form.Group>
        <Button type="submit">Enviar</Button>
      </Form>
    </div>
  )
}

export { NewSongForm }