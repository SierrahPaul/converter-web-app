import '@/styles/logoBar.css'


const LogoBar = () => {
    return (
        <div className="logo-bar">

            <div className="logo-block spotify-image">
                <img src="../images/spotifyLogo.png" alt="Spotify Logo" className="spotify-img" />
            </div>

            <div className="logo-bar youtube-image">
                <img src="../images/youtubeLogo.jpg" alt="YouTube Logo" className="youtube-img" />
            </div>

        </div>
    )
}

export default LogoBar