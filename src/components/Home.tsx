import { useEffect, useState } from 'react'
import {
  Container,
  Row,
  Col,
  Form,
  FormControl,
  ListGroup,
} from 'react-bootstrap'
import { io } from 'socket.io-client'

// 1) EVERY TIME WE REFRESH THE PAGE, THE CLIENTS CONNECTS TO THE SERVER
// 2) IF THIS CONNECTION ESTABLISHES CORRECTLY, THE SERVER WILL EMIT TO US
// AN EVENT OF TYPE 'CONNECT
// 3) FROM THE CLIENT WE CAN LISTEN TO THE 'CONNECT' EVENT WITH A socket.on()
// 4) ONCE THAT 'connect' EVENT IS RECEIVED FROM THE CLIENT, WE CAN SUBMIT OUR USERNAME
// 5) WE SUBMIT OUR USERNAME TO THE SERVER EMITTING AN EVENT OF TYPE 'setUsername'
// 6) THE SERVER LISTENS FOR IT, LISTS US IN THE ONLINE USERS LIST AND EMITS BACK AN EVENT
// TO US CALLED 'loggedin'
// 7) FINALLY WE CAN LISTEN FOR THIS 'loggedin' EVENT AND acknowledge THE SUCCESSFUL LOG IN PROCESS
// 8) IF WE'RE SUCCESFULLY LOGGED IN, LET's DISABLE THE USERNAME INPUT FIELD AND ENABLE THE MESSAGE ONE

const ADDRESS = 'http://localhost:3030'
const socket = io(ADDRESS, { transports: ['websocket'] })
// overriding the default trasports value in order to just leverage the
// websocket protocol

const Home = () => {
  const [username, setUsername] = useState('')
  const [message, setMessage] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    // this code will be executed just once!
    // we need to set up our event listeners just once!
    // ...so we're going to put them here :)
    socket.on('connect', () => {
      // the server emits an event of type 'connect' every time a client
      // successfully established a connection
      console.log('Connection established!')
    })

    // let's now listen for another type of event, 'loggedin'
    // this should happen once AFTER sending our username
    socket.on('loggedin', () => {
      console.log('logged in successfully!')
      setLoggedIn(true)
    })
  }, [])

  const handleUsernameSubmit = () => {
    // let's send our username to the server!
    // this time it's our turn to EMIT an EVENT to the server
    // we need to emit an event of type 'setUsername', since this is
    // the type of the event the server is already listening for
    socket.emit('setUsername', {
      username: username,
    })
    // after sending our username from the client,
    // if everything goes well the backend will emit us back another event
    // called 'loggedin' <-- this concludes the login process and puts us
    // in the online users list
  }

  return (
    <Container fluid>
      <Row style={{ height: '95vh' }} className="my-3">
        <Col md={9} className="d-flex flex-column justify-content-between">
          {/* LEFT COLUMN */}
          {/* TOP AREA: USERNAME INPUT FIELD */}
          {/* {!loggedIn && ( */}
          <Form
            onSubmit={(e) => {
              e.preventDefault()
              handleUsernameSubmit()
            }}
          >
            <FormControl
              placeholder="Set your username here"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loggedIn}
            />
          </Form>
          {/* )} */}
          {/* MIDDLE AREA: CHAT HISTORY */}
          <ListGroup>
            <ListGroup.Item>Cras justo odio</ListGroup.Item>
            <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
            <ListGroup.Item>Morbi leo risus</ListGroup.Item>
            <ListGroup.Item>Porta ac consectetur ac</ListGroup.Item>
            <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
          </ListGroup>
          {/* BOTTOM AREA: NEW MESSAGE */}
          <Form>
            <FormControl
              placeholder="Write your message here"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={!loggedIn}
            />
          </Form>
        </Col>
        <Col md={3}>
          {/* ONLINE USERS SECTION */}
          <div className="mb-3">Connected users:</div>
          <ListGroup>
            <ListGroup.Item>Cras justo odio</ListGroup.Item>
            <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
            <ListGroup.Item>Morbi leo risus</ListGroup.Item>
            <ListGroup.Item>Porta ac consectetur ac</ListGroup.Item>
            <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    </Container>
  )
}

export default Home
