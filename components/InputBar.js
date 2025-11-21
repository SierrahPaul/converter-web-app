import { useState } from 'react'

const InputBar = () => {

    const [inputValue, setInputValue] = useState("")

    const handleInputChange = (event) =>{
        setInputValue(event.target.value)
    }

    const handleClearClick = () => {
        setInputValue("")
    }

    const shouldClearButton = inputValue.length > 0

    return (
                <div id="input-bar">
                    <h1>Welcome to the Spotify to YouTube Music Converter</h1>
                    <h4>Please enter the playlist URL and click ‘Generate’</h4>
                    <input type="text" value={inputValue} onChange={handleInputChange} />
                    {shouldClearButton && <button onClick={handleClearClick}>Clear</button>}

                    <p></p>
                    <button id="generate-button">Generate</button>
                                    
                </div>
    )
}

export default InputBar