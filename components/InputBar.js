import React, { useState } from 'react'

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
                    <h4>Please enter the playlist URL and click ‘Generate’</h4>
                    <input type="text" value={inputValue} onChange={handleInputChange} />
                    <p></p>
                    
                    {shouldClearButton && <button onClick={handleClearClick}>Clear</button>}
                                    
                </div>
    )
}

export default InputBar