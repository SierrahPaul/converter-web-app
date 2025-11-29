import '@/styles/logoBar.css'


const LogoBar = () => {
    return (
        <div className="logo-bar">

            <div className="logo-block spotify-image">
                <img src="../images/spotifyLogo.png" alt="Spotify Logo" />
            </div>
            
            <div className="logo-bar youtube-image">
                <img src="../images/youtubeLogo.jpg" alt="YouTube Logo" />
            </div>

        </div>
    )
}

export default LogoBar