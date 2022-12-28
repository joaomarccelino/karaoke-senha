import { Button, Table } from "react-bootstrap"
import { useSingers } from "../../hooks/SingersContext"

const SingersSongs = ({ songs, singer, setSingerSongs }) => {

  const { handleRemoveSong } = useSingers();

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th className="text-center">Ordem</th>
          <th className="text-center">Música</th>
          <th className="text-center">Ações</th>
        </tr>
      </thead>
      <tbody>
        {
          songs
            .filter(s => s.alreadySing === false)
            .map((s, index) => {
              return (
                <tr key={index}>
                  <td className="text-center">{index + 1}</td>
                  <td>{s.songName}</td>
                  <td>
                    <div className="text-center d-flex justify-content-around">
                      <Button variant="danger" onClick={() => handleRemoveSong(s.songName, singer)}>Excluir</Button>
                    </div>
                  </td>
                </tr>
              )
            })
        }
      </tbody>
    </Table>
  )
}

export { SingersSongs };