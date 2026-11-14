import React from 'react'

export const GlobalFilter = ({filter, setFilter}) => {
    return (
        <span>
            
            <input value={filter || ''}
            onChange={e=>setFilter(e.target.value)} 
            placeholder="Search a Coin"
            className="form-control bg-blue text-light border-0  text-center"
            autoFocus
            type="text"
            style={{
                maxWidth: "600px",
                margin:"auto",
                marginBottom: "8px",
              }}/>
        </span>
    )
}
