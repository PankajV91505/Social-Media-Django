const WelcomeMessage = ({onGetPostClick}) =>{
    return <center className="welcome-message">
        <h1 >There are no posts.</h1>
        <button type="button" onClick={onGetPostClick}  className="btn btn-primary">Get Post From Server</button>
    </center>
}

export default WelcomeMessage;